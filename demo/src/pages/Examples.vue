<template>
  <hero>
    <router-view />
  </hero>
</template>

<script>
import { defineComponent } from 'vue'
import Hero from '../components/Hero'

export default defineComponent({
  name: 'ExamplesPage',

  components: {
    Hero
  }
})
</script>
