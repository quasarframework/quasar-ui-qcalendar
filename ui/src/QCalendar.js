import QCalendar from './components/QCalendar.js'

import { version } from './version'

export {
  version,
  QCalendar
}

export default {
  version,
  QCalendar,

  install (app) {
    app.component(QCalendar.name, QCalendar)
  }
}
