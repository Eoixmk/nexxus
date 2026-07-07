import type { AuthSession } from '~/shared/types/auth.types'

/**
 * Cliente HTTP autenticado del backend, disponible como `$api`.
 *
 * - `baseURL` desde runtimeConfig (`apiBaseUrl`).
 * - Agrega `Authorization: Token <token>` de la sesión en cada request.
 *
 * @example
 * const { $api } = useNuxtApp()
 * const data = await $api<Project[]>('/api/projects/')
 */
export default defineNuxtPlugin(() => {
  const { public: { apiBaseUrl } } = useRuntimeConfig()
  const session = useCookie<AuthSession | null>('auth_session')

  const api = $fetch.create({
    baseURL: apiBaseUrl as string,
    onRequest({ options }) {
      const token = session.value?.token
      if (token) {
        options.headers = new Headers(options.headers)
        options.headers.set('Authorization', `Token ${token}`)
      }
    },
  })

  return {
    provide: { api },
  }
})
