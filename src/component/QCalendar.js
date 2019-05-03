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
          maxDays = 7
          break
        case 'day':
          component = QCalendarDaily
          end = relativeDays(copyTimestamp(end), nextDay, 1, this.weekdays)
          updateFormatted(end)
          maxDays = 1
          break
        case '2day':
          component = QCalendarDaily
          end = relativeDays(copyTimestamp(end), nextDay, 2, this.weekdays)
          updateFormatted(end)
          maxDays = 2
          break
        case '3day':
          component = QCalendarDaily
          end = relativeDays(copyTimestamp(end), nextDay, 3, this.weekdays)
          updateFormatted(end)
          maxDays = 3
          break
        case '4day':
          component = QCalendarDaily
          end = relativeDays(copyTimestamp(end), nextDay, 4, this.weekdays)
          updateFormatted(end)
          maxDays = 4
          break
        case '5day':
          component = QCalendarDaily
          end = relativeDays(copyTimestamp(end), nextDay, 5, this.weekdays)
          updateFormatted(end)
          maxDays = 5
          break
        case '6day':
          component = QCalendarDaily
          end = relativeDays(copyTimestamp(end), nextDay, 6, this.weekdays)
          updateFormatted(end)
          maxDays = 6
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
            relativeDays(moved, mover, 1, this.weekdays)
            break
          case '2day':
            relativeDays(moved, mover, 2, this.weekdays)
            break
          case '3day':
            relativeDays(moved, mover, 3, this.weekdays)
            break
          case '4day':
            relativeDays(moved, mover, 4, this.weekdays)
            break
          case '5day':
            relativeDays(moved, mover, 5, this.weekdays)
            break
          case '6day':
            relativeDays(moved, mover, 6, this.weekdays)
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

    if (this.animated) {
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
