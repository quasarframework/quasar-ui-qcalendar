import { h } from 'vue'
import { QIcon } from 'quasar'

import { farFileAlt, fasFolderOpen } from '@quasar/extras/fontawesome-v5'

import MarkdownPage from './MarkdownPage.vue'
import MarkdownLink from './MarkdownLink.vue'

export default function (title, links) {
  function getContent () {
    return links.map(link => {
      return h('div', { class: 'markdown-page-listing' }, [
        h(QIcon, {
          name: link.page === true ? farFileAlt : fasFolderOpen
        }),

        h(MarkdownLink, { to: link.to }, () => link.title)
      ])
    })
  }

  return {
    name: 'MarkdownListingPage',

    setup () {
      return () => h(MarkdownPage, {
        title,
        noEdit: true,
        metaTitle: title,
        metaDesc: `List of pages under the '${ title }' section`
      }, getContent)
    }
  }
}
