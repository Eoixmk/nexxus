<script setup lang="ts">
import TaskSection from '~/features/tasks/components/TaskSection.vue'
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

defineEmits<{
  select: [taskId: number]
}>()

const { t } = useI18n()
const { counts, today, tomorrow, week, month, noDate } = useOverdueTasks(() => props.filters)
</script>

<template>
  <div class="space-y-6">
    <TaskSection
      :title="t('tasks.overdueSections.today')"
      dot-color="#dc2626"
      :count="counts.data.value?.today"
      :tasks="today.data.value?.results ?? []"
      :loading="today.isPending.value"
      :error="today.isError.value"
      :selected-task-id="selectedTaskId"
      @select="$emit('select', $event)"
    />

    <TaskSection
      :title="t('tasks.overdueSections.tomorrow')"
      dot-color="#f97316"
      :count="counts.data.value?.tomorrow"
      :tasks="tomorrow.data.value?.results ?? []"
      :loading="tomorrow.isPending.value"
      :error="tomorrow.isError.value"
      :selected-task-id="selectedTaskId"
      @select="$emit('select', $event)"
    />

    <TaskSection
      :title="t('tasks.overdueSections.week')"
      dot-color="#6366f1"
      :count="counts.data.value?.week"
      :tasks="week.data.value?.results ?? []"
      :loading="week.isPending.value"
      :error="week.isError.value"
      :selected-task-id="selectedTaskId"
      @select="$emit('select', $event)"
    />

    <TaskSection
      :title="t('tasks.overdueSections.month')"
      dot-color="#8b5cf6"
      :count="counts.data.value?.month"
      :tasks="month.data.value?.results ?? []"
      :loading="month.isPending.value"
      :error="month.isError.value"
      :selected-task-id="selectedTaskId"
      @select="$emit('select', $event)"
    />

    <TaskSection
      :title="t('tasks.overdueSections.noDate')"
      dot-color="#6b7280"
      :count="counts.data.value?.no_date"
      :tasks="noDate.data.value?.results ?? []"
      :loading="noDate.isPending.value"
      :error="noDate.isError.value"
      :selected-task-id="selectedTaskId"
      @select="$emit('select', $event)"
    />
  </div>
</template>
