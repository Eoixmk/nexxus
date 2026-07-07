import type { Project } from '~/features/projects/types/project.types'

/**
 * Ejemplo de consumo de la API con sesión activa.
 * Patrón recomendado por feature: composable + TanStack Query en la página.
 */
export function useProjects() {
  const { $api } = useNuxtApp()

  function fetchProjects() {
    return $api<Project[]>('/api/projects/')
  }

  function fetchProject(id: number) {
    return $api<Project>(`/api/projects/${id}/`)
  }

  return { fetchProjects, fetchProject }
}
