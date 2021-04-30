<template>
  <div :class="'q-markdown ' + (path !== '/' ? ($q.platform.is.mobile ? '' : 'q-mx-xl') : '')">
    <markdown-nav-bar
      v-if="path !== '/' && nav && nav.length > 0"
      :title="title"
      :nav="nav"
    />

    <slot></slot>

    <div class="markdown-page-footer">
      <q-separator class="q-mb-lg" />
      <div v-if="path && noEdit !== true">
        <div class="full-width row justify-center items-center">
          Found an error on this page or feel it could be improved?
          <markdown-link
            :to="'https://github.com/quasarframework/quasar-ui-qcalendar/tree/next/docs.next/src/pages' + path + '.md'"
          >
            &nbsp; Edit this page on Github
          </markdown-link>
        </div>
      </div>
      <markdown-footer />

      <a href="https://www.netlify.com" class="row justify-center">
        <img src="https://www.netlify.com/img/global/badges/netlify-color-accent.svg" alt="Deploys by Netlify" />
      </a>

    </div>
    <div class="q-mb-md"></div>
  </div>
</template>

<script>
import { useRoute } from 'vue-router'
import { useMeta } from 'quasar'

// eslint-disable-next-line no-unused-vars
import { copyHeading } from 'assets/page-utils'
import getMeta from 'assets/get-meta'
import { useMarkdownStore } from 'assets/markdown-store.js'
import MarkdownFooter from './MarkdownFooter.vue'
import MarkdownNavBar from './MarkdownNavBar.vue'

export default {
  name: 'MarkdownPage',

  components: {
    MarkdownFooter,
    MarkdownNavBar
  },

  props: {
    title: String,
    related: Array,
    nav: Array,
    noEdit: Boolean,
    badge: String,
    metaTitle: String,
    metaDesc: String,
    toc: Array
  },

  setup (props) {
    // TODO: remove
    console.log('props', props)

    const $route = useRoute(),
      path = $route.path

    useMeta(
      props.metaDesc !== void 0
        ? { title: props.metaTitle, meta: getMeta(props.metaTitle + ' » QCalendar', props.metaDesc) }
        : { title: props.metaTitle }
    )

    function getTitle () {
      return props.metaTitle
    }

    const store = useMarkdownStore()
    store.toc = props.toc !== void 0 ? props.toc : []
    store.title = getTitle()

    return {
      path
    }
  }
}
</script>

<style lang="sass">
.markdown-page-footer
  padding: 36px 0 16px

  &__icons
    font-size: 28px

    a
      text-decoration: none
      outline: 0
      color: $primary
      transition: color .28s

      &:hover
        color: $red-8
</style>
