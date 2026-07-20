<script setup lang="ts">
import type { DropdownMenuItem } from '@nuxt/ui'

interface NavItem {
  labelKey: string
  icon: string
  to?: string
  indent?: boolean
  badge?: number
}

const { t, locale, setLocale } = useI18n()
const { user, logout } = useAuth()
const { collapsed } = useSidebar()
const route = useRoute()

// TODO: sustituir por el nombre/rol reales cuando el modelo de usuario los exponga.
const displayName = computed(() => user.value?.username ?? t('user.fallback'))
const displayRole = computed(() => t('user.roleManager'))
const initials = computed(() => getInitials(displayName.value))

const tasksItems: NavItem[] = [
  { labelKey: 'sidebar.reporteCeo', icon: 'i-lucide-file-chart-column', to: '/reporte-ceo' },
  { labelKey: 'sidebar.dashboard', icon: 'i-lucide-layout-dashboard', to: '/dashboard' },
  { labelKey: 'sidebar.tasks', icon: 'i-lucide-square-check-big', to: '/tasks' },
  { labelKey: 'sidebar.toAccept', icon: 'i-lucide-inbox', indent: true, badge: 1 }, // mock: aún sin ruta
  { labelKey: 'sidebar.toUpdate', icon: 'i-lucide-refresh-cw', indent: true, to: '/tasks/pending-approval' },
  { labelKey: 'sidebar.settings', icon: 'i-lucide-settings', indent: true, to: '/tasks/settings' },
]

const masterItems: NavItem[] = [
  { labelKey: 'sidebar.masterSettings', icon: 'i-lucide-settings-2', to: '/settings' },
]

function isActive(item: NavItem): boolean {
  if (!item.to) {
    return false
  }
  // /tasks no debe activarse en /tasks/settings
  if (item.to === '/tasks') {
    return route.path === '/tasks'
  }
  return route.path === item.to || route.path.startsWith(`${item.to}/`)
}

function navigate(item: NavItem) {
  if (item.to) {
    navigateTo(item.to)
  }
}

const userMenuItems = computed<DropdownMenuItem[][]>(() => [
  [
    {
      label: t('settings.language.title'),
      icon: 'i-lucide-languages',
      type: 'label',
    },
    {
      label: 'ES',
      type: 'checkbox',
      checked: locale.value === 'es',
      onUpdateChecked(checked) {
        if (checked) {
          void setLocale('es')
        }
      },
    },
    {
      label: 'EN',
      type: 'checkbox',
      checked: locale.value === 'en',
      onUpdateChecked(checked) {
        if (checked) {
          void setLocale('en')
        }
      },
    },
  ],
  [
    {
      label: t('common.logout'),
      icon: 'i-lucide-log-out',
      color: 'error',
      onSelect: () => {
        logout()
      },
    },
  ],
])
</script>

<template>
  <aside
    class="shrink-0 flex flex-col bg-sidebar border-r border-sidebar-border transition-[width] duration-200"
    :class="collapsed ? 'w-16' : 'w-60'"
  >
    <div
      class="h-16 flex items-center border-b border-sidebar-border"
      :class="collapsed ? 'justify-center px-0' : 'px-5'"
    >
      <NexxusLogo :collapsed="collapsed" class="h-9" />
    </div>

    <div v-if="!collapsed" class="px-5 pt-4 pb-2">
      <div class="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
        {{ t('sidebar.sectionTasks') }}
      </div>
    </div>
    <div v-else class="pt-4" />

    <nav class="flex-1 overflow-y-auto px-3">
      <div class="space-y-0.5">
        <UTooltip
          v-for="item in tasksItems"
          :key="item.labelKey"
          :text="collapsed ? t(item.labelKey) : undefined"
          :content="{ side: 'right', sideOffset: 8 }"
        >
          <button
            type="button"
            :aria-label="t(item.labelKey)"
            class="w-full flex items-center py-2 text-sm rounded-md transition-colors relative"
            :class="[
              collapsed ? 'justify-center px-0' : 'gap-3 px-3',
              isActive(item)
                ? 'bg-aeto-teal-light text-aeto-teal-dark font-medium'
                : 'text-sidebar-foreground hover:bg-muted',
              !collapsed && item.indent && 'pl-9',
            ]"
            @click="navigate(item)"
          >
            <span
              v-if="isActive(item)"
              class="absolute left-0 top-1.5 bottom-1.5 w-[3px] rounded-r bg-aeto-teal"
            />
            <span class="relative">
              <UIcon :name="item.icon" class="h-4 w-4 shrink-0" />
              <span
                v-if="collapsed && item.badge"
                class="absolute -top-1 -right-1 h-2 w-2 rounded-full"
                style="background-color: #f59e0b"
              />
            </span>
            <template v-if="!collapsed">
              <span class="flex-1 text-left">{{ t(item.labelKey) }}</span>
              <span
                v-if="item.badge"
                class="inline-flex items-center justify-center text-[10px] font-semibold px-1.5 rounded-full min-w-[18px] h-[18px] text-neutral-900"
                style="background-color: #f59e0b"
              >
                {{ item.badge }}
              </span>
            </template>
          </button>
        </UTooltip>
      </div>

      <div v-if="!collapsed" class="px-3 pt-5 pb-2">
        <div class="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
          {{ t('sidebar.sectionMaster') }}
        </div>
      </div>
      <div v-else class="my-3 mx-2 border-t border-sidebar-border" />

      <div class="space-y-0.5">
        <UTooltip
          v-for="item in masterItems"
          :key="item.labelKey"
          :text="collapsed ? t(item.labelKey) : undefined"
          :content="{ side: 'right', sideOffset: 8 }"
        >
          <button
            type="button"
            :aria-label="t(item.labelKey)"
            class="w-full flex items-center py-2 text-sm rounded-md transition-colors relative"
            :class="[
              collapsed ? 'justify-center px-0' : 'gap-3 px-3',
              isActive(item)
                ? 'bg-aeto-teal-light text-aeto-teal-dark font-medium'
                : 'text-sidebar-foreground hover:bg-muted',
            ]"
            @click="navigate(item)"
          >
            <span
              v-if="isActive(item)"
              class="absolute left-0 top-1.5 bottom-1.5 w-[3px] rounded-r bg-aeto-teal"
            />
            <UIcon :name="item.icon" class="h-4 w-4 shrink-0" />
            <span v-if="!collapsed" class="flex-1 text-left">{{ t(item.labelKey) }}</span>
          </button>
        </UTooltip>
      </div>
    </nav>

    <div class="p-2 border-t border-sidebar-border">
      <UDropdownMenu
        :items="userMenuItems"
        :content="{ side: 'top', align: 'start', sideOffset: 8 }"
        :ui="{ content: 'w-52' }"
      >
        <button
          type="button"
          :title="displayName"
          class="w-full flex items-center gap-2.5 rounded-md p-1.5 hover:bg-muted transition-colors"
          :class="collapsed ? 'justify-center' : ''"
        >
          <span
            class="inline-flex items-center justify-center rounded-full font-semibold text-white select-none w-8 h-8 text-[12.8px] leading-none shrink-0"
            style="background-color: #f59e0b"
          >
            {{ initials }}
          </span>
          <template v-if="!collapsed">
            <div class="flex-1 min-w-0 text-left">
              <div class="text-[13px] font-semibold text-foreground truncate">
                {{ displayName }}
              </div>
              <div class="text-[11px] text-muted-foreground truncate">
                {{ displayRole }}
              </div>
            </div>
            <UIcon
              name="i-lucide-chevrons-up-down"
              class="h-4 w-4 shrink-0 text-muted-foreground"
            />
          </template>
        </button>
      </UDropdownMenu>
    </div>
  </aside>
</template>
