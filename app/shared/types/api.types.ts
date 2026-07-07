/**
 * Respuesta paginada estándar del backend (DRF).
 * Reutilizable por cualquier feature que consuma listados paginados.
 */
export interface PaginatedResponse<T> {
  next: string | null
  previous: string | null
  results: T[]
  count?: number
}
