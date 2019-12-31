<template>
  <hero>
    <router-view />
  </hero>
</template>

<script>
import Hero from '../components/Hero'

export default {
  name: 'ExamplesPage',

  components: {
    Hero
  }
}
</script>
