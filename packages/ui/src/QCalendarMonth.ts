import { App as Application } from 'vue'
import QCalendarMonth from './components/QCalendarMonth'
import { version } from './version.js'

import * as Timestamp from './utils/Timestamp'
import * as helpers from './utils/helpers'

// Explicitly export individual named properties
export * from './utils/Timestamp'
export * from './utils/helpers'

export { version, QCalendarMonth }

export default {
  version,
  QCalendarMonth,
  ...Timestamp,
  ...helpers,

  install(app: Application): void {
    app.component(String(QCalendarMonth.name), QCalendarMonth)
  },
}
