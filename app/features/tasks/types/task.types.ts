export type TaskPriority = 'urgent' | 'critical' | 'high' | 'normal'

export type TaskType =
  | 'manual'
  | 'trigger'
  | 'repeat'
  | 'volume'
  | 'multiple_close'
  | 'puesto'
  | 'bug'

/** Tipos disponibles al crear una tarea desde el slideover. */
export type NewTaskFormType = Extract<TaskType, 'manual' | 'volume' | 'multiple_close'>

/** Esfuerzo seleccionado en el formulario de creación. */
export type TaskEffort = 'quick' | 'normal' | 'complex'

/** Prioridades aceptadas por el endpoint de creación. */
export type ApiTaskPriority = 'low' | 'normal' | 'high' | 'urgent' | 'critical'

export interface CreateTaskPayload {
  short_description: string
  long_description: string
  type: NewTaskFormType
  priority: ApiTaskPriority
  start_date: string
  limit_date: string
  project: number
  assigned_to: number[]
  task_reviewer?: number[]
}

export type TaskView = 'list' | 'kanban' | 'calendar'

export type TaskGroupBy = 'all' | 'due' | 'topic' | 'group'

export type TaskSectionKey = 'urgent' | 'today' | 'upcoming'

/** Filtros de query compartidos por todas las listas de tareas. */
export interface TaskListFilters {
  short_description?: string
  type?: TaskType
  project?: number
  overdue?: boolean
  completed?: boolean
  multiple_close?: boolean
}

export interface TaskCloseApproval {
  id: number
  profile: number
  closed: boolean
  closed_at: string | null
}

export interface TaskProcessEntry {
  id: number
  status: string
  started_at: string | null
  started_by: number | null
  images: unknown[]
  comment: string
  created_at: string
}

export interface Task {
  id: number
  short_description: string
  type: string
  status: string
  priority: string
  project: number
  project_color?: string
  multiple_close: boolean
  start_date: string | null
  limit_date: string | null
  created_at: string
  close_approvals: TaskCloseApproval[]
}

/** Detalle completo de GET /api/tasks/:id/ */
export interface TaskDetail extends Task {
  long_description: string
  effort: TaskEffort | string | null
  assigned_to: number[]
  recurrence: boolean
  finish_at: string | null
  updated_at: string
  process_tasks: TaskProcessEntry[]
}

export interface TaskCounts {
  urgent: number
  due_today: number
  tasks: number
}

export interface OverdueCounts {
  today: number
  tomorrow: number
  week: number
  month: number
  no_date: number
}

export interface ProjectDropdown {
  id: number
  name: string
}

export interface ProjectTaskCount {
  id: number
  name: string
  total: number
}

export interface ProjectTaskSection {
  id: number
  name: string
  count?: number
  dotColor: string
  tasks: Task[]
  loading: boolean
  error: boolean
}

export interface UserDropdown {
  id: number
  username: string
}

export interface AssignedTaskCount {
  id: number
  username: string
  total: number
}
