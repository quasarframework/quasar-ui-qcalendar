export interface AnnouncementActionConfig {
  label: string
  link: string
  external?: boolean
}

export interface AnnouncementBannerConfig {
  enabled?: boolean
  id?: string
  storageKey?: string
  startAt?: string
  endAt?: string
  message: string
  tone?: 'info' | 'success' | 'warning' | 'danger' | 'sponsor'
  action?: AnnouncementActionConfig
  dismissible?: boolean
  closeLabel?: string
  ariaLabel?: string
}

export interface PrivacyConsentCategoryConfig {
  id: string
  label: string
  description?: string
  required?: boolean
}

export interface PrivacyConsentConfig {
  enabled?: boolean
  id?: string
  storageKey?: string
  mode?: 'notice' | 'consent'
  title?: string
  message: string
  policyLink?: string
  policyLabel?: string
  acceptLabel?: string
  rejectLabel?: string
  customizeLabel?: string
  saveLabel?: string
  noticeLabel?: string
  expirationDays?: number
  categories?: PrivacyConsentCategoryConfig[]
}

export interface CampaignActionConfig {
  label: string
  link?: string
  external?: boolean
  dismissOnClick?: boolean
}

export interface CampaignTriggerConfig {
  type?: 'load' | 'delay' | 'scroll-depth' | 'exit-intent'
  delayMs?: number
  scrollDepth?: number
}

export interface CampaignFrequencyConfig {
  strategy?: 'always' | 'once' | 'session' | 'days'
  days?: number
  maxViews?: number
}

export interface CampaignConfig {
  enabled?: boolean
  id?: string
  storageKey?: string
  startAt?: string
  endAt?: string
  includeRoutes?: string[]
  excludeRoutes?: string[]
  trigger?: CampaignTriggerConfig
  frequency?: CampaignFrequencyConfig
  device?: 'all' | 'desktop' | 'mobile'
  mobileFallback?: 'none' | 'load'
  title: string
  message: string
  tone?: 'info' | 'success' | 'warning' | 'danger' | 'sponsor'
  action?: CampaignActionConfig
  dismissible?: boolean
  closeLabel?: string
  closeOnEsc?: boolean
  closeOnBackdrop?: boolean
  ariaLabel?: string
}
