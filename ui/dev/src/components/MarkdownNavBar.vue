<template>
  <div class="markdown-nav-bar shadow-10">
    <div class="markdown-nav-bar__title ellipsis">
      <span class="ellipsis">{{ title }}</span>
    </div>
    <div v-if="nav && nav.length > 0" class="markdown-nav-bar__inner" :style="innerStyle">
      <q-btn
        v-if="leftNav"
        :to="leftNav.path"
        :label="leftNav.name"
        :icon="biCaretLeft"
        flat
        rounded
        no-caps
        class="ellipsis"
      />
      <q-btn
        v-if="rightNav"
        :to="rightNav.path"
        :label="rightNav.name"
        :icon-right="biCaretRight"
        flat
        rounded
        no-caps
        class="ellipsis"
      />
    </div>
  </div>
</template>

<script>
import { defineComponent, computed } from 'vue'
import { biCaretLeft, biCaretRight } from '@quasar/extras/bootstrap-icons'

export default defineComponent({
  name: 'MarkdownNavBar',
  props: {
    title: String,
    nav: Object
  },
  setup (props) {
    const leftNav = computed(() => {
      let nv = null
      props.nav.forEach(item => {
        if (item.dir === 'left') {
          nv = item
        }
      })
      return nv
    })

    const rightNav = computed(() => {
      let nv = ''
      props.nav.forEach(item => {
        if (item.dir === 'right') {
          nv = item
        }
      })
      return nv
    })

    const innerStyle = computed(() => {
      if (leftNav.value && rightNav.value) {
        return 'justify-content: space-between;'
      }
      else if (leftNav.value && !rightNav.value) {
        return 'justify-content: flex-start;'
      }
      else if (!leftNav.value && rightNav.value) {
        return 'justify-content: flex-end;'
      }
      return ''
    })

    return {
      leftNav,
      rightNav,
      innerStyle,
      biCaretLeft,
      biCaretRight
    }
  }
})
</script>

<style lang="sass" scoped>
.markdown-nav-bar
  display: flex
  flex-direction: column
  width: 100%
  min-height: 80px
  padding: 6px
  background: #0d47a1
  color: #bbdefb
  border-radius: 0 0 6px 6px
  // overflow: hidden

  &__title
    display: flex
    flex-direction: row
    flex-wrap: nowrap
    justify-content: center
    font-size: 2.4em

  &__inner
    display: flex
    flex-direction: row
    flex-wrap: nowrap
    align-items: center
</style>
