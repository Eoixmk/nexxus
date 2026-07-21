import type { TaskGroupBy, TaskListFilters, TaskView } from '~/features/tasks/types/task.types'

/** Estado compartido del workspace de tareas (filtros, vista, slideover). */
export function useTaskWorkspaceState() {
  const { t } = useI18n()

  const view = ref<TaskView>('list')
  const search = ref('')
  const groupBy = ref<TaskGroupBy>('all')
  const filtersOpen = ref(false)
  const newTaskOpen = ref(false)
  const selectedTaskId = ref<number | null>(null)

  const debouncedSearch = refDebounced(search, 300)
  const listFilters = ref<TaskListFilters>({})

  watch(debouncedSearch, (value) => {
    listFilters.value = {
      ...listFilters.value,
      short_description: value.trim() || undefined,
    }
  })

  const activeGroupByLabel = computed(() => t(`tasks.groupBy.${groupBy.value}`))

  function openNewTask() {
    selectedTaskId.value = null
    newTaskOpen.value = true
  }

  function openTask(taskId: number) {
    selectedTaskId.value = taskId
    newTaskOpen.value = true
  }

  return {
    view,
    search,
    groupBy,
    filtersOpen,
    newTaskOpen,
    selectedTaskId,
    listFilters,
    activeGroupByLabel,
    openNewTask,
    openTask,
  }
}
