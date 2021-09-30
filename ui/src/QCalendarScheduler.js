import QCalendarScheduler from './components/QCalendarScheduler.js'

const version = __UI_VERSION__

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
