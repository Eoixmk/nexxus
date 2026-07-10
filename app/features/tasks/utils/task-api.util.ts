import type { PaginatedResponse } from '~/shared/types/api.types'
import type { TaskListFilters } from '~/features/tasks/types/task.types'

export function extractResults<T>(data: PaginatedResponse<T> | T[] | undefined | null): T[] {
  if (!data) {
    return []
  }
  if (Array.isArray(data)) {
    return data
  }
  return data.results ?? []
}

/** Convierte filtros de UI en query params omitiendo valores vacíos. */
export function toTaskListQuery(
  filters: TaskListFilters = {},
): Record<string, string | number | boolean> {
  const query: Record<string, string | number | boolean> = {}
  const shortDescription = filters.short_description?.trim()

  if (shortDescription) {
    query.short_description = shortDescription
  }
  if (filters.type) {
    query.type = filters.type
  }
  if (filters.project != null) {
    query.project = filters.project
  }
  if (filters.overdue) {
    query.overdue = true
  }
  if (filters.completed) {
    query.completed = true
  }
  if (filters.multiple_close) {
    query.multiple_close = true
  }

  return query
}
