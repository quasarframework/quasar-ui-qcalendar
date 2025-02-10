<template>
  <div class="markdown-header-icon-links row no-wrap items-center">
    <q-btn
      v-for="(entry, index) in props.menu"
      :key="index"
      class="header-btn"
      flat
      round
      :icon="!entry.image ? entry.icon : void 0"
      :to="entry.path"
      :color="entry.color ? entry.color : void 0"
      :href="entry.external ? entry.path : void 0"
      :target="entry.external ? '_blank' : void 0"
      :aria-label="entry.name"
    >
      <q-avatar v-if="entry.image" size="28px">
        <img :src="entry.icon" />
      </q-avatar>
    </q-btn>
  </div>
</template>

<script setup lang="ts">
interface MenuEntry {
  icon: string
  path: string
  external?: boolean
  name: string
  color?: string
  image?: boolean
}

const props = defineProps<{
  menu: MenuEntry[]
}>()
</script>
