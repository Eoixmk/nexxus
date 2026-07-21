<script setup lang="ts">
import type { TaskListFilters, TaskType } from '~/features/tasks/types/task.types'

const filters = defineModel<TaskListFilters>({ required: true })

const { t } = useI18n()
const { projects, items: projectItems } = useProjectsDropdown()

const TYPE_OPTIONS: TaskType[] = [
  'bug',
  'puesto',
  'manual',
  'trigger',
  'repeat',
  'volume',
  'multiple_close',
]

const typeItems = computed(() => [
  { label: t('tasks.filterAll'), value: 'all' },
  ...TYPE_OPTIONS.map(type => ({
    label: t(`tasks.types.${type}`),
    value: type,
  })),
])

const projectSelectItems = computed(() => [
  { label: t('tasks.filterAll'), value: 'all' },
  ...projectItems.value,
])

const selectedType = computed({
  get: () => filters.value.type ?? 'all',
  set: (value: TaskType | 'all') => {
    filters.value = {
      ...filters.value,
      type: value === 'all' ? undefined : value,
    }
  },
})

const selectedProject = computed({
  get: () => filters.value.project ?? 'all',
  set: (value: number | 'all') => {
    filters.value = {
      ...filters.value,
      project: value === 'all' ? undefined : value,
    }
  },
})

function setBooleanFilter(key: 'overdue' | 'completed' | 'multiple_close', value: boolean) {
  filters.value = {
    ...filters.value,
    [key]: value || undefined,
  }
}
</script>

<template>
  <div class="mb-2 rounded-lg border border-border bg-card px-3 py-2 flex items-end gap-3 flex-wrap h-full box-border">
    <UFormField :label="t('tasks.filterType')" class="min-w-36">
      <USelect
        v-model="selectedType"
        :items="typeItems"
        :placeholder="t('tasks.filterTypePlaceholder')"
        size="sm"
        class="w-40"
      />
    </UFormField>

    <span class="hidden sm:block h-8 w-px bg-border" aria-hidden="true" />

    <UFormField :label="t('tasks.filterProject')" class="min-w-36">
      <USelect
        v-model="selectedProject"
        :items="projectSelectItems"
        :placeholder="t('tasks.filterProjectPlaceholder')"
        :loading="projects.isPending.value"
        size="sm"
        class="w-48"
      />
    </UFormField>

    <span class="hidden sm:block h-8 w-px bg-border" aria-hidden="true" />

    <div class="flex items-center gap-4 flex-wrap h-8">
      <label class="inline-flex items-center gap-2 text-xs text-muted-foreground cursor-pointer">
        <USwitch
          size="sm"
          :model-value="!!filters.overdue"
          @update:model-value="setBooleanFilter('overdue', $event)"
        />
        {{ t('tasks.filterOverdue') }}
      </label>

      <label class="inline-flex items-center gap-2 text-xs text-muted-foreground cursor-pointer">
        <USwitch
          size="sm"
          :model-value="!!filters.completed"
          @update:model-value="setBooleanFilter('completed', $event)"
        />
        {{ t('tasks.filterCompleted') }}
      </label>

      <label class="inline-flex items-center gap-2 text-xs text-muted-foreground cursor-pointer">
        <USwitch
          size="sm"
          :model-value="!!filters.multiple_close"
          @update:model-value="setBooleanFilter('multiple_close', $event)"
        />
        {{ t('tasks.filterMultipleClose') }}
      </label>
    </div>
  </div>
</template>
