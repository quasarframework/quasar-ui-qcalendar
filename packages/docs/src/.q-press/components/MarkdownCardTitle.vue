<template>
  <div :id="id" class="markdown-card-title q-my-xs q-mr-sm cursor-pointer" @click="onClick">
    {{ props.title }}
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { copyHeading, slugify } from './markdown-utils'

const props = defineProps({
  title: {
    type: String,
    required: true,
  },
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
