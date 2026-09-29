import { App as Application } from 'vue'
import { QCalendarTask } from './index.js'
import { version } from './version.js'

import * as helpers from './utils/helpers'

// Explicitly export individual named properties
export * from './utils/helpers'

export { version, QCalendarTask }

const plugin: typeof helpers & {
  version: string
  QCalendarTask: typeof QCalendarTask
  install: (_app: Application) => void
} = {
  version,
  QCalendarTask,
  ...helpers,

  install(app: Application): void {
    app.component(String(QCalendarTask.name), QCalendarTask)
  },
}

export default plugin
