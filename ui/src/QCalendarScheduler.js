import QCalendarScheduler from './components/QCalendarScheduler.js'
import { version } from '../package.json'

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
