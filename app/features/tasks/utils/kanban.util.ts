import type { KanbanColumn, ProjectTaskSection } from '~/features/tasks/types/task.types'

/** Adapta secciones de lista (proyecto/grupo) al formato de columnas Kanban. */
export function sectionsToKanbanColumns(sections: ProjectTaskSection[]): KanbanColumn[] {
  return sections.map(section => ({
    id: section.id,
    title: section.name,
    color: section.dotColor,
    count: section.count,
    tasks: section.tasks,
    loading: section.loading,
    error: section.error,
  }))
}
