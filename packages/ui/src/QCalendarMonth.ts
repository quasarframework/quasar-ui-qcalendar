import { App as Application } from 'vue'
import QCalendarMonth from './components/QCalendarMonth'
import { version } from './version.js'

import * as helpers from './utils/helpers'

// Explicitly export individual named properties
export * from './utils/helpers'

export { version, QCalendarMonth }

export default {
  version,
  QCalendarMonth,
  ...helpers,

  install(app: Application): void {
    app.component(String(QCalendarMonth.name), QCalendarMonth)
  },
}
