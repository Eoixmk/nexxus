import { useQuery } from '@tanstack/vue-query'
import type { PaginatedResponse } from '~/shared/types/api.types'
import type { Task, TaskCounts } from '~/features/tasks/types/task.types'

/**
 * Server state del módulo de tareas (vista Lista) vía TanStack Query.
 *
 * NOTA: la empresa está fija en 1 por ahora (TODO: derivar de la empresa
 * seleccionada).
 */
export function useTasks() {
  const { $api } = useNuxtApp()
  const companyId = 1

  const base = `/api/tasks/company/${companyId}`

  const counts = useQuery({
    queryKey: ['tasks', companyId, 'counts'],
    queryFn: () => $api<TaskCounts>(`${base}/counts/`),
  })

  const urgent = useQuery({
    queryKey: ['tasks', companyId, 'urgent'],
    queryFn: () => $api<PaginatedResponse<Task>>(`${base}/urgent/`),
  })

  const today = useQuery({
    queryKey: ['tasks', companyId, 'today'],
    queryFn: () => $api<PaginatedResponse<Task>>(`${base}/due_today/`),
  })

  const upcoming = useQuery({
    queryKey: ['tasks', companyId, 'upcoming'],
    queryFn: () => $api<PaginatedResponse<Task>>(`${base}/upcoming/`),
  })

  return { counts, urgent, today, upcoming }
}
