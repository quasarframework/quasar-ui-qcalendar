<template>
  <hero>
    <q-markdown :src="markdown" toc @data="onToc" />
  </hero>
</template>

<style>
</style>

<script>
import Hero from '../components/Hero'
import markdown from '../markdown/calendar.md'

export default {
  name: 'PageIndex',

  components: {
    Hero
  },

  data () {
    return {
      markdown: markdown
    }
  },

  computed: {
    toc:
    {
      get () {
        return this.$store.state.common.toc
      },
      set (toc) {
        console.log('toc:', toc)
        this.$store.commit('common/toc', toc)
      }
    }
  },

  methods: {
    onToc (toc) {
      this.toc = toc
    }
  }
}
</script>
