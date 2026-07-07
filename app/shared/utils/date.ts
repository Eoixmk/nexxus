/**
 * Utilidades de fecha reutilizables en todo el proyecto.
 * Devuelven primitivos; el etiquetado i18n (hoy/mañana) se hace en la vista.
 */

export function parseDate(value?: string | null): Date | null {
  if (!value) {
    return null
  }
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? null : date
}

function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate())
}

/**
 * Diferencia en días completos entre `value` y `from` (por defecto hoy).
 * Negativo = pasado, 0 = hoy, positivo = futuro. `null` si no hay fecha.
 */
export function diffInDays(value?: string | null, from: Date = new Date()): number | null {
  const date = parseDate(value)
  if (!date) {
    return null
  }
  const ms = startOfDay(date).getTime() - startOfDay(from).getTime()
  return Math.round(ms / 86_400_000)
}

export function formatShortDate(value?: string | null, locale = 'es'): string {
  const date = parseDate(value)
  if (!date) {
    return ''
  }
  return new Intl.DateTimeFormat(locale, { day: '2-digit', month: 'short' }).format(date)
}

export function formatDateTime(value?: string | null, locale = 'es'): string {
  const date = parseDate(value)
  if (!date) {
    return ''
  }
  return new Intl.DateTimeFormat(locale, { dateStyle: 'medium', timeStyle: 'short' }).format(date)
}
