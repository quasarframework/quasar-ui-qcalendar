import { App as Application } from 'vue'
import QCalendarAgenda from './components/QCalendarAgenda'
import { version } from './version.js'

import * as Timestamp from './utils/Timestamp'
import * as helpers from './utils/helpers'

// Explicitly export individual named properties
export * from './utils/Timestamp'
export * from './utils/helpers'

export { version, QCalendarAgenda }

export default {
  version,
  QCalendarAgenda,
  ...Timestamp,
  ...helpers,

  install(app: Application): void {
    app.component(String(QCalendarAgenda.name), QCalendarAgenda)
  },
}
