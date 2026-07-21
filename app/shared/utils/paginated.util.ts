import type { PaginatedResponse } from '~/shared/types/api.types'

/** Extrae `results` de respuestas paginadas o acepta arrays crudos. */
export function extractResults<T>(data: PaginatedResponse<T> | T[] | undefined | null): T[] {
  if (!data) {
    return []
  }
  if (Array.isArray(data)) {
    return data
  }
  return data.results ?? []
}
