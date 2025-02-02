import { App as Application } from 'vue'
import QCalendarScheduler from './components/QCalendarScheduler'
import { version } from './version.js'

import * as Timestamp from './utils/Timestamp'
import * as helpers from './utils/helpers'

// Explicitly export individual named properties
export * from './utils/Timestamp'
export * from './utils/helpers'

export { version, QCalendarScheduler }

export default {
  version,
  QCalendarScheduler,
  ...Timestamp,
  ...helpers,

  install(app: Application): void {
    app.component(String(QCalendarScheduler.name), QCalendarScheduler)
  },
}
