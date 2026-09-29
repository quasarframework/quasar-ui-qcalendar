import { App as Application } from 'vue'
import { QCalendarScheduler } from './index.js'
import { version } from './version.js'

import * as helpers from './utils/helpers'

// Explicitly export individual named properties
export * from './utils/helpers'

export { version, QCalendarScheduler }

const plugin: typeof helpers & {
  version: string
  QCalendarScheduler: typeof QCalendarScheduler
  install: (_app: Application) => void
} = {
  version,
  QCalendarScheduler,
  ...helpers,

  install(app: Application): void {
    app.component(String(QCalendarScheduler.name), QCalendarScheduler)
  },
}

export default plugin
