import { boot } from 'quasar/wrappers'
import VuePlugin from '@quasar/quasar-ui-qcalendar'

export default boot(({ app }) => {
  app.use(VuePlugin)
})
