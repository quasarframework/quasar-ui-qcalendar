import QCalendarScheduler from './components/QCalendarScheduler.js'
import pkg from '../package.json'
const { version } = pkg

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
