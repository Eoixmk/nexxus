import { useQuery } from '@tanstack/vue-query'
import type { MaybeRefOrGetter } from 'vue'
import type { PaginatedResponse } from '~/shared/types/api.types'
import type { Task, TaskCounts, TaskListFilters } from '~/features/tasks/types/task.types'
import { toTaskListQuery } from '~/features/tasks/utils/task-api.util'

/**
 * Server state del módulo de tareas (vista Lista) vía TanStack Query.
 *
 * NOTA: la empresa está fija en 1 por ahora (TODO: derivar de la empresa
 * seleccionada).
 */
export function useTasks(filters: MaybeRefOrGetter<TaskListFilters> = {}) {
  const { $api } = useNuxtApp()
  const companyId = 1

  const base = `/api/tasks/company/${companyId}`
  const query = computed(() => toTaskListQuery(toValue(filters)))

  const counts = useQuery({
    queryKey: computed(() => ['tasks', companyId, 'counts', query.value]),
    queryFn: () => $api<TaskCounts>(`${base}/counts/`, { query: query.value }),
  })

  const urgent = useQuery({
    queryKey: computed(() => ['tasks', companyId, 'urgent', query.value]),
    queryFn: () => $api<PaginatedResponse<Task>>(`${base}/urgent/`, { query: query.value }),
  })

  const today = useQuery({
    queryKey: computed(() => ['tasks', companyId, 'today', query.value]),
    queryFn: () => $api<PaginatedResponse<Task>>(`${base}/due_today/`, { query: query.value }),
  })

  const upcoming = useQuery({
    queryKey: computed(() => ['tasks', companyId, 'upcoming', query.value]),
    queryFn: () => $api<PaginatedResponse<Task>>(`${base}/upcoming/`, { query: query.value }),
  })

  return { counts, urgent, today, upcoming }
}
