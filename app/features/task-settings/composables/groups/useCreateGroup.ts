import { useMutation, useQueryClient } from '@tanstack/vue-query'
import type { CreateCatalogueGroupPayload } from '~/features/task-settings/types/group.types'

/**
 * Crea un grupo vía POST /api/catalogues/groups/create/.
 */
export function useCreateGroup() {
  const { $api } = useNuxtApp()
  const queryClient = useQueryClient()
  const toast = useToast()
  const { t } = useI18n()

  return useMutation({
    mutationFn: (payload: CreateCatalogueGroupPayload) =>
      $api('/api/catalogues/groups/create/', {
        method: 'POST',
        body: payload,
      }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['catalogues', 'groups'] })
      toast.add({
        title: t('taskSettings.groupModal.createdTitle'),
        description: t('taskSettings.groupModal.createdDescription'),
        color: 'success',
      })
    },
    onError: (error) => {
      toast.add({
        title: t('taskSettings.groupModal.createErrorTitle'),
        description: parseFetchError(error),
        color: 'error',
      })
    },
  })
}
