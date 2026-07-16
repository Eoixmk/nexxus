import { useQuery } from '@tanstack/vue-query'
import type { MaybeRefOrGetter } from 'vue'
import type { PaginatedResponse } from '~/shared/types/api.types'
import type {
  KanbanColumn,
  KanbanCounts,
  Task,
  TaskListFilters,
} from '~/features/tasks/types/task.types'
import { extractResults, toTaskListQuery } from '~/features/tasks/utils/task-api.util'

/**
 * Server state del Kanban (groupBy = all) vía TanStack Query.
 *
 * Reutiliza los mismos query params que las listas (`toTaskListQuery`):
 * short_description, type, project, overdue, completed, multiple_close.
 *
 * NOTA: la empresa está fija en 1 por ahora (TODO: derivar de la empresa
 * seleccionada). in_review y complete aún no tienen endpoint de lista.
 */
export function useKanbanTasks(filters: MaybeRefOrGetter<TaskListFilters> = {}) {
  const { $api } = useNuxtApp()
  const companyId = 1

  const base = `/api/tasks/company/${companyId}/kanban`
  const query = computed(() => toTaskListQuery(toValue(filters)))

  const counts = useQuery({
    queryKey: computed(() => ['tasks', companyId, 'kanban', 'counts', query.value]),
    queryFn: () => $api<KanbanCounts>(`${base}/counts/`, { query: query.value }),
  })

  const pending = useQuery({
    queryKey: computed(() => ['tasks', companyId, 'kanban', 'pending', query.value]),
    queryFn: () => $api<PaginatedResponse<Task>>(`${base}/pending/`, { query: query.value }),
  })

  const wip = useQuery({
    queryKey: computed(() => ['tasks', companyId, 'kanban', 'wip', query.value]),
    queryFn: () => $api<PaginatedResponse<Task>>(`${base}/wip/`, { query: query.value }),
  })

  const columns = computed<KanbanColumn[]>(() => {
    const totals = counts.data.value

    return [
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
  })

  return { counts, pending, wip, columns }
}
