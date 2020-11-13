// Mixins
import QCalendarWeekly from './QCalendarWeekly.js'

// Util
import {
  parseTimestamp,
  getStartOfMonth,
  getEndOfMonth
} from '../utils/Timestamp.js'

/* @vue/component */
export default {
  name: 'QCalendarMonthly',

  mixins: [
    QCalendarWeekly
  ],

  computed: {
    parsedStart () {
      return getStartOfMonth(parseTimestamp(this.start))
    },

    parsedEnd () {
      return getEndOfMonth(parseTimestamp(this.end))
    }
  }
}
