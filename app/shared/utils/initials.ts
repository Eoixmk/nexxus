/**
 * Deriva las iniciales (máx. 2) a partir de un nombre o username.
 * Ej: "Carlos López" -> "CL", "carlos" -> "CA".
 */
export function getInitials(value: string | null | undefined): string {
  const source = (value ?? '').trim()
  if (!source) {
    return '?'
  }

  const parts = source.split(/\s+/).filter(Boolean)

  if (parts.length >= 2) {
    return (parts[0]![0]! + parts[1]![0]!).toUpperCase()
  }

  return source.slice(0, 2).toUpperCase()
}
