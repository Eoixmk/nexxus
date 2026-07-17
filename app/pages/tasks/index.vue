<script setup lang="ts">
import TaskNewTaskSlideover from '~/features/tasks/components/TaskNewTaskSlideover.vue'
import TaskDueKanbanView from '~/features/tasks/components/TaskDueKanbanView.vue'
import TaskDueListView from '~/features/tasks/components/TaskDueListView.vue'
import TaskGroupByFilter from '~/features/tasks/components/TaskGroupByFilter.vue'
import TaskGroupKanbanView from '~/features/tasks/components/TaskGroupKanbanView.vue'
import TaskGroupListView from '~/features/tasks/components/TaskGroupListView.vue'
import TaskKanbanView from '~/features/tasks/components/TaskKanbanView.vue'
import TaskListFilters from '~/features/tasks/components/TaskListFilters.vue'
import TaskListView from '~/features/tasks/components/TaskListView.vue'
import TaskTopicKanbanView from '~/features/tasks/components/TaskTopicKanbanView.vue'
import TaskTopicListView from '~/features/tasks/components/TaskTopicListView.vue'
import TaskViewSwitcher from '~/features/tasks/components/TaskViewSwitcher.vue'
import type { TaskGroupBy, TaskListFilters as TaskListFiltersState, TaskView } from '~/features/tasks/types/task.types'

// Protected route: redirects to /login when not authenticated.
definePageMeta({ middleware: 'auth' })

const { t } = useI18n()

const view = ref<TaskView>('list')
const search = ref('')
const groupBy = ref<TaskGroupBy>('all')
const filtersOpen = ref(false)
const newTaskOpen = ref(false)
const selectedTaskId = ref<number | null>(null)

const debouncedSearch = refDebounced(search, 300)

const listFilters = ref<TaskListFiltersState>({})

watch(debouncedSearch, (value) => {
  listFilters.value = {
    ...listFilters.value,
    short_description: value.trim() || undefined,
  }
})

const activeGroupByLabel = computed(() => t(`tasks.groupBy.${groupBy.value}`))

function openNewTask() {
  selectedTaskId.value = null
  newTaskOpen.value = true
}

function openTask(taskId: number) {
  selectedTaskId.value = taskId
  newTaskOpen.value = true
}

useTitle(t('toolbar.moduleName'))
</script>

<template>
  <main class="flex-1 overflow-y-auto p-6">
    <h1 class="sr-only">
      {{ t('toolbar.moduleName') }}
    </h1>

    <div
      class="mb-2 rounded-lg border border-border bg-card px-3 py-1.5 flex items-center justify-between gap-2"
    >
      <button
        type="button"
        class="flex-1 flex items-center justify-between gap-2 py-0.5 text-left hover:opacity-80 transition-opacity"
        @click="filtersOpen = !filtersOpen"
      >
        <span class="inline-flex items-center gap-2 text-xs font-semibold text-muted-foreground min-w-0">
          <UIcon name="i-lucide-sliders-horizontal" class="h-3.5 w-3.5 shrink-0" />
          <span>{{ t('tasks.filters') }} ·</span>
          <span class="text-foreground truncate">{{ activeGroupByLabel }}</span>
          <span class="font-normal hidden sm:inline">· {{ t(`tasks.views.${view}`) }}</span>
        </span>
        <UIcon
          name="i-lucide-chevron-down"
          class="h-4 w-4 text-muted-foreground shrink-0 transition-transform"
          :class="{ 'rotate-180': filtersOpen }"
        />
      </button>

      <UButton
        icon="i-lucide-plus"
        color="primary"
        size="sm"
        class="h-8 font-semibold shrink-0"
        :label="t('tasks.newTask')"
        @click="openNewTask"
      />
    </div>

    <div v-if="filtersOpen" class="space-y-2">
      <TaskGroupByFilter v-model="groupBy" />
      <TaskListFilters v-model="listFilters" />

      <div class="mb-2 rounded-lg border border-border bg-card px-3 py-2 flex items-center gap-2 flex-wrap">
        <div class="relative">
          <UIcon
            name="i-lucide-search"
            class="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground"
          />
          <input
            v-model="search"
            :placeholder="t('toolbar.searchPlaceholder')"
            class="h-8 w-52 pl-8 pr-3 text-xs rounded-md border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring/40"
          >
        </div>
        <div class="flex-1 min-w-2" />
        <TaskViewSwitcher v-model="view" />
      </div>
    </div>

    <div class="mt-3">
      <TaskListView
        v-if="view === 'list' && groupBy === 'all'"
        :filters="listFilters"
        :selected-task-id="selectedTaskId"
        @select="openTask"
      />
      <TaskDueListView
        v-else-if="view === 'list' && groupBy === 'due'"
        :filters="listFilters"
        :selected-task-id="selectedTaskId"
        @select="openTask"
      />
      <TaskTopicListView
        v-else-if="view === 'list' && groupBy === 'topic'"
        :filters="listFilters"
        :selected-task-id="selectedTaskId"
        @select="openTask"
      />
      <TaskGroupListView
        v-else-if="view === 'list' && groupBy === 'group'"
        :filters="listFilters"
        :selected-task-id="selectedTaskId"
        @select="openTask"
      />
      <TaskKanbanView
        v-else-if="view === 'kanban' && groupBy === 'all'"
        :filters="listFilters"
        :selected-task-id="selectedTaskId"
        @select="openTask"
      />
      <TaskDueKanbanView
        v-else-if="view === 'kanban' && groupBy === 'due'"
        :filters="listFilters"
        :selected-task-id="selectedTaskId"
        @select="openTask"
      />
      <TaskTopicKanbanView
        v-else-if="view === 'kanban' && groupBy === 'topic'"
        :filters="listFilters"
        :selected-task-id="selectedTaskId"
        @select="openTask"
      />
      <TaskGroupKanbanView
        v-else-if="view === 'kanban' && groupBy === 'group'"
        :filters="listFilters"
        :selected-task-id="selectedTaskId"
        @select="openTask"
      />

      <div
        v-else
        class="p-10 flex flex-col items-center justify-center text-center gap-2 text-muted-foreground"
      >
        <UIcon name="i-lucide-construction" class="h-8 w-8" />
        <p class="text-sm">{{ t('tasks.comingSoon') }}</p>
      </div>
    </div>

    <TaskNewTaskSlideover
      v-model:open="newTaskOpen"
      v-model:task-id="selectedTaskId"
    />
  </main>
</template>
