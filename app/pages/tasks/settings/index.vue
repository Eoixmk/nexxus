<script setup lang="ts">
import TaskSettingsNavSidebar from '~/features/task-settings/components/TaskSettingsNavSidebar.vue'
import TaskSettingsPlaceholderPanel from '~/features/task-settings/components/TaskSettingsPlaceholderPanel.vue'
import TaskSettingsThemeModal from '~/features/task-settings/components/TaskSettingsThemeModal.vue'
import TaskSettingsThemesPanel from '~/features/task-settings/components/TaskSettingsThemesPanel.vue'
import type {
  TaskSettingsNavItem,
  TaskSettingsSectionId,
  ThemeFormState,
} from '~/features/task-settings/types/task-settings.types'
import { createEmptyThemeForm } from '~/features/task-settings/types/task-settings.types'
import { useEnterpriseProjects } from '~/features/projects/composables/useEnterpriseProjects'
import { parseFetchError } from '~/shared/utils/error-message.util'

definePageMeta({ middleware: 'auth' })

const { t } = useI18n()
const toast = useToast()

const activeSection = ref<TaskSettingsSectionId>('themes')
const themeModalOpen = ref(false)
const themeForm = ref<ThemeFormState>(createEmptyThemeForm())

const navItems: TaskSettingsNavItem[] = [
  { id: 'themes', labelKey: 'taskSettings.nav.themes', icon: 'i-lucide-palette' },
  { id: 'groups', labelKey: 'taskSettings.nav.groups', icon: 'i-lucide-users' },
  { id: 'nexxtep', labelKey: 'taskSettings.nav.nexxtep', icon: 'i-lucide-workflow' },
  { id: 'videoCalls', labelKey: 'taskSettings.nav.videoCalls', icon: 'i-lucide-video' },
  { id: 'notifications', labelKey: 'taskSettings.nav.notifications', icon: 'i-lucide-bell' },
  { id: 'general', labelKey: 'taskSettings.nav.general', icon: 'i-lucide-settings' },
]

const { projects, projectsQuery, createProject, companyId } = useEnterpriseProjects()

function openNewThemeModal() {
  themeForm.value = createEmptyThemeForm()
  themeModalOpen.value = true
}

async function onCreateTheme() {
  const name = themeForm.value.name.trim()
  if (!name || !themeForm.value.color) {
    return
  }

  try {
    await createProject.mutateAsync({
      name,
      company: companyId,
      color: themeForm.value.color,
      members: themeForm.value.members,
    })
    themeModalOpen.value = false
    toast.add({
      title: t('taskSettings.themeModal.createdTitle'),
      description: t('taskSettings.themeModal.createdDescription'),
      color: 'success',
    })
  }
  catch (error) {
    toast.add({
      title: t('taskSettings.themeModal.createErrorTitle'),
      description: parseFetchError(error),
      color: 'error',
    })
  }
}

useSeoMeta({
  title: () => t('taskSettings.title'),
})
</script>

<template>
  <div class="flex h-[calc(100dvh-3.5rem)] overflow-hidden">
    <TaskSettingsNavSidebar
      :items="navItems"
      :active-id="activeSection"
      @select="activeSection = $event"
    />

    <div class="flex-1 overflow-y-auto">
      <div class="max-w-[720px] mx-auto px-8 py-8">
        <TaskSettingsThemesPanel
          v-if="activeSection === 'themes'"
          :projects="projects"
          :loading="projectsQuery.isPending.value"
          :error="projectsQuery.isError.value"
          @new-theme="openNewThemeModal"
        />

        <TaskSettingsPlaceholderPanel
          v-else
          :title="t(`taskSettings.nav.${activeSection}`)"
          :description="t('taskSettings.placeholderDescription')"
        />
      </div>
    </div>

    <TaskSettingsThemeModal
      v-model:open="themeModalOpen"
      v-model:form="themeForm"
      :loading="createProject.isPending.value"
      @submit="onCreateTheme"
    />
  </div>
</template>
