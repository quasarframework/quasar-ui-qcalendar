<template>
  <hero>
    <router-view />
    <!-- <old-examples /> -->
  </hero>
</template>

<script>
import Hero from '../components/Hero'
// import OldExamples from './Examples-old'

export default {
  name: 'ExamplesPage',

  components: {
    Hero
    // OldExamples
  }
}
</script>
