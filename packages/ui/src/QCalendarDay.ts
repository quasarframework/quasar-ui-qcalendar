import { App as Application } from 'vue'
import QCalendarDay from './components/QCalendarDay'
import { version } from './version.js'

import * as Timestamp from './utils/Timestamp'
import * as helpers from './utils/helpers'

// Explicitly export individual named properties
export * from './utils/Timestamp'
export * from './utils/helpers'

export { version, QCalendarDay }

export default {
  version,
  QCalendarDay,
  ...Timestamp,
  ...helpers,

  install(app: Application): void {
    app.component(String(QCalendarDay.name), QCalendarDay)
  },
}
