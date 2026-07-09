import type { PaginatedResponse } from '~/shared/types/api.types'

export function extractResults<T>(data: PaginatedResponse<T> | T[] | undefined | null): T[] {
  if (!data) {
    return []
  }
  if (Array.isArray(data)) {
    return data
  }
  return data.results ?? []
}
