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
import { useDark } from '../composables/dark'

const router = useRouter()
const { isDark } = useDark()
const hostRef = ref<HTMLDivElement>()
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
  searchElement.setAttribute('placeholder', 'Search MD-Plugins docs...')
  searchElement.setAttribute('trigger-label', 'Search docs')
  searchElement.setAttribute('panel-title', 'Search MD-Plugins')
  searchElement.setAttribute('search-label', 'Search MD-Plugins documentation')
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
    --md-search-accent: #{$header-btn-color--light};
    --md-search-trigger-bg: var(--qpress-action-ghost-bg);
    --md-search-trigger-border: #{$brand-border-color-light};
    --md-search-trigger-color: var(--qpress-action-ghost-text);
    --md-search-backdrop: rgb(var(--qpress-rgb-dark) / 42%);
    --md-search-surface: var(--qpress-surface-raised-strong);
    --md-search-surface-raised: var(--qpress-surface-panel);
    --md-search-result-bg: var(--qpress-surface-panel);
    --md-search-result-active-bg: color-mix(
      in srgb,
      var(--qpress-color-primary) 12%,
      var(--qpress-surface-raised-strong)
    );
    --md-search-result-active-border: #{$brand-border-color-light};
    --md-search-text: var(--qpress-text-primary);
    --md-search-muted: var(--qpress-text-muted);
    --md-search-border: #{$brand-border-color-light};
    --md-search-highlight: var(--qpress-color-primary);
    --md-search-highlight-bg: color-mix(in srgb, var(--qpress-color-primary) 14%, transparent);
    --md-search-pill-bg: var(--qpress-chip-bg);
    --md-search-pill-border: var(--qpress-pill-border);
    --md-search-radius: 18px;
  }

  &--dark {
    :deep(md-search) {
      --md-search-accent: #{$header-btn-color--dark};
      --md-search-highlight: #{$header-btn-color--dark};
      --md-search-highlight-bg: color-mix(in srgb, #{$header-btn-color--dark} 18%, transparent);
      --md-search-backdrop: rgb(0 0 0 / 64%);
      --md-search-trigger-border: #{$brand-border-color-dark};
      --md-search-border: #{$brand-border-color-dark};
      --md-search-surface: var(--qpress-surface-raised-strong);
      --md-search-surface-raised: var(--qpress-surface-panel);
      --md-search-result-bg: var(--qpress-surface-panel);
      --md-search-result-active-bg: color-mix(
        in srgb,
        var(--qpress-color-primary) 22%,
        var(--qpress-surface-raised-strong)
      );
      --md-search-result-active-border: #{$brand-border-color-dark};
    }
  }
}

@media (max-width: 1059px) {
  .markdown-search-host {
    min-width: auto;
  }
}
</style>
