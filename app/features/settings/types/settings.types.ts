export type SettingsSectionId =
  | 'company'
  | 'users'
  | 'permissions'
  | 'modules'
  | 'positions'
  | 'preferences'
  | 'audit'
  | 'tour'

export interface SettingsNavItem {
  id: SettingsSectionId
  labelKey: string
  icon: string
  completed: boolean
}

export interface BranchAddress {
  street: string
  neighborhood: string
  city: string
  state: string
  zip: string
  phone: string
  email: string
}

export interface CompanyBranch {
  id: string
  name: string
  color: string
  isPrimary: boolean
  locationLabel: string
  userCount: number
  address?: Partial<BranchAddress>
  hasOwnRfc: boolean
}

export interface CompanyFormState {
  tradeName: string
  rfc: string
  taxRegime: string
  legalName: string
  address: string
  phone: string
}

export interface BranchFormState {
  name: string
  color: string
  isPrimary: boolean
  addressOpen: boolean
  rfcOpen: boolean
  hasOwnRfc: boolean
  address: BranchAddress
}

export const BRANCH_COLORS = [
  '#4c6ef5',
  '#28ceab',
  '#f59e0b',
  '#ef4444',
  '#8b5cf6',
  '#22c55e',
  '#0ea5e9',
  '#ec4899',
] as const

export const TAX_REGIME_OPTIONS = [
  '601 - General de Ley Personas Morales',
  '612 - Personas Físicas con Actividades Empresariales',
  '626 - Régimen Simplificado de Confianza',
] as const

export const MEXICAN_STATES = [
  'Aguascalientes',
  'Baja California',
  'Baja California Sur',
  'Campeche',
  'Chiapas',
  'Chihuahua',
  'Ciudad de México',
  'Coahuila',
  'Colima',
  'Durango',
  'Estado de México',
  'Guanajuato',
  'Guerrero',
  'Hidalgo',
  'Jalisco',
  'Michoacán',
  'Morelos',
  'Nayarit',
  'Nuevo León',
  'Oaxaca',
  'Puebla',
  'Querétaro',
  'Quintana Roo',
  'San Luis Potosí',
  'Sinaloa',
  'Sonora',
  'Tabasco',
  'Tamaulipas',
  'Tlaxcala',
  'Veracruz',
  'Yucatán',
  'Zacatecas',
] as const
