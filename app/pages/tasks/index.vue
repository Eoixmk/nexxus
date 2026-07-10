<script setup lang="ts">
import TaskNewTaskSlideover from '~/features/tasks/components/TaskNewTaskSlideover.vue'
import TaskDueListView from '~/features/tasks/components/TaskDueListView.vue'
import TaskGroupByFilter from '~/features/tasks/components/TaskGroupByFilter.vue'
import TaskGroupListView from '~/features/tasks/components/TaskGroupListView.vue'
import TaskListFilters from '~/features/tasks/components/TaskListFilters.vue'
import TaskListView from '~/features/tasks/components/TaskListView.vue'
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

const debouncedSearch = refDebounced(search, 300)

const listFilters = ref<TaskListFiltersState>({})

watch(debouncedSearch, (value) => {
  listFilters.value = {
    ...listFilters.value,
    short_description: value.trim() || undefined,
  }
})

const activeGroupByLabel = computed(() => t(`tasks.groupBy.${groupBy.value}`))

useTitle(t('toolbar.moduleName'))
</script>

<template>
  <div class="flex flex-col m-8">
    <div
      class="sticky top-0 z-10 bg-background border-b border-border px-4 py-3 flex items-center justify-between gap-3"
    >
      <button
        type="button"
        class="flex items-center gap-2 text-sm min-w-0 hover:opacity-80 transition-opacity"
        @click="filtersOpen = !filtersOpen"
      >
        <UIcon name="i-lucide-list-filter" class="h-4 w-4 text-muted-foreground shrink-0" />
        <span class="text-muted-foreground">{{ t('tasks.filters') }}</span>
        <span class="text-muted-foreground">-</span>
        <span class="font-medium text-foreground truncate">{{ activeGroupByLabel }}</span>
      </button>

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
        <UButton
          icon="i-lucide-plus"
          color="primary"
          :label="t('tasks.newTask')"
          @click="() => { newTaskOpen = true }"
        />
      </div>
    </div>

    <div v-if="filtersOpen" class="px-4 pt-3 space-y-2">
      <TaskGroupByFilter v-model="groupBy" />
      <TaskListFilters v-model="listFilters" />
    </div>

    <TaskListView v-if="view === 'list' && groupBy === 'all'" :filters="listFilters" />
    <TaskDueListView v-else-if="view === 'list' && groupBy === 'due'" :filters="listFilters" />
    <TaskTopicListView v-else-if="view === 'list' && groupBy === 'topic'" :filters="listFilters" />
    <TaskGroupListView v-else-if="view === 'list' && groupBy === 'group'" :filters="listFilters" />

    <div
      v-else-if="view === 'list'"
      class="p-10 flex flex-col items-center justify-center text-center gap-2 text-muted-foreground"
    >
      <UIcon name="i-lucide-construction" class="h-8 w-8" />
      <p class="text-sm">{{ t('tasks.comingSoon') }}</p>
    </div>

    <div
      v-else
      class="p-10 flex flex-col items-center justify-center text-center gap-2 text-muted-foreground"
    >
      <UIcon name="i-lucide-construction" class="h-8 w-8" />
      <p class="text-sm">{{ t('tasks.comingSoon') }}</p>
    </div>

    <TaskNewTaskSlideover v-model:open="newTaskOpen" />
  </div>
</template>
