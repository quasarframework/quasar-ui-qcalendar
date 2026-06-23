<template>
  <div :id="id" class="markdown-card-title q-my-xs q-mr-sm cursor-pointer" @click="onClick">
    {{ props.title }}
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { copyHeading, slugify } from './markdown-utils'

const props = defineProps({
  /**
   * The title text to display.
   *
   * @category content
   * @example 'Introduction'
   * @example 'Chapter 1'
   */
  title: {
    type: String,
    required: true,
  },
  /**
   * Prefix to add to the slugified title.
   *
   * @category content
   * @example 'section-'
   */
  prefix: {
    type: String,
    default: '',
  },
})

const id = computed(() => (props.prefix || '') + slugify(props.title))

function onClick() {
  copyHeading(id.value)
}
</script>
