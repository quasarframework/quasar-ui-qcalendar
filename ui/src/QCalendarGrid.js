import QCalendarGrid from './components/QCalendarGrid.js'
import { version } from '../package.json'

export {
  version,
  QCalendarGrid
}

export default {
  version,
  QCalendarGrid,

  install (app) {
    app.component(QCalendarGrid.name, QCalendarGrid)
  }
}
