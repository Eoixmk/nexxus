<script setup lang="ts">
import type { Task } from '~/features/tasks/types/task.types'
import TaskItem from '~/features/tasks/components/TaskItem.vue'
import TaskSectionBadgeFallback from '~/features/tasks/components/TaskSectionBadgeFallback.vue'

withDefaults(
  defineProps<{
    title: string
    dotColor: string
    tasks: Task[]
    count?: number
    loading?: boolean
    error?: boolean
    selectedTaskId?: number | null
  }>(),
  {
    count: undefined,
    loading: false,
    error: false,
    selectedTaskId: null,
  },
)

const emit = defineEmits<{
  select: [taskId: number]
}>()

const { t } = useI18n()
</script>

<template>
  <UCollapsible :default-open="true">
    <template #default="{ open }">
      <button
        type="button"
        class="mb-2 w-full flex items-center gap-2 rounded-md px-2 py-1.5 text-left hover:bg-muted/50 transition-colors"
      >
        <UIcon
          name="i-lucide-chevron-down"
          class="h-3.5 w-3.5 text-muted-foreground transition-transform"
          :class="{ '-rotate-90': !open }"
        />
        <span
          class="h-2 w-2 rounded-full shrink-0"
          :style="{ backgroundColor: dotColor }"
        />
        <span class="text-xs font-semibold uppercase tracking-wider text-foreground">
          {{ title }}
        </span>
        <span
          v-if="count !== undefined"
          class="ml-auto text-[11px] font-mono text-muted-foreground"
        >
          {{ count }}
        </span>
        <TaskSectionBadgeFallback v-else class="ml-auto" />
      </button>
    </template>

    <template #content>
      <div v-if="loading" class="space-y-1.5">
        <USkeleton v-for="n in 3" :key="n" class="h-11 w-full rounded-lg" />
      </div>

      <p v-else-if="error" class="rounded-lg border border-border bg-card px-4 py-4 text-sm text-error">
        {{ t('tasks.loadError') }}
      </p>

      <p v-else-if="!tasks.length" class="rounded-lg border border-border bg-card px-4 py-4 text-sm text-muted-foreground">
        {{ t('tasks.empty') }}
      </p>

      <div v-else class="space-y-1.5">
        <TaskItem
          v-for="task in tasks"
          :key="task.id"
          :task="task"
          :selected="selectedTaskId === task.id"
          @select="emit('select', $event)"
        />
      </div>
    </template>
  </UCollapsible>
</template>
