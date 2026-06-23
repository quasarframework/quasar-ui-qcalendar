<template>
  <transition name="qpress-consent">
    <section
      v-if="isVisible"
      class="qpress-consent markdown-brand"
      role="region"
      :aria-label="title"
    >
      <div class="qpress-consent__content">
        <p class="qpress-consent__title">{{ title }}</p>
        <p class="qpress-consent__message">{{ config?.message }}</p>
        <MarkdownLink
          v-if="config?.policyLink"
          class="qpress-consent__policy"
          :to="config.policyLink"
        >
          {{ policyLabel }}
        </MarkdownLink>

        <div v-if="showCustomize === true" class="qpress-consent__categories">
          <div v-for="category in categories" :key="category.id" class="qpress-consent__category">
            <q-toggle
              v-model="selectedCategories[category.id]"
              dense
              :disable="category.required === true"
              :label="category.label"
              :aria-label="`${category.label} consent category`"
            />
            <p v-if="category.description" class="qpress-consent__category-description">
              {{ category.description }}
            </p>
          </div>
        </div>
      </div>

      <div class="qpress-consent__actions">
        <q-btn
          v-if="isConsentMode"
          class="qpress-consent__button qpress-consent__button--ghost"
          flat
          no-caps
          :label="rejectLabel"
          @click="rejectOptional"
        />
        <q-btn
          v-if="isConsentMode && categories.length > 0"
          class="qpress-consent__button qpress-consent__button--ghost"
          flat
          no-caps
          :label="customizeLabel"
          @click="showCustomize = !showCustomize"
        />
        <q-btn
          class="qpress-consent__button qpress-consent__button--primary"
          unelevated
          no-caps
          :label="primaryLabel"
          @click="savePrimaryChoice"
        />
      </div>
    </section>
  </transition>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref, watch } from 'vue'
import MarkdownLink from '../components/MarkdownLink.vue'
import type { PrivacyConsentConfig } from '../types/config'

interface StoredPrivacyConsent {
  id: string
  accepted: boolean
  categories: Record<string, boolean>
  savedAt: string
  expiresAt?: string | undefined
}

const props = defineProps<{
  /**
   * Privacy consent settings from `siteConfig.privacyConsent`.
   *
   * @category content
   */
  config?: PrivacyConsentConfig | undefined
}>()

const ready = ref(false)
const storedConsent = ref<StoredPrivacyConsent | null>(null)
const showCustomize = ref(false)
const selectedCategories = reactive<Record<string, boolean>>({})

const resolvedId = computed(() => props.config?.id ?? 'default')
const storageKey = computed(
  () => props.config?.storageKey ?? `qpress:privacy-consent:${resolvedId.value}`,
)
const title = computed(() => props.config?.title ?? 'Privacy preferences')
const policyLabel = computed(() => props.config?.policyLabel ?? 'Privacy policy')
const categories = computed(() => props.config?.categories ?? [])
const isConsentMode = computed(() => (props.config?.mode ?? 'notice') === 'consent')
const rejectLabel = computed(() => props.config?.rejectLabel ?? 'Reject optional')
const customizeLabel = computed(() => props.config?.customizeLabel ?? 'Customize')
const acceptLabel = computed(() => props.config?.acceptLabel ?? 'Accept all')
const saveLabel = computed(() => props.config?.saveLabel ?? 'Save preferences')
const noticeLabel = computed(() => props.config?.noticeLabel ?? 'Got it')
const primaryLabel = computed(() => {
  if (isConsentMode.value === false) {
    return noticeLabel.value
  }

  return showCustomize.value === true ? saveLabel.value : acceptLabel.value
})
const isVisible = computed(
  () =>
    ready.value === true &&
    props.config?.enabled === true &&
    typeof props.config.message === 'string' &&
    props.config.message.trim().length > 0 &&
    storedConsent.value === null,
)

/** Seeds category state so required categories are always on. */
function resetSelectedCategories(value = false): void {
  for (const category of categories.value) {
    selectedCategories[category.id] = category.required === true ? true : value
  }
}

/** Returns whether an existing consent record is still valid for this site config id. */
function isStoredConsentCurrent(consent: StoredPrivacyConsent): boolean {
  if (consent.id !== resolvedId.value) {
    return false
  }

  if (consent.expiresAt === undefined) {
    return true
  }

  return Date.parse(consent.expiresAt) > Date.now()
}

/** Reads stored consent defensively because localStorage can throw in private modes. */
function readStoredConsent(): StoredPrivacyConsent | null {
  try {
    const raw = window.localStorage.getItem(storageKey.value)

    if (raw === null) {
      return null
    }

    const parsed = JSON.parse(raw) as StoredPrivacyConsent

    return isStoredConsentCurrent(parsed) === true ? parsed : null
  } catch {
    return null
  }
}

/**
 * Browser CustomEvent dispatched on window after a saved privacy choice is read or written.
 *
 * @event qpress:privacy-consent
 * @param detail Stored consent id, accepted flag, category choices, savedAt, and optional expiresAt values.
 */
function emitConsent(detail: StoredPrivacyConsent): void {
  window.dispatchEvent(new CustomEvent('qpress:privacy-consent', { detail }))
}

/** Persists and broadcasts a consent choice. */
function saveConsent(accepted: boolean, categoryValues: Record<string, boolean>): void {
  const now = new Date()
  const expirationDays = props.config?.expirationDays
  const consent: StoredPrivacyConsent = {
    id: resolvedId.value,
    accepted,
    categories: categoryValues,
    savedAt: now.toISOString(),
  }

  if (typeof expirationDays === 'number' && expirationDays > 0) {
    consent.expiresAt = new Date(now.getTime() + expirationDays * 86_400_000).toISOString()
  }

  storedConsent.value = consent

  try {
    window.localStorage.setItem(storageKey.value, JSON.stringify(consent))
  } catch {
    // Keep the current page calm even when storage is unavailable.
  }

  emitConsent(consent)
}

/**
 * Stores the acknowledgement or accept-all choice.
 *
 * @api
 */
function savePrimaryChoice(): void {
  const categoryValues: Record<string, boolean> = {}

  for (const category of categories.value) {
    categoryValues[category.id] =
      showCustomize.value === true ? selectedCategories[category.id] === true : true
  }

  saveConsent(true, categoryValues)
}

/**
 * Stores required categories only and rejects optional categories.
 *
 * @api
 */
function rejectOptional(): void {
  const categoryValues: Record<string, boolean> = {}

  for (const category of categories.value) {
    categoryValues[category.id] = category.required === true
  }

  saveConsent(false, categoryValues)
}

/** Refreshes the component when the site changes ids or storage keys. */
function syncStoredConsent(): void {
  resetSelectedCategories(false)
  storedConsent.value = readStoredConsent()

  if (storedConsent.value !== null) {
    emitConsent(storedConsent.value)
  }
}

onMounted(() => {
  ready.value = true
  syncStoredConsent()
})

watch(
  () => [props.config?.id, props.config?.storageKey, props.config?.enabled],
  () => {
    if (ready.value === true) {
      syncStoredConsent()
    }
  },
)
</script>
