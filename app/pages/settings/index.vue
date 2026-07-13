<script setup lang="ts">
import SettingsBranchModal from '~/features/settings/components/SettingsBranchModal.vue'
import SettingsCompanyPanel from '~/features/settings/components/SettingsCompanyPanel.vue'
import SettingsNavSidebar from '~/features/settings/components/SettingsNavSidebar.vue'
import SettingsPlaceholderPanel from '~/features/settings/components/SettingsPlaceholderPanel.vue'
import SettingsPreferencesPanel from '~/features/settings/components/SettingsPreferencesPanel.vue'

definePageMeta({ middleware: 'auth' })

const { t } = useI18n()
const toast = useToast()

const {
  activeSection,
  navItems,
  completedCount,
  progressPercent,
  company,
  branches,
  branchModalOpen,
  branchForm,
  openNewBranchModal,
  saveBranch,
  removeBranch,
} = useSettingsMock()

function onSaveCompany() {
  toast.add({
    title: t('settings.company.savedTitle'),
    description: t('settings.company.savedDescription'),
    color: 'success',
  })
}

useTitle(t('settings.title'))
</script>

<template>
  <div class="flex h-[calc(100dvh-3.5rem)] overflow-hidden">
    <SettingsNavSidebar
      :items="navItems"
      :active-id="activeSection"
      :completed-count="completedCount"
      :total-count="navItems.length"
      :progress-percent="progressPercent"
      @select="activeSection = $event"
    />

    <div class="flex-1 overflow-y-auto">
      <div class="max-w-[640px] mx-auto px-8 py-8">
        <SettingsCompanyPanel
          v-if="activeSection === 'company'"
          v-model:company="company"
          v-model:branches="branches"
          @new-branch="openNewBranchModal"
          @remove-branch="removeBranch"
          @save="onSaveCompany"
        />

        <SettingsPreferencesPanel
          v-else-if="activeSection === 'preferences'"
        />

        <SettingsPlaceholderPanel
          v-else
          :title="t(`settings.nav.${activeSection}`)"
          :description="t('settings.placeholderDescription')"
        />
      </div>
    </div>

    <SettingsBranchModal
      v-model:open="branchModalOpen"
      v-model:form="branchForm"
      @save="saveBranch"
    />
  </div>
</template>
