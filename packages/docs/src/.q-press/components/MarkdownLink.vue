<template>
  <router-link v-if="internal === true" v-bind="$attrs" class="markdown-link" :to="to">
    <slot />
  </router-link>
  <a v-else v-bind="$attrs" class="markdown-link" :href="props.to" target="_blank" rel="noopener">
    <slot />
    <q-icon :name="mdiLaunch" />
  </a>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { mdiLaunch } from '@quasar/extras/mdi-v7'

const props = defineProps({
  /**
   * The target URL or path for the link.
   *
   * @category navigation
   * @example /home
   * @example https://example.com
   */
  to: {
    type: String,
    required: true,
  },
})

defineSlots<{
  /**
   * Slot for custom content inside the link.
   */
  default(): unknown
}>()
const internal = computed(
  () => props.to.charAt(0) === '/' || props.to.charAt(0) === '.' || props.to.charAt(0) === '#',
)
</script>

<style lang="scss">
.markdown-link {
  color: $brand-light-text;
  text-decoration: none;
  border-bottom: 1px dotted rgba($brand-primary, 0.78);
  outline: 0;
  transition: color $header-quick-transition;

  body.body--dark & {
    color: $brand-dark-text;
  }

  &:hover {
    color: inherit !important;
  }

  .q-icon {
    margin-top: -2px;
    margin-left: 4px;
  }
}
</style>
