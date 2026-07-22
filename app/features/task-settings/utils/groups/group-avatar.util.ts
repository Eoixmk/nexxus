/** Paleta simple para avatares de iniciales. */
const AVATAR_COLORS = [
  '#f59e0b',
  '#28ceab',
  '#0ea5e9',
  '#f97316',
  '#8b5cf6',
  '#ef4444',
  '#22c55e',
  '#ec4899',
] as const

/** Color estable derivado del id de usuario. */
export function resolveAvatarColor(userId: number): string {
  const index = Math.abs(userId) % AVATAR_COLORS.length
  return AVATAR_COLORS[index]!
}
