import QCalendarResource from './components/QCalendarResource.js'
import pkg from '../package.json'
const { version } = pkg

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
