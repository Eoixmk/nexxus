import { useQuery } from '@tanstack/vue-query'
import type { PaginatedResponse } from '~/shared/types/api.types'
import type { CatalogueGroup } from '~/features/task-settings/types/group.types'

/**
 * Listado de grupos de catálogo vía GET /api/catalogues/groups/.
 */
export function useCatalogueGroups() {
  const { $api } = useNuxtApp()

  const groupsQuery = useQuery({
    queryKey: ['catalogues', 'groups'],
    queryFn: () =>
      $api<PaginatedResponse<CatalogueGroup>>('/api/catalogues/groups/'),
  })

  const groups = computed(() => groupsQuery.data.value?.results ?? [])

  const errorMessage = computed(() =>
    groupsQuery.error.value ? parseFetchError(groupsQuery.error.value) : '',
  )

  return { groupsQuery, groups, errorMessage }
}
