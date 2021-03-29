import { boot } from 'quasar/wrappers'
import VuePlugin from 'ui' // "ui" is aliased in quasar.conf.js
import MarkdownPage from '../components/MarkdownPage.vue'

export default boot(({ app }) => {
  app.use(VuePlugin)
  app.component('MarkdownPage', MarkdownPage)
})
