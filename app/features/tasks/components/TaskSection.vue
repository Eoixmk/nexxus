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
  }>(),
  {
    count: undefined,
    loading: false,
    error: false,
  },
)

const { t } = useI18n()
</script>

<template>
  <UCollapsible :default-open="true" class="border-b border-border">
    <template #default="{ open }">
      <button
        type="button"
        class="w-full flex items-center gap-2 px-4 py-2.5 hover:bg-muted/50 transition-colors"
      >
        <UIcon
          name="i-lucide-chevron-down"
          class="h-4 w-4 text-muted-foreground transition-transform"
          :class="{ '-rotate-90': !open }"
        />
        <UBadge
          v-if="count !== undefined"
          :label="count.toString()"
          size="md"
          class="text-white ring-0"
          :style="{ backgroundColor: dotColor }"
        />
        <TaskSectionBadgeFallback v-else />
        <span class="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {{ title }}
        </span>
      </button>
    </template>

    <template #content>
      <div v-if="loading" class="px-4 py-3 space-y-2">
        <USkeleton v-for="n in 3" :key="n" class="h-8 w-full" />
      </div>

      <p v-else-if="error" class="px-4 py-4 text-sm text-error">
        {{ t('tasks.loadError') }}
      </p>

      <p v-else-if="!tasks.length" class="px-4 py-4 text-sm text-muted-foreground">
        {{ t('tasks.empty') }}
      </p>

      <div v-else>
        <TaskItem v-for="task in tasks" :key="task.id" :task="task" />
      </div>
    </template>
  </UCollapsible>
</template>
