import { useQuery } from '@tanstack/vue-query'
import type { MaybeRefOrGetter } from 'vue'
import type { PaginatedResponse } from '~/shared/types/api.types'
import type { OverdueCounts, Task, TaskListFilters } from '~/features/tasks/types/task.types'
import { toTaskListQuery } from '~/features/tasks/utils/task-api.util'

/**
 * Server state de tareas agrupadas por vencimiento vía TanStack Query.
 *
 * NOTA: la empresa está fija en 1 por ahora (TODO: derivar de la empresa
 * seleccionada).
 */
export function useOverdueTasks(filters: MaybeRefOrGetter<TaskListFilters> = {}) {
  const { $api } = useNuxtApp()
  const companyId = 1

  const base = `/api/tasks/company/${companyId}/overdue`
  const query = computed(() => toTaskListQuery(toValue(filters)))

  const counts = useQuery({
    queryKey: computed(() => ['tasks', companyId, 'overdue', 'counts', query.value]),
    queryFn: () => $api<OverdueCounts>(`${base}/counts/`, { query: query.value }),
  })

  const today = useQuery({
    queryKey: computed(() => ['tasks', companyId, 'overdue', 'today', query.value]),
    queryFn: () => $api<PaginatedResponse<Task>>(`${base}/today/`, { query: query.value }),
  })

  const tomorrow = useQuery({
    queryKey: computed(() => ['tasks', companyId, 'overdue', 'tomorrow', query.value]),
    queryFn: () => $api<PaginatedResponse<Task>>(`${base}/tomorrow/`, { query: query.value }),
  })

  const week = useQuery({
    queryKey: computed(() => ['tasks', companyId, 'overdue', 'week', query.value]),
    queryFn: () => $api<PaginatedResponse<Task>>(`${base}/week/`, { query: query.value }),
  })

  const month = useQuery({
    queryKey: computed(() => ['tasks', companyId, 'overdue', 'month', query.value]),
    queryFn: () => $api<PaginatedResponse<Task>>(`${base}/month/`, { query: query.value }),
  })

  const noDate = useQuery({
    queryKey: computed(() => ['tasks', companyId, 'overdue', 'no_date', query.value]),
    queryFn: () => $api<PaginatedResponse<Task>>(`${base}/no_date/`, { query: query.value }),
  })

  return { counts, today, tomorrow, week, month, noDate }
}
