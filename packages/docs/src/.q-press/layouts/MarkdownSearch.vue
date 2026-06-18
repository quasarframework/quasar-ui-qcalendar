<template>
  <div
    ref="hostRef"
    class="markdown-search-host"
    :class="{ 'markdown-search-host--dark': isDark }"
  />
</template>

<script setup lang="ts">
import type { MdSearchElement, MdSearchSelectEventDetail } from '@md-plugins/search-ui'
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import siteConfig from '../../siteConfig'
import { useDark } from '../composables/dark'

const router = useRouter()
const { isDark } = useDark()
const hostRef = ref<HTMLDivElement>()
const searchTitle = siteConfig.title || 'Documentation'
let searchElement: MdSearchElement | undefined
let unmounted = false

function withBase(path: string): string {
  const base = import.meta.env.BASE_URL || '/'
  return `${base.replace(/\/$/, '')}/${path.replace(/^\//, '')}`.replace(/\/{2,}/g, '/')
}

function toRouterTarget(url: string): string {
  const parsedUrl = new URL(url, window.location.origin)

  if (parsedUrl.origin !== window.location.origin) {
    return url
  }

  return `${parsedUrl.pathname}${parsedUrl.search}${parsedUrl.hash}`
}

function onSearchSelect(event: Event): void {
  const customEvent = event as CustomEvent<MdSearchSelectEventDetail>
  customEvent.preventDefault()
  searchElement?.close()
  void router.push(toRouterTarget(customEvent.detail.result.url))
}

onMounted(async () => {
  const { defineMdSearchElement } = await import('@md-plugins/search-ui')

  if (unmounted || hostRef.value === undefined) {
    return
  }

  defineMdSearchElement()

  searchElement = document.createElement('md-search') as MdSearchElement
  searchElement.setAttribute('src', withBase('search/search-index.json'))
  searchElement.setAttribute('placeholder', `Search ${searchTitle} docs...`)
  searchElement.setAttribute('trigger-label', 'Search docs')
  searchElement.setAttribute('panel-title', `Search ${searchTitle}`)
  searchElement.setAttribute('search-label', `Search ${searchTitle} documentation`)
  searchElement.setAttribute('theme', isDark.value === true ? 'dark' : 'light')
  searchElement.setAttribute('max-results', '15')
  searchElement.addEventListener('md-search-select', onSearchSelect)

  hostRef.value?.append(searchElement)
})

onBeforeUnmount(() => {
  unmounted = true
  searchElement?.removeEventListener('md-search-select', onSearchSelect)
  searchElement?.remove()
  searchElement = undefined
})

watch(isDark, (value) => {
  searchElement?.setAttribute('theme', value === true ? 'dark' : 'light')
})
</script>

<style lang="scss" scoped>
.markdown-search-host {
  display: inline-flex;
  align-items: center;
  min-width: min(330px, 28vw);

  :deep(md-search) {
    width: 100%;
    --md-search-accent: var(--qpress-color-primary);
    --md-search-trigger-bg: var(--qpress-action-ghost-bg);
    --md-search-trigger-border: var(--qpress-border-strong);
    --md-search-trigger-color: var(--qpress-action-ghost-text);
    --md-search-surface: #ffffff;
    --md-search-surface-raised: #f6f8fb;
    --md-search-result-bg: #f8fafc;
    --md-search-result-active-bg: #eef4ff;
    --md-search-text: var(--qpress-text-primary);
    --md-search-muted: var(--qpress-text-muted);
    --md-search-border: var(--qpress-border-strong);
    --md-search-radius: 18px;
  }

  &--dark {
    :deep(md-search) {
      --md-search-backdrop: rgb(0 0 0 / 64%);
      --md-search-surface: #111827;
      --md-search-surface-raised: #1f2937;
      --md-search-result-bg: #0b1220;
      --md-search-result-active-bg: #241522;
    }
  }
}

@media (max-width: 1059px) {
  .markdown-search-host {
    min-width: auto;
  }
}
</style>
