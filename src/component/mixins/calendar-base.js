import Vue from 'vue'

// Mixins
import Times from './times'
import Mouse from './mouse'
import Colorize from './colorize'
import Theme from './theme'

// Util
import props from '../utils/props'
import {
  validateTimestamp,
  parseTimestamp,
  parseDate,
  getWeekdaySkips,
  createDayList,
  createNativeLocaleFormatter,
  getStartOfWeek,
  getEndOfWeek
} from '../utils/timestamp'

export default Vue.extend({
  name: 'calendar-base',

  mixins: [Times, Mouse, Colorize, Theme],

  props: {
    ...props.base,
    start: {
      type: String,
      validate: validateTimestamp,
      default: () => parseDate(new Date()).date
    },
    end: {
      type: String,
      validate: validateTimestamp,
      default: '0000-00-00'
    }
  },

  data () {
    return {
      keyValue: 'YYYY-mm-dd',
      direction: 'next'
    }
  },

  computed: {
    weekdaySkips () {
      return getWeekdaySkips(this.weekdays)
    },
    parsedStart () {
      return parseTimestamp(this.start)
    },
    parsedEnd () {
      return parseTimestamp(this.end)
    },
    days () {
      return createDayList(
        this.parsedStart,
        this.parsedEnd,
        this.times.today,
        this.weekdaySkips
      )
    },
    dayFormatter () {
      const options = { timeZone: 'UTC', day: 'numeric' }

      return createNativeLocaleFormatter(
        this.locale,
        (_tms, _short) => options
      )
    },
    weekdayFormatter () {
      const longOptions = { timeZone: 'UTC', weekday: 'long' }
      const shortOptions = { timeZone: 'UTC', weekday: 'short' }

      return createNativeLocaleFormatter(
        this.locale,
        (_tms, short) => short ? shortOptions : longOptions
      )
    }
  },

  methods: {
    getRelativeClasses (timestamp, outside = false) {
      return {
        'q-current-day': timestamp.current,
        'q-past-day': timestamp.past,
        'q-future-day': timestamp.future,
        'q-outside': outside // outside the current month
      }
    },
    getStartOfWeek (timestamp) {
      return getStartOfWeek(timestamp, this.weekdays, this.times.today)
    },
    getEndOfWeek (timestamp) {
      return getEndOfWeek(timestamp, this.weekdays, this.times.today)
    }
  }
})
