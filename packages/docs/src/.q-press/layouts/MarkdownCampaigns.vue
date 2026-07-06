<template>
  <q-dialog
    v-model="isOpen"
    :no-esc-dismiss="closeOnEsc === false"
    :no-backdrop-dismiss="closeOnBackdrop === false"
    @hide="onDialogHide"
  >
    <q-card
      v-if="activeCampaign"
      class="qpress-campaign markdown-brand"
      :class="`qpress-campaign--${tone}`"
      role="dialog"
      :aria-modal="true"
      :aria-label="activeCampaign.ariaLabel ?? activeCampaign.title"
    >
      <q-card-section class="qpress-campaign__header">
        <div>
          <p class="qpress-campaign__eyebrow">{{ toneLabel }}</p>
          <h2 class="qpress-campaign__title">{{ activeCampaign.title }}</h2>
        </div>
        <q-btn
          v-if="isDismissible"
          class="qpress-campaign__close"
          flat
          round
          dense
          :icon="mdiClose"
          :aria-label="closeLabel"
          @click="dismissCampaign"
        />
      </q-card-section>

      <q-card-section class="qpress-campaign__body">
        <p>{{ activeCampaign.message }}</p>
      </q-card-section>

      <q-card-actions class="qpress-campaign__actions" align="right">
        <q-btn
          v-if="activeCampaign.action"
          class="qpress-campaign__button qpress-campaign__button--primary"
          unelevated
          no-caps
          :href="actionHref"
          :to="actionTo"
          :target="isExternalAction ? '_blank' : undefined"
          :rel="isExternalAction ? 'noopener noreferrer' : undefined"
          :label="activeCampaign.action.label"
          @click="onActionClick"
        />
        <q-btn
          v-if="isDismissible"
          class="qpress-campaign__button qpress-campaign__button--ghost"
          flat
          no-caps
          :label="closeLabel"
          @click="dismissCampaign"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { mdiClose } from '@quasar/extras/mdi-v7'
import type { CampaignConfig } from '../types/config'

interface StoredCampaignState {
  id: string
  dismissedAt?: string
  expiresAt?: string
  views?: number
}

const props = defineProps<{
  /**
   * Opt-in campaign settings from `siteConfig.campaigns`.
   *
   * @category content
   */
  campaigns?: CampaignConfig[] | undefined
}>()

const route = useRoute()
const isOpen = ref(false)
const activeCampaign = ref<CampaignConfig | null>(null)
const armedCampaign = ref<CampaignConfig | null>(null)
const ready = ref(false)
const isMobile = ref(false)
const triggerCleanup: Array<() => void> = []

const tone = computed(() => activeCampaign.value?.tone ?? 'info')
const toneLabel = computed(() => {
  const value = tone.value

  return value === 'sponsor' ? 'Support' : value.charAt(0).toUpperCase() + value.slice(1)
})
const closeLabel = computed(() => activeCampaign.value?.closeLabel ?? 'Close')
const isDismissible = computed(() => activeCampaign.value?.dismissible !== false)
const closeOnEsc = computed(() => activeCampaign.value?.closeOnEsc !== false)
const closeOnBackdrop = computed(() => activeCampaign.value?.closeOnBackdrop !== false)
const action = computed(() => activeCampaign.value?.action)
const isExternalAction = computed(() => {
  const link = action.value?.link ?? ''

  return action.value?.external === true || /^(https?:)?\/\//.test(link)
})
const actionHref = computed(() => (isExternalAction.value === true ? action.value?.link : undefined))
const actionTo = computed(() => (isExternalAction.value === false ? action.value?.link : undefined))

/** Removes all active trigger listeners and timers. */
function clearTriggerCleanup(): void {
  while (triggerCleanup.length > 0) {
    triggerCleanup.pop()?.()
  }
}

/** Returns a stable id for storage and routing decisions. */
function getCampaignId(campaign: CampaignConfig): string {
  return campaign.id ?? 'default'
}

/** Returns the localStorage key for a campaign. */
function getStorageKey(campaign: CampaignConfig): string {
  return campaign.storageKey ?? `qpress:campaign:${getCampaignId(campaign)}`
}

/** Reads browser storage defensively because privacy modes can throw. */
function readStoredCampaign(campaign: CampaignConfig): StoredCampaignState | null {
  try {
    const raw = window.localStorage.getItem(getStorageKey(campaign))

    if (raw === null) {
      return null
    }

    return JSON.parse(raw) as StoredCampaignState
  } catch {
    return null
  }
}

/** Writes browser storage defensively because privacy modes can throw. */
function writeStoredCampaign(campaign: CampaignConfig, value: StoredCampaignState): void {
  try {
    window.localStorage.setItem(getStorageKey(campaign), JSON.stringify(value))
  } catch {
    // The current page should continue working when storage is unavailable.
  }
}

/** Returns whether the configured date window is active. */
function isWithinActiveWindow(campaign: CampaignConfig): boolean {
  const now = Date.now()
  const { startAt, endAt } = campaign

  if (typeof startAt === 'string' && Number.isNaN(Date.parse(startAt)) === false) {
    if (now < Date.parse(startAt)) {
      return false
    }
  }

  if (typeof endAt === 'string' && Number.isNaN(Date.parse(endAt)) === false) {
    if (now > Date.parse(endAt)) {
      return false
    }
  }

  return true
}

/** Matches exact route paths plus simple trailing-wildcard prefixes. */
function matchesRoutePattern(path: string, pattern: string): boolean {
  if (pattern.endsWith('*')) {
    return path.startsWith(pattern.slice(0, -1))
  }

  return path === pattern
}

/** Returns whether the campaign is allowed on the current route. */
function isRouteMatch(campaign: CampaignConfig): boolean {
  const path = route.path
  const includeRoutes = campaign.includeRoutes ?? []
  const excludeRoutes = campaign.excludeRoutes ?? []

  if (excludeRoutes.some((pattern) => matchesRoutePattern(path, pattern))) {
    return false
  }

  return includeRoutes.length === 0 || includeRoutes.some((pattern) => matchesRoutePattern(path, pattern))
}

/** Returns whether the campaign is allowed for the current viewport class. */
function isDeviceMatch(campaign: CampaignConfig): boolean {
  const device = campaign.device ?? 'all'

  if (device === 'desktop') {
    return isMobile.value === false
  }

  if (device === 'mobile') {
    return isMobile.value === true
  }

  return true
}

/** Returns whether the campaign is blocked by frequency or expiration rules. */
function isFrequencyAllowed(campaign: CampaignConfig): boolean {
  const strategy = campaign.frequency?.strategy ?? 'once'
  const id = getCampaignId(campaign)

  if (strategy === 'always') {
    return true
  }

  if (strategy === 'session') {
    try {
      return window.sessionStorage.getItem(`${getStorageKey(campaign)}:session`) !== id
    } catch {
      return true
    }
  }

  const stored = readStoredCampaign(campaign)

  if (stored?.id !== id) {
    return true
  }

  if (
    typeof campaign.frequency?.maxViews === 'number' &&
    campaign.frequency.maxViews > 0 &&
    (stored.views ?? 0) >= campaign.frequency.maxViews
  ) {
    return false
  }

  if (strategy === 'days') {
    return typeof stored.expiresAt === 'string' ? Date.parse(stored.expiresAt) <= Date.now() : true
  }

  return typeof stored.dismissedAt !== 'string'
}

/** Returns the first campaign that is eligible for this route and viewport. */
function findEligibleCampaign(): CampaignConfig | null {
  for (const campaign of props.campaigns ?? []) {
    if (
      campaign.enabled === true &&
      typeof campaign.title === 'string' &&
      typeof campaign.message === 'string' &&
      campaign.title.trim().length > 0 &&
      campaign.message.trim().length > 0 &&
      isWithinActiveWindow(campaign) === true &&
      isRouteMatch(campaign) === true &&
      isDeviceMatch(campaign) === true &&
      isFrequencyAllowed(campaign) === true
    ) {
      return campaign
    }
  }

  return null
}

/** Records a displayed campaign so maxViews can cap noisy prompts. */
function recordCampaignView(campaign: CampaignConfig): void {
  if (campaign.frequency?.strategy === 'always' && campaign.frequency.maxViews === undefined) {
    return
  }

  const id = getCampaignId(campaign)
  const stored = readStoredCampaign(campaign)
  const next: StoredCampaignState = {
    id,
    views: (stored?.views ?? 0) + 1,
  }

  if (typeof stored?.dismissedAt === 'string') {
    next.dismissedAt = stored.dismissedAt
  }

  if (typeof stored?.expiresAt === 'string') {
    next.expiresAt = stored.expiresAt
  }

  writeStoredCampaign(campaign, next)
}

/** Marks the current campaign dismissed according to its frequency strategy. */
function recordCampaignDismissal(campaign: CampaignConfig): void {
  const strategy = campaign.frequency?.strategy ?? 'once'
  const id = getCampaignId(campaign)

  if (strategy === 'always') {
    return
  }

  if (strategy === 'session') {
    try {
      window.sessionStorage.setItem(`${getStorageKey(campaign)}:session`, id)
    } catch {
      // Fall through silently for privacy modes.
    }
    return
  }

  const stored = readStoredCampaign(campaign)
  const now = new Date()
  const next: StoredCampaignState = {
    id,
    dismissedAt: now.toISOString(),
    views: stored?.views ?? 0,
  }

  if (strategy === 'days') {
    const days = campaign.frequency?.days ?? 30
    next.expiresAt = new Date(now.getTime() + days * 86_400_000).toISOString()
  }

  writeStoredCampaign(campaign, next)
}

/** Opens a campaign after its trigger fires. */
function openCampaign(campaign: CampaignConfig): void {
  if (activeCampaign.value !== null || isOpen.value === true) {
    return
  }

  if (isFrequencyAllowed(campaign) === false) {
    return
  }

  activeCampaign.value = campaign
  recordCampaignView(campaign)
  isOpen.value = true
}

/** Closes the active campaign. QDialog will record dismissal in onDialogHide. */
function closeCampaign(recordDismissal = true): void {
  if (recordDismissal === false) {
    activeCampaign.value = null
  }

  isOpen.value = false
}

/** Closes the active campaign after an intentional visitor action. */
function dismissCampaign(): void {
  closeCampaign()
}

/** Handles action clicks and keeps non-link action buttons calm by default. */
function onActionClick(): void {
  if (action.value?.dismissOnClick !== false) {
    closeCampaign()
  }
}

/** Records dismissal when the dialog closes through button, escape, or backdrop. */
function onDialogHide(): void {
  if (activeCampaign.value !== null) {
    recordCampaignDismissal(activeCampaign.value)
  }

  activeCampaign.value = null
}

/** Arms load, delay, scroll-depth, and exit-intent triggers for one campaign. */
function armTrigger(campaign: CampaignConfig): void {
  const requestedTrigger = campaign.trigger?.type ?? 'load'
  const trigger =
    requestedTrigger === 'exit-intent' && isMobile.value === true && campaign.mobileFallback === 'load'
      ? 'load'
      : requestedTrigger

  armedCampaign.value = campaign

  if (trigger === 'delay') {
    const timeoutId = window.setTimeout(() => openCampaign(campaign), campaign.trigger?.delayMs ?? 2500)
    triggerCleanup.push(() => window.clearTimeout(timeoutId))
    return
  }

  if (trigger === 'scroll-depth') {
    const depth = Math.min(Math.max(campaign.trigger?.scrollDepth ?? 50, 1), 100)
    const onScroll = (): void => {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight
      const percent = scrollable <= 0 ? 100 : (window.scrollY / scrollable) * 100

      if (percent >= depth) {
        clearTriggerCleanup()
        openCampaign(campaign)
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    triggerCleanup.push(() => window.removeEventListener('scroll', onScroll))
    onScroll()
    return
  }

  if (trigger === 'exit-intent') {
    const onMouseOut = (event: MouseEvent): void => {
      if (event.clientY <= 12 && event.relatedTarget === null) {
        clearTriggerCleanup()
        openCampaign(campaign)
      }
    }

    window.addEventListener('mouseout', onMouseOut)
    triggerCleanup.push(() => window.removeEventListener('mouseout', onMouseOut))
    return
  }

  window.requestAnimationFrame(() => openCampaign(campaign))
}

/** Re-arms campaigns after route, config, or viewport changes. */
function syncCampaigns(): void {
  clearTriggerCleanup()

  if (isOpen.value === true) {
    closeCampaign(false)
  }

  const campaign = findEligibleCampaign()

  if (campaign === null) {
    armedCampaign.value = null
    return
  }

  armTrigger(campaign)
}

/** Keeps viewport-specific campaign behavior deterministic after hydration. */
function syncViewport(): void {
  isMobile.value = window.matchMedia('(max-width: 700px)').matches
}

onMounted(() => {
  ready.value = true
  syncViewport()
  syncCampaigns()
  window.addEventListener('resize', syncViewport, { passive: true })
})

onBeforeUnmount(() => {
  clearTriggerCleanup()
  window.removeEventListener('resize', syncViewport)
})

watch(
  () => [props.campaigns, route.path, ready.value, isMobile.value],
  () => {
    if (ready.value === true) {
      syncCampaigns()
    }
  },
  { deep: true },
)
</script>
