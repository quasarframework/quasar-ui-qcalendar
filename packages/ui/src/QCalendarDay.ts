import { App as Application } from 'vue'
import { QCalendarDay } from './index.js'
import { version } from './version.js'

import * as helpers from './utils/helpers'

// Explicitly export individual named properties
export * from './utils/helpers'

export { version, QCalendarDay }

const plugin: typeof helpers & {
  version: string
  QCalendarDay: typeof QCalendarDay
  install: (_app: Application) => void
} = {
  version,
  QCalendarDay,
  ...helpers,

  install(app: Application): void {
    app.component(String(QCalendarDay.name), QCalendarDay)
  },
}

export default plugin
