// Mixins
import QCalendarWeekly from './QCalendarWeekly.js'

// Util
import {
  parseTimestamp,
  getStartOfMonth,
  getEndOfMonth
} from '../utils/timestamp'

/* @vue/component */
export default {
  name: 'QCalendarMonthly',

  mixins: [
    QCalendarWeekly
  ],

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
}
