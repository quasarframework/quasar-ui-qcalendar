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
  /**
   * Target URL or route path for the card link.
   *
   * @category navigation
   * @example /home
   * @example https://example.com
   */
  to: {
    type: String,
    required: true,
  },

  /**
   * Whether the link should open as an external anchor.
   *
   * @category navigation
   */
  external: Boolean,
})

defineSlots<{
  /**
   * Slot for custom content inside the link.
   */
  default(): unknown
}>()
</script>

<style lang="scss">
.card-link {
  text-decoration: none;
}
</style>
