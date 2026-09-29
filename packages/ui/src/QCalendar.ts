import { App as Application } from 'vue'
import {
  QCalendar,
  QCalendarAgenda,
  QCalendarDay,
  QCalendarMonth,
  QCalendarResource,
  QCalendarScheduler,
  QCalendarTask,
} from './index.js'
import { version } from './version.js'

import * as helpers from './utils/helpers'

// Explicitly export individual named properties
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

const plugin: typeof helpers & {
  version: string
  QCalendar: typeof QCalendar
  QCalendarAgenda: typeof QCalendarAgenda
  QCalendarDay: typeof QCalendarDay
  QCalendarMonth: typeof QCalendarMonth
  QCalendarResource: typeof QCalendarResource
  QCalendarScheduler: typeof QCalendarScheduler
  QCalendarTask: typeof QCalendarTask
  install: (_app: Application) => void
} = {
  version,
  QCalendar,
  QCalendarAgenda,
  QCalendarDay,
  QCalendarMonth,
  QCalendarResource,
  QCalendarScheduler,
  QCalendarTask,
  ...helpers,

  install(app: Application): void {
    app.component(String(QCalendar.name), QCalendar)
  },
}

export default plugin
