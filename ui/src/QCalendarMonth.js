import QCalendarMonth from './components/QCalendarMonth.js'
import pkg from '../package.json'
const { version } = pkg

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
