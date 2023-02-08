<template>
  <div
    class="row items-center"
    style="margin-top: -20px;"
  >
    <q-avatar
      v-if="avatarSrc !== null"
      size="24px"
    >
      <img :src="avatarSrc">
    </q-avatar>
    <p class="q-ml-sm">{{ authorName }} / {{ publishedDate }}</p>
  </div>
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'ArticlesAvatar',
  props: {
    avatarSrc: {
      type: String,
      default: null
    },
    authorName: {
      type: String,
      default: 'Unknown Author'
    },
    publishedDate: {
      type: String,
      default: '¯\\_(ツ)_/¯'
    }
  }
})
</script>
