<script setup lang="ts">
import TaskKanbanBoard from '~/features/tasks/components/TaskKanbanBoard.vue'
import type { KanbanColumn, TaskListFilters } from '~/features/tasks/types/task.types'
import { extractResults } from '~/features/tasks/utils/task-api.util'

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

const { counts, today, tomorrow, week, month, noDate } = useOverdueTasks(() => props.filters)

const columns = computed<KanbanColumn[]>(() => [
  {
    id: 'today',
    labelKey: 'tasks.overdueSections.today',
    color: '#dc2626',
    count: counts.data.value?.today,
    tasks: extractResults(today.data.value),
    loading: today.isPending.value,
    error: today.isError.value,
  },
  {
    id: 'tomorrow',
    labelKey: 'tasks.overdueSections.tomorrow',
    color: '#f97316',
    count: counts.data.value?.tomorrow,
    tasks: extractResults(tomorrow.data.value),
    loading: tomorrow.isPending.value,
    error: tomorrow.isError.value,
  },
  {
    id: 'week',
    labelKey: 'tasks.overdueSections.week',
    color: '#6366f1',
    count: counts.data.value?.week,
    tasks: extractResults(week.data.value),
    loading: week.isPending.value,
    error: week.isError.value,
  },
  {
    id: 'month',
    labelKey: 'tasks.overdueSections.month',
    color: '#8b5cf6',
    count: counts.data.value?.month,
    tasks: extractResults(month.data.value),
    loading: month.isPending.value,
    error: month.isError.value,
  },
  {
    id: 'no_date',
    labelKey: 'tasks.overdueSections.noDate',
    color: '#6b7280',
    count: counts.data.value?.no_date,
    tasks: extractResults(noDate.data.value),
    loading: noDate.isPending.value,
    error: noDate.isError.value,
  },
])
</script>

<template>
  <TaskKanbanBoard
    :columns="columns"
    :selected-task-id="selectedTaskId"
    @select="emit('select', $event)"
  />
</template>
