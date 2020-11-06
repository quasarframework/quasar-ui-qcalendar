// Mixins
import Times from './times'
import Mouse from './mouse'

// Util
import props from '../utils/props'
import {
  validateTimestamp,
  parseTimestamp,
  parseDate,
  parsed,
  getWeekdaySkips,
  createDayList,
  createNativeLocaleFormatter,
  getStartOfWeek,
  getEndOfWeek,
  getDayIdentifier
} from '../utils/timestamp'

export default {
  name: 'CalendarBase',

  mixins: [
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

    checkDays (arr, timestamp) {
      const days = {
        firstDay: false,
        betweenDays: false,
        lastDay: false
      }

      // array must have two dates ('YYYY-MM-DD') in it
      if (arr && arr.length === 2) {
        const current = getDayIdentifier(timestamp)
        const first = getDayIdentifier(parsed(arr[0]))
        const last = getDayIdentifier(parsed(arr[1]))
        days.firstDay = first === current
        days.lastDay = last === current
        days.betweenDays = first < current && last > current
      }
      return days
    },

    getRelativeClasses (timestamp, outside = false, selectedDays = [], startEndDays = [], hover = false) {
      const isSelected = this.arrayHasDate(selectedDays, timestamp)
      const { firstDay, lastDay, betweenDays } = this.checkDays(startEndDays, timestamp)

      return {
        'q-past-day': firstDay !== true && betweenDays !== true && lastDay !== true && isSelected !== true && outside !== true && timestamp.past,
        'q-future-day': firstDay !== true && betweenDays !== true && lastDay !== true && isSelected !== true && outside !== true && timestamp.future,
        'q-outside': outside, // outside the current month
        'q-disabled-day': timestamp.disabled === true,
        'q-current-day': timestamp.current,
        'q-selected': isSelected,
        'q-range-first': firstDay === true,
        'q-range': betweenDays === true,
        'q-range-last': lastDay === true,
        'q-range-hover': hover === true && (firstDay === true || lastDay === true || betweenDays === true)
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
