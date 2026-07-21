import type { MaybeRefOrGetter } from 'vue'
import type { KanbanColumn, KanbanCounts, TaskListFilters } from '~/features/tasks/types/task.types'
import { createCompanyTasksApi } from '~/features/tasks/composables/createCompanyTasksApi'
import { extractResults } from '~/shared/utils/paginated.util'

/**
 * Server state del Kanban (groupBy = all) vía TanStack Query.
 *
 * NOTA: in_review y complete aún no tienen endpoint de lista.
 * Rechazada: skeleton mientras cargan counts; se oculta solo si count === 0.
 */
export function useKanbanTasks(filters: MaybeRefOrGetter<TaskListFilters> = {}) {
  const api = createCompanyTasksApi(filters)
  const scope = ['kanban']

  const counts = api.countsQuery<KanbanCounts>(scope, '/kanban/counts/')
  const pending = api.listQuery([...scope, 'pending'], '/kanban/pending/')
  const wip = api.listQuery([...scope, 'wip'], '/kanban/wip/')

  const rejectedCount = computed(() => counts.data.value?.rejected ?? 0)
  const countsReady = computed(() => counts.isFetched.value)
  const showRejected = computed(() => !countsReady.value || rejectedCount.value > 0)

  const rejected = api.listQuery([...scope, 'rejected'], '/kanban/rejected/', {
    enabled: () => countsReady.value && rejectedCount.value > 0,
  })

  const columns = computed<KanbanColumn[]>(() => {
    const totals = counts.data.value

    const allColumns: KanbanColumn[] = [
      {
        id: 'pending',
        labelKey: 'tasks.kanban.columns.pending',
        color: '#6b7280',
        count: totals?.pending,
        tasks: extractResults(pending.data.value),
        loading: pending.isPending.value,
        error: pending.isError.value,
      },
      {
        id: 'wip',
        labelKey: 'tasks.kanban.columns.wip',
        color: '#6366f1',
        count: totals?.wip,
        tasks: extractResults(wip.data.value),
        loading: wip.isPending.value,
        error: wip.isError.value,
      },
      {
        id: 'in_review',
        labelKey: 'tasks.kanban.columns.inReview',
        color: '#f97316',
        count: totals?.in_review,
        tasks: [],
        loading: false,
        error: false,
        comingSoon: true,
      },
      {
        id: 'rejected',
        labelKey: 'tasks.kanban.columns.rejected',
        color: '#dc2626',
        count: countsReady.value ? rejectedCount.value : undefined,
        tasks: extractResults(rejected.data.value),
        loading: !countsReady.value || rejected.isPending.value,
        error: rejected.isError.value,
      },
      {
        id: 'complete',
        labelKey: 'tasks.kanban.columns.complete',
        color: '#28ceab',
        count: totals?.complete,
        tasks: [],
        loading: false,
        error: false,
        comingSoon: true,
      },
    ]

    return allColumns.filter(column => column.id !== 'rejected' || showRejected.value)
  })

  return { counts, pending, wip, rejected, columns }
}
