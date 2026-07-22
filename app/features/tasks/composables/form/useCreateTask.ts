import { useMutation, useQueryClient } from '@tanstack/vue-query'
import type { CreateTaskPayload } from '~/features/tasks/types/task.types'

/**
 * Crea una tarea vía POST /api/tasks/create/ e invalida las queries del módulo.
 */
export function useCreateTask() {
  const { $api } = useNuxtApp()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: CreateTaskPayload) =>
      $api('/api/tasks/create/', {
        method: 'POST',
        body: payload,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
    },
  })
}
