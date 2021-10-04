import QCalendarScheduler from './components/QCalendarScheduler.js'

import { version } from './version'

export {
  version,
  QCalendarScheduler
}

export default {
  version,
  QCalendarScheduler,

  install (app) {
    app.component(QCalendarScheduler.name, QCalendarScheduler)
  }
}
