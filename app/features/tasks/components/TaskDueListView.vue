<script setup lang="ts">
import TaskSection from '~/features/tasks/components/TaskSection.vue'
import type { TaskListFilters } from '~/features/tasks/types/task.types'

const props = defineProps<{
  filters: TaskListFilters
}>()

const { t } = useI18n()
const { counts, today, tomorrow, week, month, noDate } = useOverdueTasks(() => props.filters)
</script>

<template>
  <div>
    <TaskSection
      :title="t('tasks.overdueSections.today')"
      dot-color="#dc2626"
      :count="counts.data.value?.today"
      :tasks="today.data.value?.results ?? []"
      :loading="today.isPending.value"
      :error="today.isError.value"
    />

    <TaskSection
      :title="t('tasks.overdueSections.tomorrow')"
      dot-color="#f97316"
      :count="counts.data.value?.tomorrow"
      :tasks="tomorrow.data.value?.results ?? []"
      :loading="tomorrow.isPending.value"
      :error="tomorrow.isError.value"
    />

    <TaskSection
      :title="t('tasks.overdueSections.week')"
      dot-color="#6366f1"
      :count="counts.data.value?.week"
      :tasks="week.data.value?.results ?? []"
      :loading="week.isPending.value"
      :error="week.isError.value"
    />

    <TaskSection
      :title="t('tasks.overdueSections.month')"
      dot-color="#8b5cf6"
      :count="counts.data.value?.month"
      :tasks="month.data.value?.results ?? []"
      :loading="month.isPending.value"
      :error="month.isError.value"
    />

    <TaskSection
      :title="t('tasks.overdueSections.noDate')"
      dot-color="#6b7280"
      :count="counts.data.value?.no_date"
      :tasks="noDate.data.value?.results ?? []"
      :loading="noDate.isPending.value"
      :error="noDate.isError.value"
    />
  </div>
</template>
