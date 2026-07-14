<script setup lang="ts">
import type { TaskSettingsNavItem, TaskSettingsSectionId } from '~/features/task-settings/types/task-settings.types'

defineProps<{
  items: TaskSettingsNavItem[]
  activeId: TaskSettingsSectionId
}>()

const emit = defineEmits<{
  select: [id: TaskSettingsSectionId]
}>()

const { t } = useI18n()
</script>

<template>
  <aside class="w-60 shrink-0 border-r border-border bg-card flex flex-col">
    <div class="px-5 py-4 border-b border-border">
      <div class="text-sm font-semibold text-foreground">
        {{ t('taskSettings.navTitle') }}
      </div>
      <div class="text-[11px] text-muted-foreground mt-0.5">
        {{ t('taskSettings.navSubtitle') }}
      </div>
    </div>

    <nav class="flex-1 p-2 space-y-0.5 overflow-y-auto">
      <button
        v-for="item in items"
        :key="item.id"
        type="button"
        class="w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-sm transition relative"
        :class="activeId === item.id
          ? 'bg-aeto-teal-light text-aeto-teal-dark font-medium'
          : 'text-muted-foreground hover:bg-muted hover:text-foreground'"
        @click="emit('select', item.id)"
      >
        <UIcon
          :name="item.icon"
          class="h-4 w-4 shrink-0"
        />
        <span class="flex-1 text-left">
          {{ t(item.labelKey) }}
        </span>
      </button>
    </nav>
  </aside>
</template>
