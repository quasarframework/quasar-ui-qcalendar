import QCalendar from './components/QCalendar.js'

const version = __UI_VERSION__

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
