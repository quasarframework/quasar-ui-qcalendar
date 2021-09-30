import QCalendarResource from './components/QCalendarResource.js'

const version = __UI_VERSION__

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
