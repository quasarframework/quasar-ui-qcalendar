<template>
  <div class="markdown-page-footer__icons q-mt-md full-width row justify-center items-center q-gutter-sm">
    <a href="https://github.com/hawkeye64" target="_blank" rel="noopener"><q-icon :name="fabGithub" /></a>
    <a href="https://twitter.com/jgalbraith64" target="_blank" rel="noopener"><q-icon :name="fabTwitter" /></a>
    <a href="https://github.com/sponsors/hawkeye64" target="_blank" rel="noopener"><q-icon :name="mdiCharity" /></a>
  </div>
  <div class="full-width row justify-center items-center">
    <p class="markdown-copyright">MIT License | Copyright &copy; 2018 - {{ year }} Jeff Galbraith</p>
  </div>
</template>

<script>
// import { computed } from 'vue'
// import { mdiLaunch } from '@quasar/extras/mdi-v5'

import {
  fabGithub,
  fabTwitter
  // fabFacebook
} from '@quasar/extras/fontawesome-v5'

import {
  // mdiBlogger, mdiForum, mdiChat,
  mdiCharity
  // mdiPencil, mdiLaunch,
  // mdiChevronLeft, mdiChevronRight,
  // mdiFlash
} from '@quasar/extras/mdi-v5'

const year = (new Date()).getFullYear()

export default {
  name: 'MarkdownLink',

  props: {
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
</style>
