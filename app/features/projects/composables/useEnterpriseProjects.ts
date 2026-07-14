import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'
import type { PaginatedResponse } from '~/shared/types/api.types'
import type {
  CreateEnterpriseProjectPayload,
  EnterpriseProject,
} from '~/features/projects/types/project.types'

/**
 * Listado y creación de temas (proyectos de empresa).
 *
 * NOTA: la empresa está fija en 1 por ahora (TODO: derivar de la empresa
 * seleccionada).
 */
export function useEnterpriseProjects() {
  const { $api } = useNuxtApp()
  const queryClient = useQueryClient()
  const companyId = 1

  const projectsQuery = useQuery({
    queryKey: ['enterprise-projects', companyId],
    queryFn: () =>
      $api<PaginatedResponse<EnterpriseProject>>('/api/enterprise/projects/'),
  })

  const projects = computed(() => projectsQuery.data.value?.results ?? [])

  const createProject = useMutation({
    mutationFn: (payload: CreateEnterpriseProjectPayload) =>
      $api('/api/enterprise/projects/create/', {
        method: 'POST',
        body: payload,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['enterprise-projects'] })
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
    },
  })

  return { projectsQuery, projects, createProject, companyId }
}
