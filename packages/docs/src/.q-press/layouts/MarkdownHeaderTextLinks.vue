<template>
  <div class="row no-wrap items-center">
    <q-btn
      v-for="(entry, index) in props.menu"
      :key="index"
      flat
      class="header-btn markdown-header-text-links__item text-weight-bold"
      :class="`${props.mqPrefix}-${entry.mq || 'none'} ${props.navClass}`"
      :padding="entry.children ? '8px 8px 8px 16px' : '8px 12px'"
      :label="entry.name"
      no-caps
      no-wrap
      :icon-right="entry.children ? mdiMenuDown : void 0"
      :to="entry.path"
      :href="entry.external ? entry.path : void 0"
      :target="entry.external ? '_blank' : void 0"
    >
      <MarkdownHeaderMenu
        v-if="entry.children"
        :elements="entry.children"
        :mq-prefix="props.mqPrefix"
      />
    </q-btn>
  </div>
</template>

<script setup lang="ts">
import { mdiMenuDown } from '@quasar/extras/mdi-v7'
import MarkdownHeaderMenu from './MarkdownHeaderMenu'
import type { SiteMenuItem } from '../../siteConfig'

const props = defineProps({
  menu: {
    type: Array<SiteMenuItem>,
    required: true,
  },
  mqPrefix: {
    type: String,
    default: '',
  },
  navClass: {
    type: String,
    default: '',
  },
})
</script>
