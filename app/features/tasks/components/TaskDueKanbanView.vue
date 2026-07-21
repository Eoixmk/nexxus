<script setup lang="ts">
import TaskKanbanBoard from '~/features/tasks/components/TaskKanbanBoard.vue'
import type { TaskListFilters } from '~/features/tasks/types/task.types'
import { sectionsToKanbanColumns } from '~/features/tasks/utils/kanban.util'

const props = withDefaults(
  defineProps<{
    filters: TaskListFilters
    selectedTaskId?: number | null
  }>(),
  {
    selectedTaskId: null,
  },
)

const emit = defineEmits<{
  select: [taskId: number]
}>()

const { sections } = useOverdueTasks(() => props.filters)
const columns = computed(() => sectionsToKanbanColumns(sections.value))
</script>

<template>
  <TaskKanbanBoard
    class="h-full"
    :columns="columns"
    :selected-task-id="selectedTaskId"
    @select="emit('select', $event)"
  />
</template>
