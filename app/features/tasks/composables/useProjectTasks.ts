import { useQueries, useQuery } from '@tanstack/vue-query'
import type { PaginatedResponse } from '~/shared/types/api.types'
import { extractResults } from '~/features/tasks/utils/task-api.util'
import type {
  ProjectDropdown,
  ProjectTaskCount,
  ProjectTaskSection,
  Task,
} from '~/features/tasks/types/task.types'

const PROJECT_SECTION_COLORS = ['#6366f1', '#28ceab', '#f97316', '#8b5cf6', '#dc2626', '#6b7280']

/**
 * Server state de tareas agrupadas por proyecto vía TanStack Query.
 *
 * NOTA: la empresa está fija en 1 por ahora (TODO: derivar de la empresa
 * seleccionada).
 */
export function useProjectTasks() {
  const { $api } = useNuxtApp()
  const companyId = 1

  const projectsBase = `/api/tools/dropdown/projects/company/${companyId}`
  const tasksBase = `/api/tasks/company/${companyId}/project`

  const projects = useQuery({
    queryKey: ['tasks', companyId, 'projects', 'dropdown'],
    queryFn: () => $api<PaginatedResponse<ProjectDropdown>>(`${projectsBase}/`),
  })

  const counts = useQuery({
    queryKey: ['tasks', companyId, 'project', 'counts'],
    queryFn: () => $api<ProjectTaskCount[]>(`${tasksBase}/counts/`),
  })

  const projectList = computed(() => extractResults(projects.data.value))

  const projectIds = computed(() => projectList.value.map(p => p.id))

  const taskQueries = useQueries({
    queries: computed(() =>
      projectIds.value.map(id => ({
        queryKey: ['tasks', companyId, 'project', id],
        queryFn: () => $api<PaginatedResponse<Task>>(`${tasksBase}/${id}/`),
        enabled: projectIds.value.length > 0,
      })),
    ),
  })

  const sections = computed<ProjectTaskSection[]>(() => {
    const countsMap = new Map((counts.data.value ?? []).map(c => [c.id, c.total]))

    return projectList.value.map((project, index) => {
      const query = taskQueries.value[index]
      const tasks = extractResults(query?.data)

      return {
        id: project.id,
        name: project.name,
        count: countsMap.get(project.id),
        dotColor: tasks[0]?.project_color?.trim()?.startsWith('#')
          ? tasks[0].project_color.trim()
          : PROJECT_SECTION_COLORS[index % PROJECT_SECTION_COLORS.length],
        tasks,
        loading: query?.isPending ?? false,
        error: query?.isError ?? false,
      }
    })
  })

  return { projects, counts, sections }
}
