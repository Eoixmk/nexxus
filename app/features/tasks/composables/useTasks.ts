import type { MaybeRefOrGetter } from 'vue'
import type { TaskCounts, TaskListFilters } from '~/features/tasks/types/task.types'
import { createCompanyTasksApi } from '~/features/tasks/composables/createCompanyTasksApi'

/**
 * Server state del módulo de tareas (vista Lista) vía TanStack Query.
 */
export function useTasks(filters: MaybeRefOrGetter<TaskListFilters> = {}) {
  const api = createCompanyTasksApi(filters)

  const counts = api.countsQuery<TaskCounts>([], '/counts/')
  const urgent = api.listQuery(['urgent'], '/urgent/')
  const today = api.listQuery(['today'], '/due_today/')
  const upcoming = api.listQuery(['upcoming'], '/upcoming/')

  return { counts, urgent, today, upcoming }
}
