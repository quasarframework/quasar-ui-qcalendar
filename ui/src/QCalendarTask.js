import QCalendarTask from './components/QCalendarTask.js'

const version = __UI_VERSION__

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
