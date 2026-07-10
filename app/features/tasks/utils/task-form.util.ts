import type {
  ApiTaskPriority,
  CreateTaskPayload,
  NewTaskFormType,
  TaskEffort,
} from '~/features/tasks/types/task.types'

export interface NewTaskFormInput {
  type: NewTaskFormType
  name: string
  description: string
  project: number | undefined
  assignedTo: number | undefined
  dueDate: string
  urgent: boolean
  effort: TaskEffort | undefined
}

/** Mapea esfuerzo/urgente al priority del API. */
export function resolveTaskPriority(urgent: boolean, effort?: TaskEffort): ApiTaskPriority {
  if (urgent) {
    return 'urgent'
  }
  if (effort === 'quick') {
    return 'low'
  }
  if (effort === 'complex') {
    return 'high'
  }
  return 'normal'
}

function dateInputToLimitISO(date: string): string {
  const localEnd = new Date(`${date}T23:59:59`)
  return localEnd.toISOString()
}

export function buildCreateTaskPayload(form: NewTaskFormInput): CreateTaskPayload {
  if (!form.name.trim()) {
    throw new Error('name_required')
  }
  if (form.project == null) {
    throw new Error('project_required')
  }
  if (form.assignedTo == null) {
    throw new Error('assigned_to_required')
  }
  if (!form.dueDate) {
    throw new Error('due_date_required')
  }

  return {
    short_description: form.name.trim(),
    long_description: form.description.trim(),
    type: form.type,
    priority: resolveTaskPriority(form.urgent, form.effort),
    start_date: new Date().toISOString(),
    limit_date: dateInputToLimitISO(form.dueDate),
    project: form.project,
    assigned_to: [form.assignedTo],
  }
}
