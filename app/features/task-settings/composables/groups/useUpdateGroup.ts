import { useMutation, useQueryClient } from '@tanstack/vue-query'
import type { UpdateCatalogueGroupPayload } from '~/features/task-settings/types/group.types'

/**
 * Actualiza un grupo vía PATCH /api/catalogues/groups/:id/update/.
 */
export function useUpdateGroup() {
  const { $api } = useNuxtApp()
  const queryClient = useQueryClient()
  const toast = useToast()
  const { t } = useI18n()

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: number
      payload: UpdateCatalogueGroupPayload
    }) =>
      $api(`/api/catalogues/groups/${id}/update/`, {
        method: 'PATCH',
        body: payload,
      }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['catalogues', 'groups'] })
      toast.add({
        title: t('taskSettings.groupModal.updatedTitle'),
        description: t('taskSettings.groupModal.updatedDescription'),
        color: 'success',
      })
    },
    onError: (error) => {
      toast.add({
        title: t('taskSettings.groupModal.updateErrorTitle'),
        description: parseFetchError(error),
        color: 'error',
      })
    },
  })
}
