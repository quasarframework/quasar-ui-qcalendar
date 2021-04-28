import QCalendarAgenda from './components/QCalendarAgenda.js'
import pkg from '../package.json'
const { version } = pkg

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
