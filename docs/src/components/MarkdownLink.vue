<template>
  <router-link
    v-if="internal"
    tag="a"
    :to="to"
    class="markdown-link"
  ><slot></slot></router-link>
  <a
    v-else
    :href="to"
    target="_blank"
    rel="noopener"
    class="markdown-link"
  >
    <slot></slot>
    <q-icon :name="mdiLaunch" />
  </a>
</template>

<script>
import { computed } from 'vue'
import { mdiLaunch } from '@quasar/extras/mdi-v6'

export default {
  name: 'MarkdownLink',

  props: {
    to: String
  },

  setup (props) {
    return {
      mdiLaunch,
      internal: computed(() => props.to.charAt(0) === '/')
    }
  }
}
</script>

<style lang="sass">
.markdown-link
  color: $primary
  font-weight: 500
  text-decoration: none
  outline: 0
  border-bottom: 1px dotted currentColor
  vertical-align: center
  transition: opacity .2s
  white-space: nowrap

  &:hover
    opacity: .8

  .q-icon
    margin-top: -3px
    margin-left: 4px
</style>
