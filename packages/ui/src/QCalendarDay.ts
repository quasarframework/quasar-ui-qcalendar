import { App as Application } from 'vue'
import QCalendarDay from './components/QCalendarDay'
import { version } from './version.js'

import * as helpers from './utils/helpers'

// Explicitly export individual named properties
export * from './utils/helpers'

export { version, QCalendarDay }

export default {
  version,
  QCalendarDay,
  ...helpers,

  install(app: Application): void {
    app.component(String(QCalendarDay.name), QCalendarDay)
  },
}
