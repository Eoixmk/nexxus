import { useQuery } from '@tanstack/vue-query'
import type { MaybeRefOrGetter } from 'vue'
import type { CatalogueGroupDetail } from '~/features/task-settings/types/group.types'

/**
 * Detalle de grupo vía GET /api/catalogues/groups/:id/.
 */
export function useGroupDetail(groupId: MaybeRefOrGetter<number | null>) {
  const { $api } = useNuxtApp()

  const detailQuery = useQuery({
    queryKey: computed(() => ['catalogues', 'groups', 'detail', toValue(groupId)]),
    queryFn: () =>
      $api<CatalogueGroupDetail>(`/api/catalogues/groups/${toValue(groupId)}/`),
    enabled: computed(() => toValue(groupId) != null),
  })

  const detail = computed(() => detailQuery.data.value ?? null)

  const errorMessage = computed(() =>
    detailQuery.error.value ? parseFetchError(detailQuery.error.value) : '',
  )

  return { detailQuery, detail, errorMessage }
}
