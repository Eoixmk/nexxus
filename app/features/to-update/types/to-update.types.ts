import type { Task } from '~/features/tasks/types/task.types'

/** Secciones compartidas entre lista y kanban de Por actualizar. */
export type ToUpdateSectionId =
  | 'pending'
  | 'urgent'
  | 'delay'
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

/** Contadores esperados cuando lleguen los endpoints. */
export interface ToUpdateCounts {
  pending: number
  urgent: number
  delay: number
  critical: number
  accepted: number
}
