import { defineBoot } from '@quasar/app-vite'
import VuePlugin from '@quasar/quasar-ui-qcalendar'

export default defineBoot(({ app }) => {
  app.use(VuePlugin)
})
