<template>
  <div :class="'markdown ' + (path !== '/' ? ($q.platform.is.mobile ? '' : 'q-mx-xl') : '')">
    <markdown-nav-bar
      v-if="path !== '/' && nav && nav.length > 0"
      :title="title"
      :nav="nav"
    />

    <div :class="$route.path !== '/' ? 'q-ma-xs' : ''">
      <slot></slot>

      <div v-if="related !== undefined" class="full-width">
        <h5 class="q-ma-none q-mt-lg">Related</h5>
        <q-separator />
        <div class="q-gutter-md flex flex-center q-mt-md markdown-page__related">
          <router-link
            v-for="link in related"
            :key="link.category + link.path"
            :to="link.path"
            class="markdown-page__related--link markdown-page__related--bordered rounded-borders q-pa-md cursor-pointer column justify-center bg-grey-3"
          >
            <div class="row no-wrap items-center justify-center">
              <div class="col">
                <div class="markdown-page__nav--cat">{{ link.category || 'Docs' }}</div>
                <div class="markdown-page__nav--name text-weight-bold">{{ link.name }}</div>
              </div>
              <q-icon :name="biBoxArrowUpRight" class="q-ml-lg" />
            </div>
          </router-link>
        </div>
      </div>

      <div class="markdown-page__footer">
        <q-separator class="q-mb-lg" />
        <div v-if="path && noEdit !== true">
          <div class="full-width row justify-center items-center">
            Found an error on this page or feel it could be improved?
            <markdown-link
              :to="'https://github.com/quasarframework/quasar-ui-qcalendar/edit/next/docs/src/pages' + path + '.md'"
            >
              &nbsp; Edit this page on GitHub
            </markdown-link>
          </div>
        </div>

        <markdown-footer />

        <div class="row justify-center">
          <a href="https://www.netlify.com" target="_blank" noopener noreferrer class="row justify-center">
            <img src="https://www.netlify.com/img/global/badges/netlify-color-accent.svg" alt="Deploys by Netlify" />
          </a>
        </div>

      </div>
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
import { biBoxArrowUpRight } from '@quasar/extras/bootstrap-icons'

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
      path,
      biBoxArrowUpRight
    }
  }
}
</script>

<style lang="sass" scoped>
.markdown-page
  &__related

    &--bordered
      border: 1px solid $separator-color

    &--link
      position: relative
      color: $grey-8
      background: $grey-3 !important
      transition: color .28s, background .28s, border .28s
      outline: 0
      text-decoration: none

      &:hover
        color: var(--text-color-active)
        background: var(--background-color-active) !important
        border: 1px solid var(--text-color-active)

      &:before
        content: ''
        position: absolute
        top: 0
        right: 0
        bottom: 0
        left: 0
        background: #000
        opacity: 0
        transition: opacity .28s

      &:focus:before
        opacity: .1

    & + &
      margin-top: 0

    &__nav
      &--cat
        font-size: .8em

      &--name
        font-size: 1em

  &__footer
    padding: 36px 0 16px
</style>
