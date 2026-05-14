import { defineBoot } from '#q-app'
import VuePlugin from '@quasar/quasar-ui-qcalendar'

export default defineBoot(({ app }) => {
  app.use(VuePlugin)
})
