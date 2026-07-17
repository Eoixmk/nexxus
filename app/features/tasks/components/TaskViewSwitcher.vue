<script setup lang="ts">
import type { TaskView } from '~/features/tasks/types/task.types'

const model = defineModel<TaskView>({ required: true })

const { t } = useI18n()

const views: { value: TaskView, icon: string, labelKey: string }[] = [
  { value: 'list', icon: 'i-lucide-list', labelKey: 'tasks.views.list' },
  { value: 'kanban', icon: 'i-lucide-columns-3', labelKey: 'tasks.views.kanban' },
  { value: 'calendar', icon: 'i-lucide-calendar', labelKey: 'tasks.views.calendar' },
]
</script>

<template>
  <div class="inline-flex p-0.5 rounded-md border border-border bg-background">
    <button
      v-for="view in views"
      :key="view.value"
      type="button"
      class="px-2.5 py-1 text-xs rounded inline-flex items-center gap-1.5 transition-colors"
      :class="model === view.value
        ? 'bg-aeto-teal-light text-aeto-teal-dark font-semibold'
        : 'text-muted-foreground hover:text-foreground'"
      @click="model = view.value"
    >
      <UIcon :name="view.icon" class="h-3.5 w-3.5" />
      {{ t(view.labelKey) }}
    </button>
  </div>
</template>
