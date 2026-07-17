import { useQuery } from '@tanstack/vue-query'
import type { MaybeRefOrGetter } from 'vue'
import type { PaginatedResponse } from '~/shared/types/api.types'
import type { Task, TaskListFilters } from '~/features/tasks/types/task.types'
import { toTaskListQuery } from '~/features/tasks/utils/task-api.util'

export interface CalendarMonth {
  year: number
  month: number
}

/**
 * Tareas del mes para la vista calendario.
 *
 * Reutiliza los mismos query params que listas/Kanban (`toTaskListQuery`):
 * short_description, type, project, overdue, completed, multiple_close.
 *
 * NOTA: la empresa está fija en 1 por ahora (TODO: derivar de la empresa
 * seleccionada).
 */
export function useCalendarTasks(
  period: MaybeRefOrGetter<CalendarMonth>,
  filters: MaybeRefOrGetter<TaskListFilters> = {},
) {
  const { $api } = useNuxtApp()
  const companyId = 1

  const year = computed(() => toValue(period).year)
  const month = computed(() => toValue(period).month)
  const query = computed(() => ({
    year: year.value,
    month: month.value,
    ...toTaskListQuery(toValue(filters)),
  }))

  const tasks = useQuery({
    queryKey: computed(() => ['tasks', companyId, 'calendar', query.value]),
    queryFn: () =>
      $api<PaginatedResponse<Task>>(`/api/tasks/company/${companyId}/calendar/`, {
        query: query.value,
      }),
  })

  return { tasks }
}
