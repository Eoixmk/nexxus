import type {
  BranchFormState,
  CompanyBranch,
  CompanyFormState,
  SettingsNavItem,
  SettingsSectionId,
} from '~/features/settings/types/settings.types'
import { BRANCH_COLORS } from '~/features/settings/types/settings.types'

function createEmptyBranchForm(): BranchFormState {
  return {
    name: '',
    color: BRANCH_COLORS[0],
    isPrimary: false,
    addressOpen: false,
    rfcOpen: false,
    hasOwnRfc: false,
    address: {
      street: '',
      neighborhood: '',
      city: '',
      state: '',
      zip: '',
      phone: '',
      email: '',
    },
  }
}

/**
 * Estado mock de configuración master.
 * TODO: reemplazar por API cuando el backend esté listo.
 */
export function useSettingsMock() {
  const activeSection = ref<SettingsSectionId>('company')

  const navItems: SettingsNavItem[] = [
    { id: 'company', labelKey: 'settings.nav.company', icon: 'i-lucide-building-2', completed: true },
    { id: 'users', labelKey: 'settings.nav.users', icon: 'i-lucide-users', completed: true },
    { id: 'permissions', labelKey: 'settings.nav.permissions', icon: 'i-lucide-shield-check', completed: true },
    { id: 'modules', labelKey: 'settings.nav.modules', icon: 'i-lucide-grid-3x3', completed: true },
    { id: 'positions', labelKey: 'settings.nav.positions', icon: 'i-lucide-briefcase', completed: true },
    { id: 'preferences', labelKey: 'settings.nav.preferences', icon: 'i-lucide-settings', completed: true },
    { id: 'audit', labelKey: 'settings.nav.audit', icon: 'i-lucide-clipboard-list', completed: true },
    { id: 'tour', labelKey: 'settings.nav.tour', icon: 'i-lucide-map', completed: false },
  ]

  const completedCount = computed(() => navItems.filter(item => item.completed).length)
  const progressPercent = computed(() => Math.round((completedCount.value / navItems.length) * 100))

  const company = ref<CompanyFormState>({
    tradeName: 'Aeto Group SA de CV',
    rfc: 'AGR240115ABC',
    taxRegime: '601 - General de Ley Personas Morales',
    legalName: 'Aeto Group Sociedad Anónima de Capital Variable',
    address: 'Av. Constitución 1500, Monterrey, NL',
    phone: '+52 81 8000 1234',
  })

  const branches = ref<CompanyBranch[]>([
    {
      id: '1',
      name: 'Sucursal Guadalajara',
      color: '#4c6ef5',
      isPrimary: true,
      locationLabel: 'Guadalajara, Jalisco',
      userCount: 4,
      hasOwnRfc: false,
    },
    {
      id: '2',
      name: 'Sucursal Monterrey',
      color: '#28ceab',
      isPrimary: false,
      locationLabel: 'Monterrey, Nuevo León',
      userCount: 2,
      hasOwnRfc: false,
    },
    {
      id: '3',
      name: 'Sucursal CDMX',
      color: '#f59e0b',
      isPrimary: false,
      locationLabel: 'Ciudad de México, CDMX',
      userCount: 1,
      hasOwnRfc: false,
    },
  ])

  const branchModalOpen = ref(false)
  const branchForm = ref<BranchFormState>(createEmptyBranchForm())

  function openNewBranchModal() {
    branchForm.value = createEmptyBranchForm()
    branchModalOpen.value = true
  }

  function closeBranchModal() {
    branchModalOpen.value = false
  }

  function saveBranch() {
    const name = branchForm.value.name.trim()
    if (!name) {
      return
    }

    if (branchForm.value.isPrimary) {
      for (const branch of branches.value) {
        branch.isPrimary = false
      }
    }

    const city = branchForm.value.address.city.trim()
    const state = branchForm.value.address.state.trim()
    const locationLabel = [city, state].filter(Boolean).join(', ')
      || '—'

    branches.value.push({
      id: String(Date.now()),
      name,
      color: branchForm.value.color,
      isPrimary: branchForm.value.isPrimary,
      locationLabel,
      userCount: 0,
      hasOwnRfc: branchForm.value.hasOwnRfc,
      address: { ...branchForm.value.address },
    })

    branchModalOpen.value = false
  }

  function removeBranch(id: string) {
    branches.value = branches.value.filter(branch => branch.id !== id)
  }

  return {
    activeSection,
    navItems,
    completedCount,
    progressPercent,
    company,
    branches,
    branchModalOpen,
    branchForm,
    openNewBranchModal,
    closeBranchModal,
    saveBranch,
    removeBranch,
  }
}
