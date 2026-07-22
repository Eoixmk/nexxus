import type { MaybeRefOrGetter } from 'vue'
import type { KanbanColumn, TaskListFilters } from '~/features/tasks/types/task.types'
import { sectionsToKanbanColumns } from '~/features/tasks/utils/kanban/kanban.util'

/**
 * Server state de Pending approval (vista Kanban).
 * Reutiliza los mismos endpoints close/* que la lista.
 */
export function useToUpdateKanban(filters: MaybeRefOrGetter<TaskListFilters> = {}) {
  const { sections } = useToUpdateTasks(filters)

  const columns = computed<KanbanColumn[]>(() => sectionsToKanbanColumns(sections.value))

  return { columns }
}
