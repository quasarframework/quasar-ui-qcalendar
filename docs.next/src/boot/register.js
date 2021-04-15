import { boot } from 'quasar/wrappers'
// import VuePlugin, { version } from 'ui' // "ui" is aliased in quasar.conf.js
import JsonApiViewer from 'quasar-ui-json-api-viewer/src/components/JsonApiViewer.js'
import MarkdownPage from '../components/MarkdownPage.vue'
import MarkdownLink from '../components/MarkdownLink.vue'
import ExampleViewer, { setDefaults } from 'quasar-ui-example-viewer/src'
import { version } from '@quasar/quasar-ui-qcalendar/package.json'

setDefaults({
  locationUrl: 'https://github.com/quasarframework/quasar-ui-qcalendar/tree/next/ui/dev/src/examples',
  jsPaths: [`https://cdn.jsdelivr.net/npm/@quasar/quasar-ui-qcalendar@${ version }/dist/index.umd.min.js`],
  cssPaths: [
    `https://cdn.jsdelivr.net/npm/@quasar/quasar-ui-qcalendar@${ version }/dist/index.min.css`,
    'https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@5.12.0/css/all.css'
  ]

})

export default boot(({ app }) => {
  // app.use(VuePlugin)
  app.use(ExampleViewer)
  app.component('JsonApiViewer', JsonApiViewer)
  app.component('MarkdownPage', MarkdownPage)
  app.component('MarkdownLink', MarkdownLink)
})
