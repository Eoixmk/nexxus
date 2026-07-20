import type { MaybeRefOrGetter } from 'vue'
import type { KanbanColumn, TaskListFilters } from '~/features/tasks/types/task.types'

/**
 * Server state de Por actualizar (vista Kanban).
 *
 * Reutiliza los mismos endpoints close/* que la lista.
 */
export function useToUpdateKanban(filters: MaybeRefOrGetter<TaskListFilters> = {}) {
  const { sections } = useToUpdateTasks(filters)

  const columns = computed<KanbanColumn[]>(() =>
    sections.value.map(section => ({
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
