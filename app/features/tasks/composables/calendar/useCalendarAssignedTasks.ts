import { useQueries, useQuery } from '@tanstack/vue-query'
import type { MaybeRefOrGetter } from 'vue'
import type { PaginatedResponse } from '~/shared/types/api.types'
import { extractResults } from '~/shared/utils/paginated.util'
import { toTaskListQuery } from '~/features/tasks/utils/task-api.util'
import type {
  Task,
  TaskListFilters,
  UserDropdown,
} from '~/features/tasks/types/task.types'

/** Paleta fija: cada usuario (por posición) recibe un color distinto. */
const ASSIGNEE_COLORS = [
  '#6366f1', // indigo
  '#28ceab', // teal
  '#f97316', // orange
  '#8b5cf6', // violet
  '#dc2626', // red
  '#0ea5e9', // sky
  '#eab308', // amber
  '#ec4899', // pink
  '#22c55e', // green
  '#64748b', // slate
  '#14b8a6', // teal-2
  '#a855f7', // purple
] as const

export interface CalendarAssignee {
  id: number
  name: string
  color: string
  tasks: Task[]
  loading: boolean
  error: boolean
}

/**
 * Modo "por grupo" del calendario: lista usuarios y las tareas asignadas
 * a cada uno, con un color distinto por usuario.
 *
 * - Usuarios → GET /api/tools/dropdown/users/
 * - Tareas por asignado → GET /api/tasks/company/:id/assigned/:userId/
 *
 * NOTA: la empresa está fija en 1 por ahora (TODO: derivar de la empresa
 * seleccionada).
 */
export function useCalendarAssignedTasks(
  filters: MaybeRefOrGetter<TaskListFilters> = {},
  enabled: MaybeRefOrGetter<boolean> = true,
) {
  const { $api } = useNuxtApp()
  const companyId = 1

  const usersBase = '/api/tools/dropdown/users'
  const tasksBase = `/api/tasks/company/${companyId}/assigned`
  const query = computed(() => toTaskListQuery(toValue(filters)))
  const isEnabled = computed(() => toValue(enabled))

  const users = useQuery({
    queryKey: ['tasks', 'users', 'dropdown'],
    queryFn: () => $api<PaginatedResponse<UserDropdown>>(`${usersBase}/`),
    enabled: isEnabled,
  })

  const userList = computed(() => extractResults(users.data.value))
  const userIds = computed(() => userList.value.map(u => u.id))

  const taskQueries = useQueries({
    queries: computed(() =>
      userIds.value.map(id => ({
        queryKey: ['tasks', companyId, 'assigned', id, query.value],
        queryFn: () => $api<PaginatedResponse<Task>>(`${tasksBase}/${id}/`, { query: query.value }),
        enabled: isEnabled.value && userIds.value.length > 0,
      })),
    ),
  })

  const assignees = computed<CalendarAssignee[]>(() =>
    userList.value.map((user, index) => {
      const result = taskQueries.value[index]
      return {
        id: user.id,
        name: user.username,
        color: ASSIGNEE_COLORS[index % ASSIGNEE_COLORS.length]!,
        tasks: extractResults(result?.data),
        loading: result?.isPending ?? false,
        error: result?.isError ?? false,
      }
    }),
  )

  const isPending = computed(() =>
    users.isPending.value || assignees.value.some(a => a.loading),
  )

  const isError = computed(() =>
    users.isError.value || assignees.value.some(a => a.error),
  )

  return { assignees, isPending, isError }
}
