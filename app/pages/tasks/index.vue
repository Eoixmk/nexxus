<script setup lang="ts">
import TaskListView from '~/features/tasks/components/TaskListView.vue'
import TaskViewSwitcher from '~/features/tasks/components/TaskViewSwitcher.vue'
import type { TaskView } from '~/features/tasks/types/task.types'

// Protected route: redirects to /login when not authenticated.
definePageMeta({ middleware: 'auth' })

const { t } = useI18n()

const view = ref<TaskView>('list')
const search = ref('')

useTitle(t('toolbar.moduleName'))
</script>

<template>
  <div class="flex flex-col">
    <div
      class="sticky top-0 z-10 bg-background border-b border-border px-4 py-3 flex items-center justify-between gap-3"
    >
      <div class="flex items-center gap-2 text-sm min-w-0">
        <UIcon name="i-lucide-list-filter" class="h-4 w-4 text-muted-foreground shrink-0" />
        <span class="text-muted-foreground">{{ t('tasks.filters') }}</span>
        <span class="text-muted-foreground">·</span>
        <span class="font-medium text-foreground truncate">{{ t('tasks.sections.all') }}</span>
      </div>

      <div class="flex items-center gap-2 shrink-0">
        <div class="relative hidden md:block">
          <UIcon
            name="i-lucide-search"
            class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"
          />
          <input
            v-model="search"
            :placeholder="t('toolbar.searchPlaceholder')"
            class="w-52 pl-9 pr-3 py-1.5 text-sm rounded-md bg-muted border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-ring/40 focus:border-ring"
          >
        </div>
        <TaskViewSwitcher v-model="view" />
        <UButton icon="i-lucide-plus" color="primary" :label="t('tasks.newTask')" />
      </div>
    </div>

    <TaskListView v-if="view === 'list'" />

    <div
      v-else
      class="p-10 flex flex-col items-center justify-center text-center gap-2 text-muted-foreground"
    >
      <UIcon name="i-lucide-construction" class="h-8 w-8" />
      <p class="text-sm">{{ t('tasks.comingSoon') }}</p>
    </div>
  </div>
</template>
