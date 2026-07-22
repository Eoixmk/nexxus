import type { EventInput } from '@fullcalendar/core'
import type { Task, TaskCalendarPhase } from '~/features/tasks/types/task.types'
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

/** `color` fuerza el color (modo por tema); si no, usa el de la tarea. */
function eventColors(task: Task, color?: string) {
  const resolved = color ?? taskBarColor(task)
  return {
    backgroundColor: hexToRgba(resolved, 0.22),
    borderColor: resolved,
    textColor: darkenHex(resolved),
  }
}

/**
 * Vista Inicio: la tarea aparece solo el día de `start_date`
 * (sin importar cuántos días dure hasta limit_date).
 */
export function taskToStartCalendarEvent(task: Task, color?: string): EventInput | null {
  const start = toDateOnly(task.start_date)
  if (!start) {
    return null
  }

  return {
    id: String(task.id),
    title: task.short_description,
    start,
    allDay: true,
    ...eventColors(task, color),
  }
}

/**
 * Vista Proceso: barra desde `start_date` hasta `limit_date` (duración).
 * Si falta limit_date, se muestra solo el día de inicio.
 *
 * Importante: no limitar filas visibles en esta fase; si FullCalendar
 * oculta el inicio de una barra multi-día, parece que empezó otro día.
 */
export function taskToProcessCalendarEvent(task: Task, color?: string): EventInput | null {
  const start = toDateOnly(task.start_date)
  if (!start) {
    return null
  }

  const limit = toDateOnly(task.limit_date)
  const endExclusive = limit && limit >= start
    ? nextDay(limit)
    : undefined

  return {
    id: String(task.id),
    title: task.short_description,
    start,
    end: endExclusive,
    allDay: true,
    ...eventColors(task, color),
  }
}

/**
 * Vista Cierre: la tarea aparece solo el día de `limit_date`
 * (fecha de cierre), sin importar el rango completo.
 */
export function taskToCloseCalendarEvent(task: Task, color?: string): EventInput | null {
  const closeDate = toDateOnly(task.limit_date)
  if (!closeDate) {
    return null
  }

  return {
    id: String(task.id),
    title: task.short_description,
    start: closeDate,
    allDay: true,
    ...eventColors(task, color),
  }
}

/** Devuelve el mapper de tarea → evento para la fase indicada. */
function phaseMapper(phase: TaskCalendarPhase) {
  return phase === 'process'
    ? taskToProcessCalendarEvent
    : phase === 'close'
      ? taskToCloseCalendarEvent
      : taskToStartCalendarEvent
}

/** Orden estable por fecha de inicio y luego título. */
function sortEvents(events: EventInput[]): EventInput[] {
  return events.sort((a, b) => {
    const startA = String(a.start ?? '')
    const startB = String(b.start ?? '')
    if (startA !== startB) {
      return startA.localeCompare(startB)
    }
    return String(a.title ?? '').localeCompare(String(b.title ?? ''))
  })
}

export function tasksToCalendarEvents(
  tasks: Task[],
  phase: TaskCalendarPhase = 'start',
): EventInput[] {
  const mapper = phaseMapper(phase)
  const events = tasks
    .map(task => mapper(task))
    .filter((event): event is EventInput => event != null)

  return sortEvents(events)
}

/** Proyecto con sus tareas y color asignado (modo "por tema"). */
export interface CalendarProjectEvents {
  id: number
  color: string
  tasks: Task[]
}

/**
 * Modo "por tema": cada proyecto aporta sus tareas con su color asignado.
 * Se guarda `projectId` en extendedProps para poder filtrar por proyecto.
 */
export function projectTasksToCalendarEvents(
  projects: CalendarProjectEvents[],
  phase: TaskCalendarPhase = 'start',
): EventInput[] {
  const mapper = phaseMapper(phase)
  const events: EventInput[] = []

  for (const project of projects) {
    for (const task of project.tasks) {
      const event = mapper(task, project.color)
      if (event) {
        events.push({
          ...event,
          extendedProps: { projectId: project.id },
        })
      }
    }
  }

  return sortEvents(events)
}
