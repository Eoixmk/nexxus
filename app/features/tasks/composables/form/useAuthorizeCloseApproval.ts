import { useMutation, useQueryClient } from '@tanstack/vue-query'
import type { AuthorizeCloseApprovalResponse } from '~/features/tasks/types/task.types'

/**
 * Autoriza un close_approval vía PATCH /api/tasks/close_approvals/:id/update/.
 */
export function useAuthorizeCloseApproval() {
  const { $api } = useNuxtApp()
  const queryClient = useQueryClient()
  const toast = useToast()
  const { t } = useI18n()

  return useMutation({
    mutationFn: (approvalId: number) =>
      $api<AuthorizeCloseApprovalResponse>(`/api/tasks/close_approvals/${approvalId}/update/`, {
        method: 'PATCH',
        body: { closed: true },
      }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['tasks'] })
      toast.add({
        title: t('tasks.toUpdate.authorize.successTitle'),
        description: t('tasks.toUpdate.authorize.successDescription'),
        color: 'success',
      })
    },
    onError: (error) => {
      toast.add({
        title: t('tasks.toUpdate.authorize.errorTitle'),
        description: parseFetchError(error),
        color: 'error',
      })
    },
  })
}
