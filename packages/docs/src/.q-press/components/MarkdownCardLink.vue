<template>
  <a v-if="props.external" :href="props.to" target="_blank" class="card-link">
    <slot />
  </a>
  <router-link v-else :to="props.to" class="card-link">
    <slot />
  </router-link>
</template>

<script setup lang="ts">
const props = defineProps({
  to: {
    type: String,
    required: true,
  },

  external: Boolean,
})
</script>

<style lang="scss">
.card-link {
  text-decoration: none;
}
</style>
