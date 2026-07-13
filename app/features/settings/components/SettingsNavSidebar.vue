<script setup lang="ts">
import type { SettingsNavItem, SettingsSectionId } from '~/features/settings/types/settings.types'

defineProps<{
  items: SettingsNavItem[]
  activeId: SettingsSectionId
  completedCount: number
  totalCount: number
  progressPercent: number
}>()

const emit = defineEmits<{
  select: [id: SettingsSectionId]
}>()

const { t } = useI18n()
</script>

<template>
  <aside class="w-60 shrink-0 border-r border-border bg-card flex flex-col">
    <div class="px-5 py-4 border-b border-border">
      <div class="text-[11px] uppercase tracking-wider text-muted-foreground mb-1">
        {{ t('settings.navTitle') }}
      </div>
      <div class="flex items-center gap-2">
        <div class="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
          <div
            class="h-full rounded-full transition-all bg-aeto-teal"
            :style="{ width: `${progressPercent}%` }"
          />
        </div>
        <span class="text-[11px] font-mono text-muted-foreground">
          {{ completedCount }}/{{ totalCount }}
        </span>
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
        <span
          v-if="item.completed"
          class="w-4 h-4 rounded-full flex items-center justify-center bg-aeto-teal"
        >
          <UIcon
            name="i-lucide-check"
            class="h-2.5 w-2.5 text-white"
          />
        </span>
      </button>
    </nav>
  </aside>
</template>
