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
  /**
   * Code string to render with syntax highlighting.
   *
   * @category content
   * @example 'const a = 1;'
   * @example '<div>Hello World</div>'
   */
  code: {
    type: String,
    required: true,
  },
  /**
   * Maximum height for the rendered code block.
   *
   * @category style
   * @example '200px'
   * @example '50vh'
   */
  maxHeight: {
    type: String,
    default: void 0,
  },

  /**
   * Language identifier used by the syntax highlighter.
   *
   * @category content
   * @example 'js'
   * @example 'html'
   * @example 'css'
   */
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
