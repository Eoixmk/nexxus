import { useQuery } from '@tanstack/vue-query'
import type { PaginatedResponse } from '~/shared/types/api.types'
import type { ProjectDropdown } from '~/features/tasks/types/task.types'
import { extractResults } from '~/features/tasks/utils/task-api.util'

/**
 * Dropdown de proyectos de la empresa.
 *
 * NOTA: la empresa está fija en 1 por ahora (TODO: derivar de la empresa
 * seleccionada).
 */
export function useProjectsDropdown() {
  const { $api } = useNuxtApp()
  const companyId = 1

  const projects = useQuery({
    queryKey: ['tasks', companyId, 'projects', 'dropdown'],
    queryFn: () =>
      $api<PaginatedResponse<ProjectDropdown>>(
        `/api/tools/dropdown/projects/company/${companyId}/`,
      ),
  })

  const items = computed(() =>
    extractResults(projects.data.value).map(project => ({
      label: project.name,
      value: project.id,
    })),
  )

  return { projects, items }
}
