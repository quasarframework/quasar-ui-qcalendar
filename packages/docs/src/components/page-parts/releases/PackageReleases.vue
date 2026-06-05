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
      class="q-mx-md"
    >
      <template #prepend>
        <q-icon :name="mdiMagnify" />
      </template>
    </q-input>
    <q-separator />
    <q-splitter :model-value="20" :limits="[14, 90]" class="release__splitter">
      <template #before>
        <q-scroll-area>
          <q-tabs
            v-model="selectedVersion"
            vertical
            active-color="primary"
            active-bg-color="blue-1"
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
              <div class="q-pa-md" v-html="currentReleaseBody" />
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

import sanitize from './sanitize'
import parseMdTable from './md-table-parser'

export interface ReleaseInfo {
  version: string
  date: string
  body: string
  label: string
}

const props = withDefaults(
  defineProps<{
    latestVersion?: string
    releases?: ReleaseInfo[]
  }>(),
  {
    releases: () => [],
  },
)

const search = ref('')
const selectedVersion = ref<string | undefined>(props.latestVersion)

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

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function escapeHtmlAttribute(value: string): string {
  return value.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;')
}

function createExternalLink(href: string, label: string): string {
  if (!/^https?:\/\//.test(href)) {
    return label
  }

  return `<a class="markdown-link" href="${escapeHtmlAttribute(href)}" target="_blank" rel="noopener noreferrer">${label}</a>`
}

function autoLinkBareUrls(content: string): string {
  return content
    .split(/(<a\b[^>]*>.*?<\/a>|<pre\b[^>]*>.*?<\/pre>|<code\b[^>]*>.*?<\/code>)/gis)
    .map((part) => {
      if (/^<(?:a|pre|code)\b/i.test(part)) {
        return part
      }

      return part.replace(
        /(^|[\s>])((?:https?:\/\/)[^\s<]+?)([),.;:!?]*)(?=$|\s|<)/g,
        (_match, prefix: string, url: string, trailing: string) =>
          `${prefix}${createExternalLink(url, url)}${trailing}`,
      )
    })
    .join('')
}

function parse(body: string): string {
  let content = sanitize(body) + '\n'

  if (search.value !== '') {
    content = content.replace(
      new RegExp(`(${escapeRegExp(search.value)})`, 'gi'),
      '<span class="bg-accent text-white">$1</span>',
    )
  }

  content = content
    .replace(/### ([\S ]+)/g, '<div class="text-h6">$1</div>')
    .replace(/## ([\S ]+)/g, '<div class="text-h5">$1</div>')
    .replace(/# ([\S ]+)/g, '<div class="text-h4">$1</div>')
    .replace(/\*\*([\S ]*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*([\S ]*?)\*/g, '<em>$1</em>')
    .replace(
      /```([\S]+)/g,
      '<code class="markdown--code__inner markdown--code__inner--prerendered release__code">',
    )
    .replace(/```\n/g, '</code>')
    .replace(/`(.*?)`/g, '<code class="markdown--token">$1</code>')
    .replace(
      /#([\d]+)/g,
      createExternalLink('https://github.com/quasarframework/quasar-ui-qcalendar/issues/$1', '#$1'),
    )
    .replace(/^&gt; ([\S ]+)$/gm, '<div class="release__blockquote">$1</div>')
    .replace(/\[([\S ]*?)\]\((\S*?)\)/g, (_match, label: string, href: string) =>
      createExternalLink(href, label),
    )
    .replace(/^ {2}[-*] ([^\n]+)$/gm, '<li class="q-pl-md">$1</li>')
    .replace(/^[-*] ([^\n]+)$/gm, '<li>$1</li>')
    .replace(/<\/li>[\s\n\r]*<li/g, '</li><li')
    .replace(/(<li(?: class="[^"]*")?>.*?<\/li>)+/g, '<ul class="release__list">$&</ul>')
    .replace(/\n/g, '<br>')

  content = autoLinkBareUrls(content)

  return content.includes('| -') ? parseMdTable(content) : content
}

const currentReleaseBody = computed(() => {
  const release = props.releases.find((entry) => entry.label === selectedVersion.value)

  return release ? parse(release.body) : ''
})
</script>

<style lang="scss">
.release__splitter .q-scrollarea {
  height: 600px;
}

.release__body {
  white-space: pre-line;

  .q-markup-table {
    white-space: normal;
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

.release__code {
  padding: 4px;
  margin: 8px;
}
</style>
