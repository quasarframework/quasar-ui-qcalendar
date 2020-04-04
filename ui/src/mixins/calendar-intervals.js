// Mixins
import CalendarBase from './calendar-base'

// Util
import props from '../utils/props'
import {
  parseTime,
  copyTimestamp,
  updateMinutes,
  createDayList,
  createIntervalList,
  createNativeLocaleFormatter
} from '../utils/timestamp'

export default {
  name: 'CalendarWithIntervals',

  mixins: [
    CalendarBase
  ],

  props: {
    ...props.intervals
  },

  computed: {
    parsedIntervalStart () {
      return parseInt(this.intervalStart, 10)
    },

    parsedIntervalMinutes () {
      return parseInt(this.intervalMinutes, 10)
    },

    parsedIntervalCount () {
      return parseInt(this.intervalCount, 10)
    },

    parsedIntervalHeight () {
      return parseFloat(this.intervalHeight)
    },

    startMinute () {
      return this.parsedIntervalStart * this.parsedIntervalMinutes
    },

    bodyHeight () {
      return this.parsedIntervalCount * this.parsedIntervalHeight
    },

    days () {
      return createDayList(
        this.parsedStart,
        this.parsedEnd,
        this.times.today,
        this.weekdaySkips,
        this.disabledBefore,
        this.disabledAfter,
        this.disabledDays,
        this.maxDays
      )
    },

    intervals () {
      const days = this.days
      const first = this.parsedIntervalStart
      const minutes = this.parsedIntervalMinutes
      const count = this.parsedIntervalCount
      const now = this.times.now

      if (days.length === 0) {
        /* eslint-disable no-console */
        console.error('QCalendar: days array has no content')
      }
      return days.map(d => createIntervalList(d, first, minutes, count, now))
    },

    intervalFormatter () {
      const longOptions = { timeZone: 'UTC', hour12: !this.hour24Format, hour: '2-digit', minute: '2-digit' }
      const shortOptions = { timeZone: 'UTC', hour12: !this.hour24Format, hour: 'numeric', minute: '2-digit' }
      const shortHourOptions = { timeZone: 'UTC', hour12: !this.hour24Format, hour: 'numeric' }

      return createNativeLocaleFormatter(
        this.locale,
        (tms, short) => short ? (tms.minute === 0 ? shortHourOptions : shortOptions) : longOptions
      )
    }
  },

  methods: {
    showIntervalLabelDefault (interval) {
      const first = this.intervals[0][0]
      const isFirst = first.hour === interval.hour && first.minute === interval.minute
      return !isFirst && interval.minute === 0
    },

    intervalStyleDefault (_interval) {
      return undefined
    },

    getTimestampAtEvent (e, day) {
      const timestamp = copyTimestamp(day)
      const bounds = (e.currentTarget).getBoundingClientRect()
      const baseMinutes = this.startMinute
      const touchEvent = e
      const mouseEvent = e
      const touches = touchEvent.changedTouches || touchEvent.touches
      const clientY = touches && touches[0] ? touches[0].clientY : mouseEvent.clientY
      const addIntervals = (clientY - bounds.top) / this.parsedIntervalHeight
      const addMinutes = Math.floor(addIntervals * this.parsedIntervalMinutes)
      const minutes = baseMinutes + addMinutes

      return updateMinutes(timestamp, minutes, this.times.now)
    },

    getScopeForSlot (timestamp, idx) {
      const scope = copyTimestamp(timestamp)
      scope.timeStartPos = this.timeStartPos
      scope.timeDurationHeight = this.timeDurationHeight
      if (idx !== void 0) {
        scope.index = idx
      }
      return scope
    },

    scrollToTime (time) {
      const y = this.timeStartPos(time)
      const pane = this.$refs.scrollArea

      if (y === false || !pane) {
        return false
      }

      pane.scrollTop = y

      return true
    },

    timeDurationHeight (minutes) {
      return minutes / this.parsedIntervalMinutes * this.parsedIntervalHeight
    },

    timeStartPos (time, clamp = true) {
      const minutes = parseTime(time)
      if (minutes === false) return false

      const min = this.startMinute
      const gap = this.parsedIntervalCount * this.parsedIntervalMinutes
      const delta = (minutes - min) / gap
      let y = delta * this.bodyHeight

      if (clamp) {
        if (y < 0) {
          y = 0
        }
        if (y > this.bodyHeight) {
          y = this.bodyHeight
        }
      }

      return y
    }
  }
}
