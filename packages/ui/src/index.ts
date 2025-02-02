import { App as Application } from 'vue'
import QCalendar from './components/QCalendar.js'
import QCalendarAgenda from './components/QCalendarAgenda.js'
import QCalendarDay from './components/QCalendarDay.js'
import QCalendarMonth from './components/QCalendarMonth.js'
import QCalendarResource from './components/QCalendarResource.js'
import QCalendarScheduler from './components/QCalendarScheduler.js'
import QCalendarTask from './components/QCalendarTask.js'

import { version } from './version.js'

import * as Timestamp from './utils/Timestamp.js'
import * as helpers from './utils/helpers.js'

// Explicitly export individual named properties
export * from './utils/Timestamp.js'
export * from './utils/helpers.js'

export {
  version,
  QCalendar,
  QCalendarAgenda,
  QCalendarDay,
  QCalendarMonth,
  QCalendarResource,
  QCalendarScheduler,
  QCalendarTask,
}

export default {
  version,
  QCalendar,
  QCalendarAgenda,
  QCalendarDay,
  QCalendarMonth,
  QCalendarResource,
  QCalendarScheduler,
  QCalendarTask,
  ...Timestamp,
  ...helpers,

  // Vue plugin
  install(app: Application): void {
    app.component(String(QCalendar.name), QCalendar)
    app.component(String(QCalendarAgenda.name), QCalendarAgenda)
    app.component(String(QCalendarDay.name), QCalendarDay)
    app.component(String(QCalendarMonth.name), QCalendarMonth)
    app.component(String(QCalendarResource.name), QCalendarResource)
    app.component(String(QCalendarScheduler.name), QCalendarScheduler)
    app.component(String(QCalendarTask.name), QCalendarTask)
  },
}
