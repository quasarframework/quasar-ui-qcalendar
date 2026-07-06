<template>
  <q-drawer
    id="toc-drawer"
    v-model="markdownStore.tocDrawer"
    side="right"
    class="markdown-drawer"
    behavior="mobile"
    aria-labelledby="toc-drawer-title"
    role="navigation"
  >
    <div class="markdown-drawer__header row justify-end no-wrap q-pt-sm q-pb-md q-px-sm">
      <q-btn
        :icon="mdiClose"
        round
        dense
        flat
        color="brand-accent"
        @click="markdownStore.toggleTocDrawer"
      />
    </div>

    <div id="toc-drawer-title" class="markdown-drawer__title q-px-md text-weight-bold">
      On this page
    </div>
    <MarkdownPageToc class="q-pt-sm q-px-md q-pb-lg" />
  </q-drawer>
</template>

<script setup lang="ts">
import { mdiClose } from '@quasar/extras/mdi-v7'

import { useMarkdownStore } from '@/.q-press/stores/markdown'

import MarkdownPageToc from './MarkdownPageToc.vue'

const markdownStore = useMarkdownStore()
</script>
