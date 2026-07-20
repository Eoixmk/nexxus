import type { Task } from '~/features/tasks/types/task.types'

/** Secciones compartidas entre lista y kanban de Por actualizar. */
export type ToUpdateSectionId =
  | 'pending'
  | 'urgent'
  | 'delayed'
  | 'critical'
  | 'accepted'

export interface ToUpdateSection {
  id: ToUpdateSectionId
  labelKey: string
  color: string
  count?: number
  tasks: Task[]
  loading: boolean
  error: boolean
}

/** Contadores de GET /api/tasks/company/:id/close/counts/ */
export interface ToUpdateCounts {
  pending: number
  urgent: number
  delayed: number
  critical: number
  accepted: number
}
