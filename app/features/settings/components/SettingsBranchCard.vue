<script setup lang="ts">
import type { DropdownMenuItem } from '@nuxt/ui'
import type { CompanyBranch } from '~/features/settings/types/settings.types'

const props = defineProps<{
  branch: CompanyBranch
}>()

const emit = defineEmits<{
  remove: [id: string]
}>()

const { t } = useI18n()

const usersLabel = computed(() =>
  props.branch.userCount === 1
    ? t('settings.company.userSingular', { count: props.branch.userCount })
    : t('settings.company.userPlural', { count: props.branch.userCount }),
)

const menuItems = computed<DropdownMenuItem[][]>(() => [
  [
    {
      label: t('settings.company.deleteBranch'),
      icon: 'i-lucide-trash-2',
      color: 'error',
      onSelect: () => emit('remove', props.branch.id),
    },
  ],
])
</script>

<template>
  <div
    class="border border-border rounded-lg px-3.5 py-3 relative"
    :style="{
      borderWidth: '0.5px 0.5px 0.5px 3px',
      borderLeftStyle: 'solid',
      borderLeftColor: branch.color,
    }"
  >
    <div class="flex items-center justify-between gap-3">
      <div class="flex items-center gap-2 min-w-0">
        <span
          class="w-2 h-2 rounded-full shrink-0"
          :style="{ background: branch.color }"
        />
        <span class="text-[13px] font-medium text-foreground truncate">
          {{ branch.name }}
        </span>
        <span
          v-if="branch.isPrimary"
          class="text-[10px] px-1.5 py-0.5 rounded font-medium shrink-0 bg-indigo-50 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-200"
        >
          {{ t('settings.company.primary') }}
        </span>
      </div>

      <UDropdownMenu
        :items="menuItems"
        :content="{ align: 'end', sideOffset: 4 }"
      >
        <button
          type="button"
          class="p-1 rounded text-muted-foreground hover:bg-muted hover:text-foreground"
          :aria-label="t('settings.company.branchOptions')"
        >
          <UIcon
            name="i-lucide-ellipsis"
            class="h-4 w-4"
          />
        </button>
      </UDropdownMenu>
    </div>

    <div class="flex items-center gap-2 mt-1 text-[12px] text-muted-foreground">
      <UIcon
        name="i-lucide-map-pin"
        class="h-3 w-3 shrink-0"
      />
      <span class="truncate">{{ branch.locationLabel }}</span>
      <span>·</span>
      <UIcon
        name="i-lucide-users"
        class="h-3 w-3 shrink-0"
      />
      <span>{{ usersLabel }}</span>
    </div>
  </div>
</template>
