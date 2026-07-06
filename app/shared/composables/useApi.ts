type ApiFetchOptions = NonNullable<Parameters<typeof $fetch>[1]>

/**
 * Cliente HTTP base para el backend.
 * Usa rutas relativas; la URL base viene de runtimeConfig (API_URL + API_PORT).
 *
 * Para endpoints que requieren sesión, usa `authFetch` de `useAuth()`.
 */
export function useApi() {
  const baseURL = useApiBaseUrl()

  function apiFetch<T>(path: string, options: ApiFetchOptions = {}) {
    return $fetch<T>(path, {
      ...options,
      baseURL,
    })
  }

  return { baseURL, apiFetch }
}
