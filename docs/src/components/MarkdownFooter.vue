<template>
  <div class="markdown-page__footer--icons q-mt-md full-width row justify-center items-center q-gutter-sm">
    <a
      href="https://github.com/hawkeye64"
      target="_blank"
      rel="noopener"
    ><q-avatar size="28px"><img src="~assets/profile.png"></q-avatar></a>
    <a
      href="https://github.com/quasarframework/quasar-ui-qcalendar/tree/next"
      target="_blank"
      rel="noopener"
    ><q-icon :name="fabGithub" /></a>
    <a
      href="https://twitter.com/jgalbraith64"
      target="_blank"
      rel="noopener"
    ><q-icon :name="fabTwitter" /></a>
    <a
      href="https://github.com/sponsors/hawkeye64"
      target="_blank"
      rel="noopener"
    ><q-icon :name="mdiCharity" /></a>
  </div>
  <div class="full-width row justify-center items-center q-my-sm">
    <p class="markdown-copyright">CC-BY / MIT License | Copyright &copy; 2018 - {{ year }} Jeff Galbraith</p>
  </div>
</template>

<script>
import {
  fabGithub,
  fabTwitter
} from '@quasar/extras/fontawesome-v5'

import {
  mdiCharity
} from '@quasar/extras/mdi-v6'

const year = (new Date()).getFullYear()

export default {
  name: 'MarkdownFooter',

  props: {
    // eslint-disable-next-line vue/require-default-prop
    to: String
  },

  setup (props) {
    return {
      year,
      fabGithub,
      fabTwitter,
      mdiCharity
    }
  }
}
</script>
<style lang="sass">
.markdown-copyright
  font-family: Consolas,Monaco,Andale Mono,Ubuntu Mono,monospace

.markdown-page__footer--icons
  font-size: 28px

  a
    text-decoration: none
    outline: 0
    color: $primary
    transition: color .28s

    &:hover
      color: $red-8

</style>
