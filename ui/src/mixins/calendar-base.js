// Mixins
import Times from './times'
import Mouse from './mouse'
import { QColorizeMixin } from 'q-colorize-mixin'
import { QThemeMixin } from 'q-theme-mixin'

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

export default {
  name: 'CalendarBase',

  mixins: [
    QColorizeMixin,
    QThemeMixin,
    Mouse,
    Times
  ],

  props: {
    ...props.base,
    start: {
      type: String,
      validator: validateTimestamp,
      default: () => parseDate(new Date()).date
    },
    end: {
      type: String,
      validator: validateTimestamp,
      default: '0000-00-00'
    }
  },

  data () {
    return {
      keyValue: 0
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
        this.weekdaySkips,
        this.disabledBefore,
        this.disabledAfter,
        this.disabledWeekdays,
        this.disabledDays
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
    arrayHasDate (arr, timestamp) {
      return arr && arr.length > 0 && arr.includes(timestamp.date)
    },

    getRelativeClasses (timestamp, outside = false, selectedDays) {
      return {
        'q-current-day': timestamp.current,
        'q-past-day': timestamp.past,
        'q-future-day': timestamp.future,
        'q-outside': outside, // outside the current month
        'q-selected-date': this.arrayHasDate(selectedDays, timestamp)
      }
    },

    getStartOfWeek (timestamp) {
      return getStartOfWeek(timestamp, this.weekdays, this.times.today)
    },

    getEndOfWeek (timestamp) {
      return getEndOfWeek(timestamp, this.weekdays, this.times.today)
    },

    dayStyleDefault (_timestamp) {
      return undefined
    }
  }
}
