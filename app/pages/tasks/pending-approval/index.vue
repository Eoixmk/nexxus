<script setup lang="ts">
import TaskGroupByFilter from '~/features/tasks/components/TaskGroupByFilter.vue'
import TaskListFilters from '~/features/tasks/components/TaskListFilters.vue'
import TaskNewTaskSlideover from '~/features/tasks/components/TaskNewTaskSlideover.vue'
import TaskViewSwitcher from '~/features/tasks/components/TaskViewSwitcher.vue'
import type {
  TaskGroupBy,
  TaskListFilters as TaskListFiltersState,
  TaskView,
} from '~/features/tasks/types/task.types'

const ToUpdateListView = defineAsyncComponent(
  () => import('~/features/to-update/components/ToUpdateListView.vue'),
)
const ToUpdateKanbanView = defineAsyncComponent(
  () => import('~/features/to-update/components/ToUpdateKanbanView.vue'),
)

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

useSeoMeta({
  title: () => t('tasks.toUpdate.title'),
})
</script>

<template>
  <div class="h-full min-h-0 flex flex-col p-6">
    <h1 class="sr-only">
      {{ t('tasks.toUpdate.title') }}
    </h1>

    <div class="shrink-0 space-y-2">
      <div
        class="rounded-lg border border-border bg-card px-3 py-1.5 flex items-center justify-between gap-2"
      >
        <UButton
          color="neutral"
          variant="ghost"
          class="flex-1 justify-between px-0 hover:bg-transparent"
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
        </UButton>

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

        <div class="rounded-lg border border-border bg-card px-3 py-2 flex items-center gap-2 flex-wrap">
          <UInput
            v-model="search"
            icon="i-lucide-search"
            size="sm"
            class="w-52"
            :placeholder="t('toolbar.searchPlaceholder')"
          />
          <div class="flex-1 min-w-2" />
          <TaskViewSwitcher v-model="view" :exclude="['calendar']" />
        </div>
      </div>
    </div>

    <div
      class="mt-3 flex-1 min-h-0"
      :class="view === 'kanban' ? 'overflow-hidden' : 'overflow-y-auto'"
    >
      <ToUpdateListView
        v-if="view === 'list' && groupBy === 'all'"
        :filters="listFilters"
        :selected-task-id="selectedTaskId"
        @select="openTask"
      />
      <ToUpdateKanbanView
        v-else-if="view === 'kanban' && groupBy === 'all'"
        class="h-full"
        :filters="listFilters"
        :selected-task-id="selectedTaskId"
        @select="openTask"
      />

      <div
        v-else
        class="p-10 flex flex-col items-center justify-center text-center gap-2 text-muted-foreground"
      >
        <UIcon name="i-lucide-construction" class="h-8 w-8" />
        <p class="text-sm">
          {{ t('tasks.comingSoon') }}
        </p>
      </div>
    </div>

    <TaskNewTaskSlideover
      v-model:open="newTaskOpen"
      v-model:task-id="selectedTaskId"
    />
  </div>
</template>
