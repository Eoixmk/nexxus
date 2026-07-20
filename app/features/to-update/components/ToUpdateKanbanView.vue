<script setup lang="ts">
import TaskKanbanBoard from '~/features/tasks/components/TaskKanbanBoard.vue'
import type { TaskListFilters } from '~/features/tasks/types/task.types'

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

const { columns } = useToUpdateKanban(() => props.filters)
</script>

<template>
  <TaskKanbanBoard
    :columns="columns"
    :selected-task-id="selectedTaskId"
    @select="emit('select', $event)"
  />
</template>
