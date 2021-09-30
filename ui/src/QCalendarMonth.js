import QCalendarMonth from './components/QCalendarMonth.js'

const version = __UI_VERSION__

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
