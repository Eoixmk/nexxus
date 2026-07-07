export function useApiBaseUrl() {
  const { public: { apiBaseUrl } } = useRuntimeConfig()
  return apiBaseUrl as string
}
