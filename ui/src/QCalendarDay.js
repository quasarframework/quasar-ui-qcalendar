import QCalendarDay from './components/QCalendarDay.js'

import { version } from './version'

export {
  version,
  QCalendarDay
}

export default {
  version,
  QCalendarDay,

  install (app) {
    app.component(QCalendarDay.name, QCalendarDay)
  }
}
