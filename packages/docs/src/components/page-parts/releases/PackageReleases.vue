<template>
  <div>
    <q-input
      v-model="search"
      dense
      square
      borderless
      color="white"
      placeholder="Search..."
      clearable
      class="release__search"
    >
      <template #prepend>
        <q-icon :name="mdiMagnify" />
      </template>
    </q-input>
    <q-separator />
    <div v-if="$q.screen.lt.sm" class="release__mobile">
      <q-select
        v-model="selectedVersion"
        :options="releaseOptions"
        emit-value
        map-options
        dense
        outlined
        options-dense
        color="primary"
        class="release__mobile-select"
      />
      <div class="q-pa-md release__body release__mobile-body" v-html="currentReleaseBody" />
    </div>
    <q-splitter
      v-else
      :model-value="releaseListWidth"
      unit="px"
      :limits="releaseListLimits"
      :style="releaseListStyle"
      class="release__splitter"
    >
      <template #before>
        <q-scroll-area>
          <q-tabs
            v-model="selectedVersion"
            vertical
            active-color="primary"
            indicator-color="primary"
          >
            <q-tab
              v-for="releaseInfo in filteredReleases"
              :key="releaseInfo.label"
              :name="releaseInfo.label"
            >
              <div class="q-tab__label">{{ releaseInfo.version }}</div>
              <small class="text-grey-7">{{ releaseInfo.date }}</small>
            </q-tab>
          </q-tabs>
        </q-scroll-area>
      </template>
      <template #after>
        <q-tab-panels
          v-model="selectedVersion"
          animated
          transition-prev="slide-down"
          transition-next="slide-up"
          class="releases-container"
        >
          <q-tab-panel
            v-for="releaseInfo in filteredReleases"
            :key="releaseInfo.label"
            :name="releaseInfo.label"
            class="q-pa-none"
          >
            <q-scroll-area>
              <div class="q-pa-md release__body" v-html="currentReleaseBody" />
            </q-scroll-area>
          </q-tab-panel>
        </q-tab-panels>
      </template>
    </q-splitter>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { mdiMagnify } from '@quasar/extras/mdi-v7'
import { useQuasar } from 'quasar'

import { parseMarkdownSimple } from '../../../.q-press/components/MarkdownSimpleParser'
import sanitize from './sanitize'

export interface ReleaseInfo {
  version: string
  date: string
  body: string
  label: string
}

const props = withDefaults(
  defineProps<{
    latestVersion?: string | undefined
    releases?: ReleaseInfo[]
    repoUrl?: string
  }>(),
  {
    releases: () => [],
    repoUrl: 'https://github.com/md-plugins/md-plugins',
  },
)

const search = ref('')
const selectedVersion = ref<string | undefined>(props.latestVersion)
const $q = useQuasar()
const releaseListLimits = [120, Number.POSITIVE_INFINITY]
const releaseListWidth = computed(() => ($q.screen.lt.sm ? 136 : 200))
const releaseListStyle = computed<Record<string, string>>(() => ({
  '--release-list-width': `${releaseListWidth.value}px`,
}))

watch(
  () => props.latestVersion,
  (val) => {
    selectedVersion.value = val
  },
)

const filteredReleases = computed(() => {
  if (search.value !== '') {
    const val = search.value.toLowerCase()

    return props.releases.filter((release) => release.body.toLowerCase().includes(val))
  }

  return props.releases
})

const releaseOptions = computed(() =>
  filteredReleases.value.map((release) => ({
    label: `${release.version} (${release.date})`,
    value: release.label,
  })),
)

const currentReleaseBody = computed(() => {
  const release = props.releases.find((entry) => entry.label === selectedVersion.value)

  return release
    ? parseMarkdownSimple(release.body, {
        issueUrl: props.repoUrl,
        sanitize,
        search: search.value,
        classes: {
          blockquote: 'release__blockquote',
          codeBlock: 'markdown-code release__code',
          container: 'release__container',
          containerTitle: 'release__container-title',
          heading: 'release__heading',
          list: 'release__list',
          rule: 'release__rule',
        },
      })
    : ''
})
</script>

<style lang="scss">
.release__search {
  color: $light-text;
  background: $light-bg;
  border: 1px solid $brand-border-color-light;
  border-bottom: 0;

  .q-field__control {
    padding: 0 16px;
    background: transparent;
  }

  .q-field__native,
  .q-field__prepend,
  .q-field__append {
    color: rgba($light-text, 0.72);
  }
}

.body--dark .release__search {
  color: $dark-text;
  background: $dark-bg;
  border-color: $brand-border-color-dark;

  .q-field__control {
    background: transparent;
  }

  .q-field__native,
  .q-field__prepend,
  .q-field__append {
    color: rgba($dark-text, 0.78);
  }
}

.release__splitter {
  color: $light-text;
  background: $light-bg;
  border-color: $brand-border-color-light;

  .q-splitter__before {
    background: $light-pill;
  }

  .q-splitter__separator {
    background: rgba($brand-primary, 0.28);
  }

  .q-tabs,
  .q-tabs__content,
  .q-tab {
    width: var(--release-list-width);
    max-width: var(--release-list-width);
    min-width: 0;
    overflow: hidden;
  }

  .q-scrollarea {
    height: 600px;
  }

  .q-tab {
    color: $light-text;
    justify-content: flex-start;
    padding-left: 24px;
    text-align: left;
  }

  .q-tab__content {
    align-items: flex-start;
    max-width: calc(var(--release-list-width) - 48px);
    overflow: hidden;
  }

  .q-tab small {
    color: rgba($light-text, 0.68) !important;
  }

  .q-tab--active {
    background: rgba($primary, 0.12);
  }

  .q-tab-panels,
  .q-tab-panel {
    color: $light-text;
    background: $light-bg;
  }
}

.body--dark .release__splitter {
  color: $dark-text;
  background: $dark-bg;
  border-color: $brand-border-color-dark;

  .q-splitter__before {
    background: $dark-pill;
  }

  .q-splitter__separator {
    background: $brand-border-color-dark;
  }

  .q-tab {
    color: $dark-text;
  }

  .q-tab small {
    color: rgba($dark-text, 0.58) !important;
  }

  .q-tab--active {
    background: rgba($primary, 0.2);
  }

  .q-tab-panels,
  .q-tab-panel {
    color: $dark-text;
    background: $dark-bg;
  }
}

.release__body {
  white-space: normal;
  overflow-wrap: anywhere;
  word-break: normal;

  .release__heading {
    margin: 24px 0 16px;
    padding-bottom: 8px;
    border-bottom: 1px solid $brand-border-color-light;
    overflow-wrap: anywhere;
  }

  .release__heading:first-child {
    margin-top: 0;
  }

  .release__rule {
    height: 2px;
    margin: 28px 0;
    border: 0;
    background: $brand-border-color-light;
  }

  a.markdown-link {
    color: $brand-primary;
  }

  .markdown-token {
    color: $brand-light-codeblock-text;
    background: $brand-light-codeblock-bg;
    border: 1px solid $brand-border-color-light;
  }

  .q-markup-table {
    white-space: normal;
    color: $light-text;
    background: $light-bg;
    border-color: $brand-border-color-light;
  }
}

.release__mobile {
  color: $light-text;
  background: $light-bg;
}

.release__mobile-select {
  padding: 12px 12px 0;
}

.release__mobile-body {
  min-width: 0;
}

.body--dark .release__mobile {
  color: $dark-text;
  background: $dark-bg;
}

.body--dark .release__body {
  .release__heading {
    border-bottom-color: $brand-border-color-dark;
  }

  .release__rule {
    background: $brand-border-color-dark;
  }

  a.markdown-link {
    color: $header-btn-color--dark;
  }

  .markdown-token {
    color: $brand-dark-codeblock-text;
    background: $brand-dark-codeblock-bg;
    border-color: $brand-border-color-dark;
  }

  .q-markup-table {
    color: $dark-text;
    background: $dark-bg;
    border-color: $brand-border-color-dark;
  }
}

.release__list {
  margin: 8px 0 16px;
  padding-left: 28px;

  li {
    margin: 4px 0;
    padding-left: 4px;
  }
}

.release__blockquote {
  background: rgba($primary, 0.05);
  border: 1px solid $primary;
  padding: 4px 8px;
  border-radius: $generic-border-radius;
}

.release__container {
  margin: 16px 0;
  padding: 12px 14px;
  color: $light-text;
  background: rgba($primary, 0.06);
  border: 1px solid rgba($primary, 0.24);
  border-left: 4px solid $primary;
  border-radius: $generic-border-radius;
}

.body--dark .release__container {
  color: $dark-text;
  background: rgba($primary, 0.16);
  border-color: rgba($primary, 0.4);
  border-left-color: $primary;
}

.release__container-title {
  margin-bottom: 8px;
  font-weight: 700;
}

.release__code {
  display: block;
  white-space: pre;
  overflow-x: auto;
  color: $brand-light-codeblock-text;
  background: $brand-light-codeblock-bg;
  border: 1px solid $brand-border-color-light;
  border-radius: $generic-border-radius;
  padding: 12px;
  margin: 12px 0 16px;

  code {
    display: block;
    padding: 0;
    color: inherit;
    background: transparent;
    border: 0;
    font: inherit;
  }
}

.body--dark .release__code {
  color: $brand-dark-codeblock-text;
  background: $brand-dark-codeblock-bg;
  border-color: $brand-border-color-dark;
}
</style>
