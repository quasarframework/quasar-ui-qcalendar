import QCalendar from './components/QCalendar.js'
import pkg from '../package.json'
const { version } = pkg

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
