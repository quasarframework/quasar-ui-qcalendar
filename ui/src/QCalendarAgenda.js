import QCalendarAgenda from './components/QCalendarAgenda.js'

const version = __UI_VERSION__

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
