import { App as Application } from 'vue'
import QCalendarAgenda from './components/QCalendarAgenda'
import { version } from './version.js'

import * as helpers from './utils/helpers'

// Explicitly export individual named properties
export * from './utils/helpers'

export { version, QCalendarAgenda }

export default {
  version,
  QCalendarAgenda,
  ...helpers,

  install(app: Application): void {
    app.component(String(QCalendarAgenda.name), QCalendarAgenda)
  },
}
