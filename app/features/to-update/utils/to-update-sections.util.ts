import type { ToUpdateSection, ToUpdateSectionId } from '~/features/to-update/types/to-update.types'

/** Definición estática de secciones (colores y labels). Los datos vendrán de la API. */
export const TO_UPDATE_SECTION_META: Record<
  ToUpdateSectionId,
  { labelKey: string, color: string }
> = {
  pending: {
    labelKey: 'tasks.toUpdate.sections.pending',
    color: '#6b7280',
  },
  urgent: {
    labelKey: 'tasks.toUpdate.sections.urgent',
    color: '#dc2626',
  },
  delay: {
    labelKey: 'tasks.toUpdate.sections.delay',
    color: '#f97316',
  },
  critical: {
    labelKey: 'tasks.toUpdate.sections.critical',
    color: '#991b1b',
  },
  accepted: {
    labelKey: 'tasks.toUpdate.sections.accepted',
    color: '#28ceab',
  },
}

export const TO_UPDATE_SECTION_ORDER: ToUpdateSectionId[] = [
  'pending',
  'urgent',
  'delay',
  'critical',
  'accepted',
]

/** Secciones vacías hasta cablear endpoints. */
export function createEmptyToUpdateSections(): ToUpdateSection[] {
  return TO_UPDATE_SECTION_ORDER.map(id => ({
    id,
    labelKey: TO_UPDATE_SECTION_META[id].labelKey,
    color: TO_UPDATE_SECTION_META[id].color,
    count: 0,
    tasks: [],
    loading: false,
    error: false,
  }))
}
