<template>
  <div class="relative-position markdown-copybtn-hover">
    <pre class="markdown-code" :class="block.className" :style="[style, block.style]"><code v-html="block.code"></code></pre>
    <MarkdownCopyButton />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

import MarkdownCopyButton from './MarkdownCopyButton.vue'
import { highlightCode, parseHighlightedBlock } from './MarkdownCodeHighlighter'

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

const block = computed(() => {
  return parseHighlightedBlock(highlightCode(props.code, props.lang))
})
</script>
