import {
  computed,
  defineComponent,
  h
} from 'vue'

import QCalendarAgenda from './QCalendarAgenda.js'
import QCalendarDay from './QCalendarDay.js'
// import QCalendarTask from './QCalendarTask.js'
import QCalendarMonth from './QCalendarMonth.js'
import QCalendarResource from './QCalendarResource.js'
import QCalendarScheduler from './QCalendarScheduler.js'

function __suffixView (suffix) {
  return [ 'day', 'week', 'month' ].map(v => v + suffix)
}

function __validateView (v) {
  return [ 'month-interval', ...__suffixView(''), ...__suffixView('-agenda'), ...__suffixView('-resource'), ...__suffixView('-scheduler') ].includes(v)
}

export default defineComponent({
  name: 'QCalendar',
  props: {
    view: {
      type: String,
      validator: __validateView,
      default: 'day'
    }
  },
  setup (props, { attrs, slots }) {
    const component = computed(() => {
      const view = props.view.split('-')
      switch (view[ view.length - 1 ]) {
        case 'agenda':
          return QCalendarAgenda
        case 'resource':
          return QCalendarResource
        case 'scheduler':
          return QCalendarScheduler
        case 'month':
          return QCalendarMonth
        case 'day':
        case 'week':
        case 'interval':
        default:
          return QCalendarDay
      }
    })
    return () => h(component.value, { ...attrs, view: props.view.split('-')[ 0 ] }, slots)
  }
})
