import QCalendarResource from './components/QCalendarResource.js'

import { version } from './version'

export {
  version,
  QCalendarResource
}

export default {
  version,
  QCalendarResource,

  install (app) {
    app.component(QCalendarResource.name, QCalendarResource)
  }
}
