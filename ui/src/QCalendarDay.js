import QCalendarDay from './components/QCalendarDay.js'

const version = __UI_VERSION__

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
