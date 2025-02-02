import { App as Application } from 'vue'
import QCalendar from './components/QCalendar'
import QCalendarAgenda from './components/QCalendarAgenda'
import QCalendarDay from './components/QCalendarDay'
import QCalendarMonth from './components/QCalendarMonth'
import QCalendarResource from './components/QCalendarResource'
import QCalendarScheduler from './components/QCalendarScheduler'
import QCalendarTask from './components/QCalendarTask'
import { version } from './version.js'

import * as Timestamp from './utils/Timestamp'
import * as helpers from './utils/helpers'

// Explicitly export individual named properties
export * from './utils/Timestamp'
export * from './utils/helpers'

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

  install(app: Application): void {
    app.component(String(QCalendar.name), QCalendar)
  },
}
