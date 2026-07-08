import { useQuery } from '@tanstack/vue-query'
import type { PaginatedResponse } from '~/shared/types/api.types'
import type { OverdueCounts, Task } from '~/features/tasks/types/task.types'

/**
 * Server state de tareas agrupadas por vencimiento vía TanStack Query.
 *
 * NOTA: la empresa está fija en 1 por ahora (TODO: derivar de la empresa
 * seleccionada).
 */
export function useOverdueTasks() {
  const { $api } = useNuxtApp()
  const companyId = 1

  const base = `/api/tasks/company/${companyId}/overdue`

  const counts = useQuery({
    queryKey: ['tasks', companyId, 'overdue', 'counts'],
    queryFn: () => $api<OverdueCounts>(`${base}/counts/`),
  })

  const today = useQuery({
    queryKey: ['tasks', companyId, 'overdue', 'today'],
    queryFn: () => $api<PaginatedResponse<Task>>(`${base}/today/`),
  })

  const tomorrow = useQuery({
    queryKey: ['tasks', companyId, 'overdue', 'tomorrow'],
    queryFn: () => $api<PaginatedResponse<Task>>(`${base}/tomorrow/`),
  })

  const week = useQuery({
    queryKey: ['tasks', companyId, 'overdue', 'week'],
    queryFn: () => $api<PaginatedResponse<Task>>(`${base}/week/`),
  })

  const month = useQuery({
    queryKey: ['tasks', companyId, 'overdue', 'month'],
    queryFn: () => $api<PaginatedResponse<Task>>(`${base}/month/`),
  })

  const noDate = useQuery({
    queryKey: ['tasks', companyId, 'overdue', 'no_date'],
    queryFn: () => $api<PaginatedResponse<Task>>(`${base}/no_date/`),
  })

  return { counts, today, tomorrow, week, month, noDate }
}
