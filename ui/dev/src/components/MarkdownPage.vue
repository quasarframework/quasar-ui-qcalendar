<template>
  <slot></slot>
  <div v-if="path && noEdit !== true">
    <br><br><br><br>Found an error on this page or feel it could be improved?
    <a
      :href="'https://github.com/quasarframework/quasar-ui-qcalendar/tree/dev/ui/dev/src/pages' + path"
      target="_blank"
    >
      Edit this page on Github
    </a>
  </div>
</template>

<script>
import { useRoute } from 'vue-router'
import { useMeta } from 'quasar'
// eslint-disable-next-line no-unused-vars
import { copyHeading } from 'assets/page-utils'
import getMeta from 'assets/get-meta'
import { useMarkdownStore } from 'assets/markdown-store.js'

export default {
  name: 'MarkdownPage',

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
    console.log(props)
    const $route = useRoute(),
      path = $route.path

    useMeta(
      props.metaDesc !== void 0
        ? { title: props.metaTitle, meta: getMeta(props.metaTitle + ' | QCalendar', props.metaDesc) }
        : { title: props.metaTitle }
    )

    const store = useMarkdownStore()
    store.toc = props.toc !== void 0 ? props.toc : []

    return {
      path
    }
  }
}
</script>
