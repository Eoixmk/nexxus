import { useQuery } from '@tanstack/vue-query'
import type { MaybeRefOrGetter } from 'vue'
import type { PaginatedResponse } from '~/shared/types/api.types'
import type { GroupDropdown } from '~/features/tasks/types/task.types'
import { extractResults } from '~/shared/utils/paginated.util'

/**
 * Dropdown de grupos vía GET /api/tools/dropdown/groups/.
 */
export function useGroupsDropdown(enabled: MaybeRefOrGetter<boolean> = true) {
  const { $api } = useNuxtApp()

  const groups = useQuery({
    queryKey: ['tasks', 'groups', 'dropdown'],
    queryFn: () =>
      $api<PaginatedResponse<GroupDropdown>>('/api/tools/dropdown/groups/'),
    enabled: computed(() => toValue(enabled)),
  })

  const items = computed(() =>
    extractResults(groups.data.value).map(group => ({
      label: group.name,
      value: group.id,
    })),
  )

  return { groups, items }
}
