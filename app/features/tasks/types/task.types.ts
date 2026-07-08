export type TaskPriority = 'urgent' | 'critical' | 'high' | 'normal'

export type TaskType =
  | 'manual'
  | 'trigger'
  | 'repeat'
  | 'volume'
  | 'multiple_close'
  | 'puesto'
  | 'bug'

export type TaskView = 'list' | 'kanban' | 'calendar'

export type TaskGroupBy = 'all' | 'due' | 'topic' | 'group'

export type TaskSectionKey = 'urgent' | 'today' | 'upcoming'

export interface TaskCloseApproval {
  id: number
  profile: number
  closed: boolean
  closed_at: string | null
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
