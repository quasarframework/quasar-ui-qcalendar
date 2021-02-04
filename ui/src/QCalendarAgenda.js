import QCalendarAgenda from './components/QCalendarAgenda.js'
import { version } from '../package.json'

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
