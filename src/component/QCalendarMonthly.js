// Styles
import './calendar-weekly.styl'

// Mixins
import QCalendarWeekly from './QCalendarWeekly'

// Util
import {
  parseTimestamp,
  getStartOfMonth,
  getEndOfMonth
} from './utils/timestamp'

/* @vue/component */
export default QCalendarWeekly.extend({
  name: 'q-calendar-monthly',

  computed: {
    staticClass () {
      return 'q-calendar-weekly'
    },
    parsedStart () {
      return getStartOfMonth(parseTimestamp(this.start))
    },
    parsedEnd () {
      return getEndOfMonth(parseTimestamp(this.end))
    }
  }
})
