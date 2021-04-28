import QCalendarDay from './components/QCalendarDay.js'
import pkg from '../package.json'
const { version } = pkg

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
