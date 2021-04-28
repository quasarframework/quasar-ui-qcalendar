import QCalendarTask from './components/QCalendarTask.js'
import pkg from '../package.json'
const { version } = pkg

export {
  version,
  QCalendarTask
}

export default {
  version,
  QCalendarTask,

  install (app) {
    app.component(QCalendarTask.name, QCalendarTask)
  }
}
