// import Vue from 'vue'

// Mixins
import CalendarBase from './mixins/calendar-base'

// Util
import props from './utils/props'
import {
  DAYS_IN_MONTH_MAX,
  DAY_MIN,
  DAYS_IN_WEEK,
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
} from './utils/timestamp'

// Calendars
import QCalendarMonthly from './QCalendarMonthly'
import QCalendarDaily from './QCalendarDaily'

/* @vue/component */
export default CalendarBase.extend({
  name: 'q-calendar',

  props: {
    ...props.calendar,
    ...props.weeks,
    ...props.intervals
  },

  data: () => ({
    lastStart: null,
    lastEnd: null
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
          component = QCalendarDaily
          start = this.getStartOfWeek(around)
          end = this.getEndOfWeek(around)
          maxDays = DAYS_IN_WEEK
          break
        case 'day':
          component = QCalendarDaily
          maxDays = 1
          end = relativeDays(copyTimestamp(end), nextDay, maxDays, this.weekdays)
          updateFormatted(end)
          break
        case '2day':
          component = QCalendarDaily
          maxDays = 2
          end = relativeDays(copyTimestamp(end), nextDay, maxDays, this.weekdays)
          updateFormatted(end)
          break
        case '3day':
          component = QCalendarDaily
          maxDays = 3
          end = relativeDays(copyTimestamp(end), nextDay, maxDays, this.weekdays)
          updateFormatted(end)
          break
        case '4day':
          component = QCalendarDaily
          maxDays = 4
          end = relativeDays(copyTimestamp(end), nextDay, maxDays, this.weekdays)
          updateFormatted(end)
          break
        case '5day':
          component = QCalendarDaily
          maxDays = 5
          end = relativeDays(copyTimestamp(end), nextDay, maxDays, this.weekdays)
          updateFormatted(end)
          break
        case '6day':
          component = QCalendarDaily
          maxDays = 6
          end = relativeDays(copyTimestamp(end), nextDay, maxDays, this.weekdays)
          updateFormatted(end)
          break
        case 'custom-interval':
          component = QCalendarDaily
          end = relativeDays(copyTimestamp(end), nextDay, this.maxDays, this.weekdays)
          updateFormatted(end)
          break
        case 'month-interval':
          component = QCalendarDaily
          start = getStartOfMonth(around)
          end = getEndOfMonth(around)
          updateFormatted(end)
          maxDays = 31
          break
      }

      return { component, start, end, maxDays }
    }
  },

  watch: {
    renderProps: 'checkChange'
  },

  methods: {
    checkChange (val, oldval) {
      const { start, end } = this.renderProps
      this.keyValue = 0
      if (start !== this.lastStart || end !== this.lastEnd) {
        this.lastStart = start
        this.lastEnd = end
        this.$emit('change', { start, end })
      }
      this.keyValue = getDayIdentifier(start)
    },

    move (amount = 1) {
      const moved = copyTimestamp(this.parsedValue)
      const forward = amount > 0
      const mover = forward ? nextDay : prevDay
      const limit = forward ? DAYS_IN_MONTH_MAX : DAY_MIN
      let times = forward ? amount : -amount
      this.direction = forward ? 'next' : 'prev'
      let maxDays = this.maxDays

      while (--times >= 0) {
        switch (this.view) {
          case 'month':
            moved.day = limit
            mover(moved)
            break
          case 'week':
            relativeDays(moved, mover, DAYS_IN_WEEK)
            break
          case 'day':
            maxDays = 1
            relativeDays(moved, mover, maxDays, this.weekdays)
            break
          case '2day':
            maxDays = 2
            relativeDays(moved, mover, maxDays, this.weekdays)
            break
          case '3day':
            maxDays = 3
            relativeDays(moved, mover, maxDays, this.weekdays)
            break
          case '4day':
            maxDays = 4
            relativeDays(moved, mover, maxDays, this.weekdays)
            break
          case '5day':
            maxDays = 5
            relativeDays(moved, mover, maxDays, this.weekdays)
            break
          case '6day':
            maxDays = 6
            relativeDays(moved, mover, maxDays, this.weekdays)
            break
          case 'custom-interval':
            relativeDays(moved, mover, this.maxDays, this.weekdays)
            break
          case 'month-interval':
            moved.day = limit
            mover(moved)
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
      } else {
        return false
      }
    },

    timeDurationHeight (minutes) {
      const c = this.$children[0]
      if (c && c.timeDurationHeight) {
        return c.timeDurationHeight(minutes)
      } else {
        return -1
      }
    },

    scrollToTime (time) {
      const c = this.$children[0]
      if (c && c.scrollToTime) {
        return c.scrollToTime(time)
      } else {
        return false
      }
    },

    __renderComponent (h, component, data) {
      return h(component, data)
    }
  },

  render (h) {
    const { start, end, maxDays, component } = this.renderProps

    const data = {
      staticClass: 'q-calendar',
      key: this.keyValue,
      props: {
        ...this.$props,
        start: start.date,
        end: end.date,
        maxDays
      },
      on: {
        ...this.$listeners,
        'click:date': (day) => {
          if (this.$listeners['input']) {
            this.$emit('input', day.date)
          }
          if (this.$listeners['click:date']) {
            this.$emit('click:date', day)
          }
        }
      },
      scopedSlots: this.$scopedSlots
    }

    if (this.animated === true) {
      const transition = 'q-transition--' + (this.direction === 'prev' ? this.transitionPrev : this.transitionNext)
      return h('transition', {
        props: {
          name: transition,
          appear: true
        }
      }, [
        this.__renderComponent(h, component, data)
      ])
    } else {
      return this.__renderComponent(h, component, data)
    }
  }
})
