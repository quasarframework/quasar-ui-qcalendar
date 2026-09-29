import { App as Application } from 'vue'
import { QCalendarResource } from './index.js'
import { version } from './version.js'

import * as helpers from './utils/helpers'

// Explicitly export individual named properties
export * from './utils/helpers'

export { version, QCalendarResource }

const plugin: typeof helpers & {
  version: string
  QCalendarResource: typeof QCalendarResource
  install: (_app: Application) => void
} = {
  version,
  QCalendarResource,
  ...helpers,

  install(app: Application): void {
    app.component(String(QCalendarResource.name), QCalendarResource)
  },
}

export default plugin
