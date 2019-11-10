import { version } from '../package.json'
import Component from './components/QCalendar.js'
// import Api from './components/QCalendar.json'

export {
  version,
  Component
  // Api
}

export default {
  version,
  Component,
  // Api,

  install (Vue) {
    Vue.component(Component.name, Component)
  }
}
