<template>
  <div
    v-if="isVisible"
    class="qpress-announcement"
    :class="`qpress-announcement--${tone}`"
    role="status"
    :aria-label="ariaLabel"
  >
    <div class="qpress-announcement__inner markdown-brand">
      <div class="qpress-announcement__message">
        <span class="qpress-announcement__marker" aria-hidden="true" />
        <span>{{ config?.message }}</span>
      </div>

      <div class="qpress-announcement__actions">
        <q-btn
          v-if="config?.action"
          class="qpress-announcement__action"
          dense
          no-caps
          unelevated
          :href="isExternalAction ? config.action.link : undefined"
          :target="isExternalAction ? '_blank' : undefined"
          :rel="isExternalAction ? 'noopener noreferrer' : undefined"
          :to="isExternalAction ? undefined : config.action.link"
          :label="config.action.label"
        />
        <q-btn
          v-if="isDismissible"
          class="qpress-announcement__close"
          flat
          round
          dense
          :icon="mdiClose"
          :aria-label="closeLabel"
          @click="dismiss"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { mdiClose } from '@quasar/extras/mdi-v7'
import type { AnnouncementBannerConfig } from '../types/config'

const props = defineProps<{
  /**
   * Announcement settings from `siteConfig.announcement`.
   *
   * @category content
   */
  config?: AnnouncementBannerConfig | undefined
}>()

const ready = ref(false)
const dismissed = ref(false)

const resolvedId = computed(() => props.config?.id ?? 'default')
const storageKey = computed(
  () => props.config?.storageKey ?? `qpress:announcement:${resolvedId.value}`,
)
const tone = computed(() => props.config?.tone ?? 'info')
const closeLabel = computed(() => props.config?.closeLabel ?? 'Dismiss announcement')
const ariaLabel = computed(() => props.config?.ariaLabel ?? 'Site announcement')
const isDismissible = computed(() => props.config?.dismissible !== false)
const isExternalAction = computed(() => {
  const action = props.config?.action

  return action?.external === true || /^(https?:)?\/\//.test(action?.link ?? '')
})
const isWithinActiveWindow = computed(() => {
  const now = Date.now()
  const startAt = props.config?.startAt
  const endAt = props.config?.endAt

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
})
const isVisible = computed(
  () =>
    ready.value === true &&
    props.config?.enabled === true &&
    typeof props.config.message === 'string' &&
    props.config.message.trim().length > 0 &&
    dismissed.value === false &&
    isWithinActiveWindow.value === true,
)

/** Reads browser storage defensively because private modes can throw. */
function getStoredDismissal(): string | null {
  try {
    return window.localStorage.getItem(storageKey.value)
  } catch {
    return null
  }
}

/** Recomputes whether the current announcement id has already been dismissed. */
function syncDismissedState(): void {
  dismissed.value = getStoredDismissal() === resolvedId.value
}

/** Persists the current announcement id so it stays hidden until the site changes ids. */
function dismiss(): void {
  dismissed.value = true

  try {
    window.localStorage.setItem(storageKey.value, resolvedId.value)
  } catch {
    // Storage can be unavailable in privacy modes. Dismiss for this session either way.
  }
}

onMounted(() => {
  ready.value = true
  syncDismissedState()
})

watch(
  () => [props.config?.id, props.config?.storageKey, props.config?.enabled],
  () => {
    if (ready.value === true) {
      syncDismissedState()
    }
  },
)
</script>
