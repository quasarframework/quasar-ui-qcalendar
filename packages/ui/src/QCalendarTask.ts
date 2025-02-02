import { App as Application } from 'vue'
import QCalendarTask from './components/QCalendarTask'
import { version } from './version.js'

import * as Timestamp from './utils/Timestamp'
import * as helpers from './utils/helpers'

// Explicitly export individual named properties
export * from './utils/Timestamp'
export * from './utils/helpers'

export { version, QCalendarTask }

export default {
  version,
  QCalendarTask,
  ...Timestamp,
  ...helpers,

  install(app: Application): void {
    app.component(String(QCalendarTask.name), QCalendarTask)
  },
}
