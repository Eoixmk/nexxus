/** Perfil de usuario (GET /api/auth/profiles/). */
export interface AuthProfile {
  id: number
  username: string
  selected_company: number | null
}
