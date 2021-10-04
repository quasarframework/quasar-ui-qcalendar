import QCalendarAgenda from './components/QCalendarAgenda.js'

import { version } from './version'

export {
  version,
  QCalendarAgenda
}

export default {
  version,
  QCalendarAgenda,

  install (app) {
    app.component(QCalendarAgenda.name, QCalendarAgenda)
  }
}
