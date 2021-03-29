<template>
  <slot></slot>
</template>

<script>
import { useMeta } from 'quasar'
// import { copyHeading } from 'assets/page-utils'
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
    useMeta(
      props.metaDesc !== void 0
        ? { title: props.metaTitle, meta: getMeta(props.metaTitle + ' | QCalendar', props.metaDesc) }
        : { title: props.metaTitle }
    )

    const $store = useMarkdownStore()
    $store.toc = props.toc !== void 0 ? props.toc : []

    return {}
  }
}
</script>
