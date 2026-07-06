import type { FetchError } from 'ofetch'

export function useApiBaseUrl() {
  const { public: { apiBaseUrl } } = useRuntimeConfig()
  return apiBaseUrl as string
}

export function getFetchErrorMessage(error: unknown, fallback: string): string {
  if (!error || typeof error !== 'object') {
    return fallback
  }

  const fetchError = error as FetchError
  const data = fetchError.data

  if (typeof data === 'string' && data.length > 0) {
    return data
  }

  if (data && typeof data === 'object') {
    const record = data as Record<string, unknown>

    if (typeof record.detail === 'string') {
      return record.detail
    }

    if (Array.isArray(record.non_field_errors) && record.non_field_errors.length > 0) {
      return String(record.non_field_errors[0])
    }

    const firstFieldError = Object.values(record).find(
      value => Array.isArray(value) && value.length > 0,
    ) as string[] | undefined

    if (firstFieldError?.[0]) {
      return String(firstFieldError[0])
    }
  }

  if (error instanceof Error && error.message) {
    return error.message
  }

  return fallback
}
