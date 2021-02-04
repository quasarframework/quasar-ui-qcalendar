import QCalendarMonth from './components/QCalendarMonth.js'
import { version } from '../package.json'

export {
  version,
  QCalendarMonth
}

export default {
  version,
  QCalendarMonth,

  install (app) {
    app.component(QCalendarMonth.name, QCalendarMonth)
  }
}
