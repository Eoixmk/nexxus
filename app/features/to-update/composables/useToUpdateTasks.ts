import { useQuery } from '@tanstack/vue-query'
import type { MaybeRefOrGetter } from 'vue'
import type { PaginatedResponse } from '~/shared/types/api.types'
import type { Task, TaskListFilters } from '~/features/tasks/types/task.types'
import type {
  ToUpdateCounts,
  ToUpdateSection,
  ToUpdateSectionId,
} from '~/features/to-update/types/to-update.types'
import {
  TO_UPDATE_SECTION_META,
  TO_UPDATE_SECTION_ORDER,
} from '~/features/to-update/utils/to-update-sections.util'
import { extractResults, toTaskListQuery } from '~/features/tasks/utils/task-api.util'

/**
 * Server state de Por actualizar (vista Lista) vía TanStack Query.
 *
 * Endpoints: /api/tasks/company/:id/close/{counts|pending|urgent|delayed|critical|accepted}/
 * Reutiliza los mismos query params que las listas (`toTaskListQuery`).
 *
 * NOTA: la empresa está fija en 1 por ahora (TODO: derivar de la empresa
 * seleccionada).
 */
export function useToUpdateTasks(filters: MaybeRefOrGetter<TaskListFilters> = {}) {
  const { $api } = useNuxtApp()
  const companyId = 1

  const base = `/api/tasks/company/${companyId}/close`
  const query = computed(() => toTaskListQuery(toValue(filters)))

  const counts = useQuery({
    queryKey: computed(() => ['tasks', companyId, 'close', 'counts', query.value]),
    queryFn: () => $api<ToUpdateCounts>(`${base}/counts/`, { query: query.value }),
  })

  const pending = useQuery({
    queryKey: computed(() => ['tasks', companyId, 'close', 'pending', query.value]),
    queryFn: () => $api<PaginatedResponse<Task>>(`${base}/pending/`, { query: query.value }),
  })

  const urgent = useQuery({
    queryKey: computed(() => ['tasks', companyId, 'close', 'urgent', query.value]),
    queryFn: () => $api<PaginatedResponse<Task>>(`${base}/urgent/`, { query: query.value }),
  })

  const delayed = useQuery({
    queryKey: computed(() => ['tasks', companyId, 'close', 'delayed', query.value]),
    queryFn: () => $api<PaginatedResponse<Task>>(`${base}/delayed/`, { query: query.value }),
  })

  const critical = useQuery({
    queryKey: computed(() => ['tasks', companyId, 'close', 'critical', query.value]),
    queryFn: () => $api<PaginatedResponse<Task>>(`${base}/critical/`, { query: query.value }),
  })

  const accepted = useQuery({
    queryKey: computed(() => ['tasks', companyId, 'close', 'accepted', query.value]),
    queryFn: () => $api<PaginatedResponse<Task>>(`${base}/accepted/`, { query: query.value }),
  })

  const sectionQueries: Record<
    ToUpdateSectionId,
    ReturnType<typeof useQuery<PaginatedResponse<Task>>>
  > = {
    pending,
    urgent,
    delayed,
    critical,
    accepted,
  }

  const sections = computed<ToUpdateSection[]>(() => {
    const totals = counts.data.value

    return TO_UPDATE_SECTION_ORDER.map((id) => {
      const sectionQuery = sectionQueries[id]
      const meta = TO_UPDATE_SECTION_META[id]

      return {
        id,
        labelKey: meta.labelKey,
        color: meta.color,
        count: totals?.[id],
        tasks: extractResults(sectionQuery.data.value),
        loading: sectionQuery.isPending.value,
        error: sectionQuery.isError.value,
      }
    })
  })

  return { counts, pending, urgent, delayed, critical, accepted, sections }
}
