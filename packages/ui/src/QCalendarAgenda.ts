import { App as Application } from 'vue'
import { QCalendarAgenda } from './index.js'
import { version } from './version.js'

import * as helpers from './utils/helpers'

// Explicitly export individual named properties
export * from './utils/helpers'

export { version, QCalendarAgenda }

const plugin: typeof helpers & {
  version: string
  QCalendarAgenda: typeof QCalendarAgenda
  install: (_app: Application) => void
} = {
  version,
  QCalendarAgenda,
  ...helpers,

  install(app: Application): void {
    app.component(String(QCalendarAgenda.name), QCalendarAgenda)
  },
}

export default plugin
