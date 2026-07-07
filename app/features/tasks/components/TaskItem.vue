<script setup lang="ts">
import type { Task } from '~/features/tasks/types/task.types'

const props = defineProps<{ task: Task }>()

const { t, locale } = useI18n()

const typeMeta = computed(() => taskTypeMeta(props.task.type))
const priorityMeta = computed(() => taskPriorityMeta(props.task.priority))
const barColor = computed(() => taskBarColor(props.task))
const requiresAttention = computed(() => taskRequiresAttention(props.task))

const dueDiff = computed(() => diffInDays(props.task.limit_date))
const isOverdue = computed(() => dueDiff.value !== null && dueDiff.value < 0)

const dueLabel = computed(() => {
  const diff = dueDiff.value
  if (diff === null) {
    return ''
  }
  if (diff === 0) {
    return t('tasks.due.today')
  }
  if (diff === 1) {
    return t('tasks.due.tomorrow')
  }
  if (diff === -1) {
    return t('tasks.due.yesterday')
  }
  if (diff > 1 && diff <= 30) {
    return t('tasks.due.inDays', { n: diff })
  }
  return formatShortDate(props.task.limit_date, locale.value)
})
</script>

<template>
  <div
    class="relative flex items-center gap-3 pl-4 pr-4 py-3 border-b border-border hover:bg-muted/50 transition-colors"
  >
    <span
      class="absolute left-0 top-0 bottom-0 w-1 rounded-r"
      :style="{ backgroundColor: barColor }"
    />

    <button
      type="button"
      class="h-5 w-5 rounded-full border-2 border-muted-foreground/40 hover:border-aeto-teal shrink-0 transition-colors"
      :aria-label="t('tasks.complete')"
    />

    <span class="flex-1 min-w-0 text-sm text-foreground truncate">
      {{ task.short_description }}
    </span>

    <div class="flex items-center gap-1.5 shrink-0">
      <UBadge
        :icon="typeMeta.icon"
        :label="t(typeMeta.labelKey)"
        color="neutral"
        variant="soft"
        size="sm"
      />
      <UBadge
        v-if="priorityMeta"
        :label="t(priorityMeta.labelKey)"
        :color="priorityMeta.color"
        variant="soft"
        size="sm"
      />
      <UBadge
        v-if="requiresAttention"
        icon="i-lucide-triangle-alert"
        :label="t('tasks.requiresAttention')"
        color="error"
        variant="soft"
        size="sm"
        class="hidden lg:inline-flex"
      />
    </div>

    <span
      class="w-16 text-right text-xs shrink-0"
      :class="isOverdue ? 'text-error font-medium' : 'text-muted-foreground'"
    >
      {{ dueLabel }}
    </span>
  </div>
</template>
