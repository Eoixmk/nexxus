import { useQuery } from '@tanstack/vue-query'
import type { MaybeRefOrGetter } from 'vue'
import type { PaginatedResponse } from '~/shared/types/api.types'
import type { TaskMessage } from '~/features/tasks/types/task.types'
import { extractResults } from '~/shared/utils/paginated.util'

/**
 * Mensajes del chat de una tarea.
 * GET /api/tasks/:id/messages/
 */
export function useTaskMessages(taskId: MaybeRefOrGetter<number | null>) {
  const { $api } = useNuxtApp()

  const resolvedId = computed(() => toValue(taskId))

  const query = useQuery({
    queryKey: computed(() => ['tasks', 'messages', resolvedId.value]),
    queryFn: () =>
      $api<PaginatedResponse<TaskMessage>>(`/api/tasks/${resolvedId.value}/messages/`),
    enabled: computed(() => resolvedId.value != null),
  })

  const messages = computed(() => extractResults(query.data.value))

  const errorMessage = computed(() =>
    query.error.value ? parseFetchError(query.error.value) : '',
  )

  return { ...query, messages, errorMessage }
}
