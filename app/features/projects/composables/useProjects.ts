export interface Project {
  id: number
  name: string
}

/**
 * Ejemplo de consumo de la API con sesión activa.
 * Patrón recomendado por feature: composable + TanStack Query en la página.
 */
export function useProjects() {
  const { authFetch } = useAuth()

  function fetchProjects() {
    return authFetch<Project[]>('/api/projects/')
  }

  function fetchProject(id: number) {
    return authFetch<Project>(`/api/projects/${id}/`)
  }

  return { fetchProjects, fetchProject }
}
