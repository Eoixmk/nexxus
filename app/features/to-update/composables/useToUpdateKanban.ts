import type { MaybeRefOrGetter } from 'vue'
import type { KanbanColumn, TaskListFilters } from '~/features/tasks/types/task.types'
import { createEmptyToUpdateSections } from '~/features/to-update/utils/to-update-sections.util'

/**
 * Server state de Por actualizar (vista Kanban).
 *
 * Las columnas reflejan las mismas secciones que la lista.
 * TODO: cablear endpoints por columna cuando estén disponibles.
 */
export function useToUpdateKanban(_filters: MaybeRefOrGetter<TaskListFilters> = {}) {
  const columns = computed<KanbanColumn[]>(() =>
    createEmptyToUpdateSections().map(section => ({
      id: section.id,
      labelKey: section.labelKey,
      color: section.color,
      count: section.count,
      tasks: section.tasks,
      loading: section.loading,
      error: section.error,
    })),
  )

  return { columns }
}
