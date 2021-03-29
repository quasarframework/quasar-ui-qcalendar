<template>
  <q-page padding class="row justify-center">
    <div
    v-if="$route.path !== '/' && isExample === true"
    style="width: 100%; display: flex; flex-direction: column; justify-content: center"
    >
      <div style="width: 100%; display: flex; justify-content: center;">
        <h2>{{ name }}</h2>
      </div>
      <div style="width: 100%; display: flex; justify-content: center;">
        <a
          v-if="path !== null"
          :href="path"
          target="_blank"
          class="button link"
        >View Source on Github
        </a>
      </div>
      <router-view />
    </div>
    <div
      v-else
      class="inner-page"
    >
      <router-view />
    </div>
  </q-page>
</template>

<script>
export default {
  data () {
    return {
      basePath: 'https://github.com/quick2/calendar/tree/main/dev/src/examples/',
      path: null,
      name: null
    }
  },
  computed: {
    isExample () {
      return this.$route.path.startsWith('/examples')
    }
  },
  watch: {
    '$route' () {
      this.handleRouteChange()
    }
  },
  mounted () {
    this.handleRouteChange()
  },
  methods: {
    handleRouteChange () {
      console.log(this.$route)
      if (this.isExample) {
        this.path = this.basePath + this.$route.name + '.vue'
        this.name = this.$route.name
      }
      else {
        this.path = null
        this.name = null
      }
    }
  }
}
</script>

<style lang="sass" scoped>
.inner-page
  width: 100%
  display: block
  max-width: 800px
</style>
