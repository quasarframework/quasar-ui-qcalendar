import { App as Application } from 'vue'
import QCalendarResource from './components/QCalendarResource'
import { version } from './version.js'

import * as helpers from './utils/helpers'

// Explicitly export individual named properties
export * from './utils/helpers'

export { version, QCalendarResource }

export default {
  version,
  QCalendarResource,
  ...helpers,

  install(app: Application): void {
    app.component(String(QCalendarResource.name), QCalendarResource)
  },
}
