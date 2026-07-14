import { useQuery } from '@tanstack/vue-query'
import type { MaybeRefOrGetter } from 'vue'
import type { PaginatedResponse } from '~/shared/types/api.types'
import type { AuthProfile } from '~/features/auth/types/profile.types'

/** Catálogo de perfiles para selectores (miembros de tema, etc.). */
export function useProfiles(enabled: MaybeRefOrGetter<boolean> = true) {
  const { $api } = useNuxtApp()

  const profilesQuery = useQuery({
    queryKey: ['auth', 'profiles'],
    queryFn: () => $api<PaginatedResponse<AuthProfile>>('/api/auth/profiles/'),
    enabled: computed(() => toValue(enabled)),
  })

  const profiles = computed(() => profilesQuery.data.value?.results ?? [])

  const items = computed(() =>
    profiles.value.map(profile => ({
      label: profile.username,
      value: profile.id,
    })),
  )

  return { profilesQuery, profiles, items }
}
