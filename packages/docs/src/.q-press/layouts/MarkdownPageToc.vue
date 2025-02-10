<template>
  <q-list class="markdown-page__toc">
    <q-item
      v-for="tocItem in markdownStore.toc"
      :id="`toc--${tocItem.id}`"
      :key="tocItem.id"
      v-ripple
      clickable
      class="markdown-layout__item"
      active-class="markdown-layout__item--active"
      :active="markdownStore.activeToc === tocItem.id"
      @click="tocItem.onClick"
    >
      <q-item-section v-if="tocItem.sub === true" side />
      <q-item-section>{{ tocItem.title }}</q-item-section>
    </q-item>
  </q-list>
</template>

<script setup lang="ts">
import { useMarkdownStore } from '../stores/markdown'
const markdownStore = useMarkdownStore()
</script>
