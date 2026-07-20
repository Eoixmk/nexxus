import type { MaybeRefOrGetter } from 'vue'
import type { TaskListFilters } from '~/features/tasks/types/task.types'
import { createEmptyToUpdateSections } from '~/features/to-update/utils/to-update-sections.util'

/**
 * Server state de Por actualizar (vista Lista).
 *
 * TODO: cablear endpoints por sección cuando estén disponibles.
 * Los filtros ya se reciben para reutilizarlos en las queryKeys futuras.
 */
export function useToUpdateTasks(_filters: MaybeRefOrGetter<TaskListFilters> = {}) {
  const sections = computed(() => createEmptyToUpdateSections())

  return { sections }
}
