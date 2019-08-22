import QCalendar from '@quasar/quasar-app-extension-qcalendar/src/component/QCalendar'
import { Colorize } from 'quasar-mixin-colorize'

export default ({ Vue }) => {
  Vue.component('q-calendar', QCalendar)
  Vue.component(Colorize)
}
