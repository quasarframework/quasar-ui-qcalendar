<template>
  <div class="relative-position markdown-copybtn-hover">
    <MarkdownCodePrism :lang="props.lang" :code="props.code" :style="style" />
    <MarkdownCopyButton />
  </div>
</template>

<script setup>
import { computed } from 'vue'

import MarkdownCodePrism from './MarkdownCodePrism'
import MarkdownCopyButton from './MarkdownCopyButton.vue'

const props = defineProps({
  code: {
    type: String,
    required: true,
  },
  maxHeight: {
    type: String,
    default: void 0,
  },

  lang: {
    type: String,
    default: 'js',
  },
})

const style = computed(() => (props.maxHeight !== void 0 ? { maxHeight: props.maxHeight } : null))
</script>
