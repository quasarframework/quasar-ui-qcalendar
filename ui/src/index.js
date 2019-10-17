import { version } from '../package.json'
import Component from './component/QCalendar.js'
import Api from './component/QCalendar.json'

export {
  version,
  Component,
  Api

}

export default {
  version,
  Component,
  Api,

  install (Vue) {
    Vue.component(Component.name, Component)
  }
}
