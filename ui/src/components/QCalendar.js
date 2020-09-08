// Mixins
import CalendarBase from '../mixins/calendar-base'

// Util
import props from '../utils/props.js'
import {
  DAYS_IN_MONTH_MAX,
  DAY_MIN,
  today,
  parseTimestamp,
  relativeDays,
  nextDay,
  prevDay,
  copyTimestamp,
  updateFormatted,
  updateWeekday,
  updateDayOfYear,
  updateRelative,
  getStartOfMonth,
  getEndOfMonth,
  getDayIdentifier
} from '../utils/timestamp.js'

// Calendars
import QCalendarMonthly from './QCalendarMonthly'
import QCalendarDaily from './QCalendarDaily'
import QCalendarScheduler from './QCalendarScheduler'
import QCalendarAgenda from './QCalendarAgenda'
import QCalendarResource from './QCalendarResource'

/* @vue/component */
export default {
  name: 'QCalendar',

  mixins: [
    CalendarBase
  ],

  props: {
    ...props.base,
    ...props.calendar,
    ...props.weeks,
    ...props.intervals,
    ...props.scheduler,
    ...props.resource,
    ...props.agenda
  },

  data: () => ({
    lastStart: void 0,
    lastEnd: void 0
  }),

  computed: {
    parsedValue () {
      return parseTimestamp(this.value) ||
        this.parsedStart ||
        this.times.today
    },

    renderProps () {
      const around = this.parsedValue
      let component = 'div'
      let maxDays = this.maxDays
      let start = around
      let end = around
      switch (this.view) {
        case 'month':
          component = QCalendarMonthly
          start = getStartOfMonth(around)
          end = getEndOfMonth(around)
          break
        case 'week':
        case 'week-agenda':
        case 'week-scheduler':
          component = this.view.endsWith('-agenda') ? QCalendarAgenda : this.view.endsWith('-scheduler') ? QCalendarScheduler : QCalendarDaily
          start = this.getStartOfWeek(around)
          end = this.getEndOfWeek(start)
          maxDays = this.weekdays.length
          break
        case 'day':
        case 'day-scheduler':
        case 'day-agenda':
          component = this.view.endsWith('-agenda') ? QCalendarAgenda : this.view.endsWith('-scheduler') ? QCalendarScheduler : QCalendarDaily
          maxDays = 1
          end = relativeDays(copyTimestamp(end), nextDay, maxDays, this.weekdays)
          updateFormatted(end)
          break
        case '2day':
        case '2day-scheduler':
        case '2day-agenda':
          component = this.view.endsWith('-agenda') ? QCalendarAgenda : this.view.endsWith('-scheduler') ? QCalendarScheduler : QCalendarDaily
          maxDays = 2
          end = relativeDays(copyTimestamp(end), nextDay, maxDays, this.weekdays)
          updateFormatted(end)
          break
        case '3day':
        case '3day-scheduler':
        case '3day-agenda':
          component = this.view.endsWith('-agenda') ? QCalendarAgenda : this.view.endsWith('-scheduler') ? QCalendarScheduler : QCalendarDaily
          maxDays = 3
          end = relativeDays(copyTimestamp(end), nextDay, maxDays, this.weekdays)
          updateFormatted(end)
          break
        case '4day':
        case '4day-scheduler':
        case '4day-agenda':
          component = this.view.endsWith('-agenda') ? QCalendarAgenda : this.view.endsWith('-scheduler') ? QCalendarScheduler : QCalendarDaily
          maxDays = 4
          end = relativeDays(copyTimestamp(end), nextDay, maxDays, this.weekdays)
          updateFormatted(end)
          break
        case '5day':
        case '5day-scheduler':
        case '5day-agenda':
          component = this.view.endsWith('-agenda') ? QCalendarAgenda : this.view.endsWith('-scheduler') ? QCalendarScheduler : QCalendarDaily
          maxDays = 5
          end = relativeDays(copyTimestamp(end), nextDay, maxDays, this.weekdays)
          updateFormatted(end)
          break
        case '6day':
        case '6day-scheduler':
        case '6day-agenda':
          component = this.view.endsWith('-agenda') ? QCalendarAgenda : this.view.endsWith('-scheduler') ? QCalendarScheduler : QCalendarDaily
          maxDays = 6
          end = relativeDays(copyTimestamp(end), nextDay, maxDays, this.weekdays)
          updateFormatted(end)
          break
        case 'custom-interval':
        case 'custom-scheduler':
        case 'custom-agenda':
          component = this.view.endsWith('-agenda') ? QCalendarAgenda : this.view.endsWith('-scheduler') ? QCalendarScheduler : QCalendarDaily
          end = relativeDays(copyTimestamp(end), nextDay, this.maxDays, this.weekdays)
          updateFormatted(end)
          break
        case 'scheduler':
        case 'agenda':
          component = this.view === 'scheduler' ? QCalendarScheduler : QCalendarAgenda
          end = relativeDays(copyTimestamp(end), nextDay, this.maxDays, this.weekdays)
          updateFormatted(end)
          break
        case 'month-interval':
        case 'month-scheduler':
        case 'month-agenda':
          component = this.view.endsWith('-agenda') ? QCalendarAgenda : this.view.endsWith('-scheduler') ? QCalendarScheduler : QCalendarDaily
          start = getStartOfMonth(around)
          end = getEndOfMonth(around)
          updateFormatted(end)
          maxDays = DAYS_IN_MONTH_MAX
          break
        case 'resource':
        case 'day-resource':
          component = QCalendarResource
          maxDays = 1
          end = relativeDays(copyTimestamp(end), nextDay, maxDays, this.weekdays)
          updateFormatted(end)
          break
      }
      return { component, start, end, maxDays }
    }
  },

  beforeMount () {
    // get start and end dates
    this.__checkChange()
  },

  watch: {
    renderProps: '__checkChange'
  },

  methods: {
    __checkChange () {
      const { start, end } = this.renderProps
      this.keyValue = 0
      if (this.lastStart === void 0 || this.lastEnd === void 0 || start.date !== this.lastStart || end.date !== this.lastEnd) {
        this.lastStart = start.date
        this.lastEnd = end.date
        this.$emit('change', { start, end })
      }
      this.keyValue = getDayIdentifier(start)
    },

    move (amount = 1) {
      if (amount === 0) {
        this.moveToToday()
        return
      }
      const moved = copyTimestamp(this.parsedValue)
      const forward = amount > 0
      const mover = forward ? nextDay : prevDay
      const limit = forward ? DAYS_IN_MONTH_MAX : DAY_MIN
      let times = forward ? amount : -amount
      this.direction = forward ? 'next' : 'prev'
      let maxDays = this.maxDays
      const dayCount = this.weekdaySkips.filter(x => x !== 0).length

      while (--times >= 0) {
        switch (this.view) {
          case 'month':
            moved.day = limit
            mover(moved)
            break
          case 'week':
          case 'week-scheduler':
          case 'week-agenda':
          case 'scheduler':
            relativeDays(moved, mover, dayCount, this.weekdays)
            break
          case 'day':
          case 'day-scheduler':
          case 'day-agenda':
            maxDays = 1
            relativeDays(moved, mover, maxDays, this.weekdays)
            break
          case '2day':
          case '2day-scheduler':
          case '2day-agenda':
            maxDays = 2
            relativeDays(moved, mover, maxDays, this.weekdays)
            break
          case '3day':
          case '3day-scheduler':
          case '3day-agenda':
            maxDays = 3
            relativeDays(moved, mover, maxDays, this.weekdays)
            break
          case '4day':
          case '4day-scheduler':
          case '4day-agenda':
            maxDays = 4
            relativeDays(moved, mover, maxDays, this.weekdays)
            break
          case '5day':
          case '5day-scheduler':
          case '5day-agenda':
            maxDays = 5
            relativeDays(moved, mover, maxDays, this.weekdays)
            break
          case '6day':
          case '6day-scheduler':
          case '6day-agenda':
            maxDays = 6
            relativeDays(moved, mover, maxDays, this.weekdays)
            break
          case 'custom-interval':
          case 'custom-scheduler':
          case 'custom-agenda':
          case 'agenda':
            relativeDays(moved, mover, this.maxDays, this.weekdays)
            break
          case 'month-interval':
          case 'month-agenda':
          case 'month-scheduler':
            moved.day = limit
            mover(moved)
            break
          case 'resource':
          case 'day-resource':
            maxDays = 1
            relativeDays(moved, mover, maxDays, this.weekdays)
            break
        }
      }

      updateWeekday(moved)
      updateFormatted(moved)
      updateDayOfYear(moved)
      updateRelative(moved, this.times.now)

      this.$emit('input', moved.date)
      this.$emit('moved', moved)
    },

    moveToToday () {
      this.$emit('input', today())
    },

    next (amount = 1) {
      this.move(amount)
    },

    prev (amount = 1) {
      this.move(-amount)
    },

    timeStartPos (time, clamp = true) {
      const c = this.$children[0]
      if (c && c.timeStartPos) {
        return c.timeStartPos(time, clamp)
      }
      else {
        return false
      }
    },

    timeStartPosX (time, clamp = true) {
      const c = this.$children[0]
      if (c && c.timeStartPosX) {
        return c.timeStartPosX(time, clamp)
      }
      else {
        return false
      }
    },

    timeDurationHeight (minutes) {
      const c = this.$children[0]
      if (c && c.timeDurationHeight) {
        return c.timeDurationHeight(minutes)
      }
      else {
        return -1
      }
    },

    timeDurationWidth (minutes) {
      const c = this.$children[0]
      if (c && c.timeDurationWidth) {
        return c.timeDurationWidth(minutes)
      }
      else {
        return -1
      }
    },

    scrollToTime (time) {
      const c = this.$children[0]
      if (c && c.scrollToTime) {
        return c.scrollToTime(time)
      }
      else {
        return false
      }
    },

    scrollToTimeX (time) {
      const c = this.$children[0]
      if (c && c.scrollToTimeX) {
        return c.scrollToTimeX(time)
      }
      else {
        return false
      }
    },

    __renderComponent (h, component, data) {
      return h(component, data)
    }
  },

  render (h) {
    const { start, end, maxDays, component } = this.renderProps

    this.keyValue = getDayIdentifier(start)

    const data = {
      staticClass: 'q-calendar' + (this.dark === true ? ' q-calendar--dark' : ''),
      class: {
        'q-calendar__bordered': this.bordered
      },
      key: this.keyValue,
      props: {
        ...this.$props,
        direction: this.direction,
        start: start.date,
        end: end.date,
        maxDays
      },
      on: {
        ...this.$listeners,
        'click:date': (timestamp) => {
          if (this.$listeners.input !== void 0) {
            if (timestamp.date !== void 0) {
              this.$emit('input', timestamp.date)
            }
            else if (timestamp.day !== void 0 && timestamp.day.date !== void 0) {
              this.$emit('input', timestamp.day.date)
            }
          }
          if (this.$listeners['click:date']) {
            this.$emit('click:date', timestamp)
          }
        }
      },
      scopedSlots: this.$scopedSlots
    }

    return this.__renderComponent(h, component, data)
  }
}
