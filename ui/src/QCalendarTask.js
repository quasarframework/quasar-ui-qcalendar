import QCalendarTask from './components/QCalendarTask.js'
import { version } from '../package.json'

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
