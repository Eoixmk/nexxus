import type { EventInput } from '@fullcalendar/core'
import type { Task } from '~/features/tasks/types/task.types'
import { taskBarColor } from '~/features/tasks/utils/task-format.util'

/** Extrae YYYY-MM-DD de un ISO o fecha parcial. */
function toDateOnly(value: string | null | undefined): string | null {
  if (!value) {
    return null
  }
  const match = value.match(/^(\d{4}-\d{2}-\d{2})/)
  return match?.[1] ?? null
}

/** Día siguiente en formato YYYY-MM-DD (end exclusivo de FullCalendar all-day). */
function nextDay(dateOnly: string): string {
  const date = new Date(`${dateOnly}T00:00:00`)
  date.setDate(date.getDate() + 1)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function hexToRgba(hex: string, alpha: number): string {
  const normalized = hex.replace('#', '')
  if (normalized.length !== 6) {
    return `rgba(40, 206, 171, ${alpha})`
  }

  const r = Number.parseInt(normalized.slice(0, 2), 16)
  const g = Number.parseInt(normalized.slice(2, 4), 16)
  const b = Number.parseInt(normalized.slice(4, 6), 16)
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

function darkenHex(hex: string, amount = 0.45): string {
  const normalized = hex.replace('#', '')
  if (normalized.length !== 6) {
    return '#0d7a66'
  }

  const channels = [0, 2, 4].map((offset) => {
    const value = Number.parseInt(normalized.slice(offset, offset + 2), 16)
    return Math.max(0, Math.round(value * (1 - amount)))
  })

  return `#${channels.map(channel => channel.toString(16).padStart(2, '0')).join('')}`
}

/**
 * Ubica la tarea en el calendario: rango start→limit si hay ambos,
 * si no limit/start, y como fallback created_at (coincide con el filtro del API).
 */
export function taskToCalendarEvent(task: Task): EventInput {
  const startDate = toDateOnly(task.start_date)
  const limitDate = toDateOnly(task.limit_date)
  const createdDate = toDateOnly(task.created_at)
  const color = taskBarColor(task)

  const start = startDate ?? limitDate ?? createdDate ?? new Date().toISOString().slice(0, 10)
  const endExclusive = limitDate && limitDate !== start
    ? nextDay(limitDate)
    : undefined

  return {
    id: String(task.id),
    title: task.short_description,
    start,
    end: endExclusive,
    allDay: true,
    backgroundColor: hexToRgba(color, 0.22),
    borderColor: color,
    textColor: darkenHex(color),
  }
}

export function tasksToCalendarEvents(tasks: Task[]): EventInput[] {
  return tasks.map(taskToCalendarEvent)
}
