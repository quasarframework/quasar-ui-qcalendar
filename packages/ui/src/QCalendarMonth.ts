import { App as Application } from 'vue'
import { QCalendarMonth } from './index.js'
import { version } from './version.js'

import * as helpers from './utils/helpers'

// Explicitly export individual named properties
export * from './utils/helpers'

export { version, QCalendarMonth }

const plugin: typeof helpers & {
  version: string
  QCalendarMonth: typeof QCalendarMonth
  install: (_app: Application) => void
} = {
  version,
  QCalendarMonth,
  ...helpers,

  install(app: Application): void {
    app.component(String(QCalendarMonth.name), QCalendarMonth)
  },
}

export default plugin
