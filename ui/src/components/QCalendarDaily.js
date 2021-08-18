// Quasar
import { QBtn } from 'quasar'

// Directives
import Resize from '../directives/resize.js'

// Mixins
import CalendarIntervals from '../mixins/calendar-intervals.js'

// Util
import { convertToUnit } from '../utils/helpers.js'
import { getDateTime } from '../utils/Timestamp.js'

/* @vue/component */
export default {
  name: 'QCalendarDaily',

  mixins: [
    CalendarIntervals
  ],

  props: {
    direction: {
      type: String,
      default: 'next'
    }
  },

  directives: { Resize },

  data () {
    return {
      scrollWidth: 0
    }
  },

  computed: {
    computedWidth () {
      return 100 / this.days.length
    }
  },

  mounted () {
    this.init()
  },

  watch: {
    noScroll (val) {
      if (val === true) {
        this.scrollWidth = 0
      }
      else {
        this.$nextTick(this.onResize)
      }
    }
  },

  methods: {
    init () {
      this.$nextTick(this.onResize)
    },

    onResize () {
      this.scrollWidth = this.getScrollWidth()
    },

    getScrollWidth () {
      const area = this.$refs.scrollArea
      const pane = this.$refs.pane

      return area && pane ? (area.offsetWidth - pane.offsetWidth) : 0
    },

    __renderHead (h) {
      const component = h('div', {
        staticClass: 'q-calendar-daily__head',
        style: {
          marginRight: this.scrollWidth + 'px'
        }
      }, [
        this.__renderHeadIntervals(h),
        ...this.__renderHeadDays(h)
      ])

      if (this.animated === true) {
        const transition = 'q-transition--' + (this.direction === 'prev' ? this.transitionPrev : this.transitionNext)
        return h('transition', {
          props: {
            name: transition,
            appear: true
          }
        }, [
          component
        ])
      }
      return component
    },

    __renderHeadIntervals (h) {
      const slot = this.$scopedSlots['intervals-header']

      return h('div', {
        staticClass: 'q-calendar-daily__intervals-head q-calendar-daily__intervals-head--text',
        on: this.getDefaultMouseEventHandlers(':interval:header2', event => {
          return { scope: { days: this.days }, event }
        })
      }, [
        slot && slot(this.days)
      ])
    },

    __renderHeadDays (h) {
      if (this.days.length === 1 && this.columnCount !== undefined && parseInt(this.columnCount, 10) > 0) {
        // return [...new Array(parseInt(this.columnCount, 10))]
        return Array.apply(null, new Array(parseInt(this.columnCount, 10)))
          .map((_, i) => i + parseInt(this.columnIndexStart, 10))
          .map(idx => this.__renderHeadDay(h, this.days[0], idx))
      }
      else {
        return this.days.map(day => this.__renderHeadDay(h, day))
      }
    },

    __renderHeadDay (h, day, idx) {
      const headDaySlot = this.$scopedSlots['head-day']
      const dayHeaderSlot = this.$scopedSlots['day-header']
      const activeDate = this.noActiveDate !== true && this.value === day.date
      const scope = this.getScopeForSlot(day, idx)
      scope.activeDate = activeDate
      const width = this.computedWidth
      let dragOver

      return h('div', {
        key: day.date + (idx !== undefined ? '-' + idx : ''),
        staticClass: 'q-calendar-daily__head-day',
        class: {
          ...this.getRelativeClasses(day),
          'q-active-date': activeDate,
          'q-calendar-daily__head-day--droppable': dragOver
        },
        style: {
          maxWidth: width + '%'
        },
        domProps: {
          ondragover: (e) => {
            if (this.dragOverFunc !== undefined) {
              dragOver = this.dragOverFunc(e, day, 'day', idx)
            }
          },
          ondrop: (e) => {
            if (this.dropFunc !== undefined) {
              this.dropFunc(e, day, 'day', idx)
            }
          }
        },
        on: {
          ...this.getDefaultMouseEventHandlers(':day:header2', event => {
            return { scope, event }
          })
        }
      }, [
        headDaySlot !== undefined && headDaySlot(scope),
        headDaySlot === undefined && this.columnHeaderBefore === true && this.__renderColumnHeaderBefore(h, day, idx),
        headDaySlot === undefined && this.noDefaultHeaderText !== true && this.__renderHeadWeekday(h, day),
        headDaySlot === undefined && this.noDefaultHeaderBtn !== true && this.__renderHeadDayBtn(h, day),
        headDaySlot === undefined && dayHeaderSlot && dayHeaderSlot(scope),
        headDaySlot === undefined && this.columnHeaderAfter === true && this.__renderColumnHeaderAfter(h, day, idx)
      ])
    },

    __renderHeadWeekday (h, day) {
      const slot = this.$scopedSlots['day-header-label']
      const scope = this.getScopeForSlot(day)
      scope.shortWeekdayLabel = this.shortWeekdayLabel

      return h('div', {
        staticClass: 'ellipsis q-calendar-daily__head-weekday'
      }, [
        (slot && slot(scope)) || this.__renderHeadDayLabel(h, day, this.shortWeekdayLabel)
      ])
    },

    __renderHeadDayLabel (h, day, label) {
      return h('span', {
        staticClass: 'ellipsis'
      }, this.weekdayFormatter(day, label))
    },

    __renderHeadDayBtn (h, day) {
      const activeDate = this.noActiveDate !== true && this.value === day.date
      const dayLabel = this.dayFormatter(day, false)
      const dayLabelSlot = this.$scopedSlots['day-label']
      const dayBtnSlot = this.$scopedSlots['day-btn']
      const scope = { dayLabel, timestamp: day, activeDate }

      return dayBtnSlot
        ? dayBtnSlot(scope)
        : h(QBtn, {
          staticClass: 'q-calendar-daily__head-day-label',
          props: {
            unelevated: true,
            round: true,
            dense: true,
            noCaps: true,
            outline: day.current === true,
            disable: day.disabled
          },
          on: this.getDefaultMouseEventHandlers(':date2', event => {
            return { scope: { timestamp: day }, event }
          })
        }, [
          dayLabelSlot ? dayLabelSlot(scope) : dayLabel
        ])
    },

    __renderColumnHeaderBefore (h, day, idx) {
      const slot = this.$scopedSlots['column-header-before']
      const scope = { timestamp: day }
      scope.index = idx
      return h('div', {
        staticClass: 'q-calendar-daily__column-header--before'
      }, [
        slot && slot(scope)
      ])
    },

    __renderColumnHeaderAfter (h, day, idx) {
      const slot = this.$scopedSlots['column-header-after']
      const scope = { timestamp: day }
      scope.index = idx
      return h('div', {
        staticClass: 'q-calendar-daily__column-header--after'
      }, [
        slot && slot(scope)
      ])
    },

    __renderBody (h) {
      return h('div', {
        staticClass: 'q-calendar-daily__body'
      }, [
        this.__renderScrollArea(h)
      ])
    },

    __renderScrollArea (h) {
      if (this.noScroll !== undefined && this.noScroll === true) {
        return this.__renderPane(h)
      }
      else {
        return h('div', {
          ref: 'scrollArea',
          staticClass: 'q-calendar-daily__scroll-area'
        }, [
          this.__renderPane(h)
        ])
      }
    },

    __renderPane (h) {
      return h('div', {
        ref: 'pane',
        staticClass: 'q-calendar-daily__pane',
        style: {
          height: convertToUnit(this.bodyHeight)
        }
      }, [
        this.__renderDayContainer(h)
      ])
    },

    __renderDayContainer (h) {
      const slot = this.$scopedSlots['day-container']

      const component = h('div', {
        staticClass: 'q-calendar-daily__day-container'
      }, [
        this.__renderBodyIntervals(h),
        ...this.__renderDays(h),
        slot && slot(this.days)
      ])

      if (this.animated === true) {
        const transition = 'q-transition--' + (this.direction === 'prev' ? this.transitionPrev : this.transitionNext)
        return h('transition', {
          props: {
            name: transition,
            appear: true
          }
        }, [
          component
        ])
      }
      return component
    },

    __renderDays (h) {
      if (this.days.length === 1 && this.columnCount && parseInt(this.columnCount, 10) > 0) {
        return Array.apply(null, new Array(parseInt(this.columnCount, 10)))
          .map((_, i) => i + parseInt(this.columnIndexStart, 10))
          .map(i => this.__renderDay(h, this.days[0], 0, i))
      }
      else {
        return this.days.map((day, index) => this.__renderDay(h, day, index))
      }
    },

    __renderDay (h, day, dayIndex, idx) {
      const slot = this.$scopedSlots['day-body']
      const scope = this.getScopeForSlot(day, idx)
      const width = this.computedWidth

      return h('div', {
        key: day.date + (idx !== undefined ? ':' + idx : ''),
        staticClass: 'q-calendar-daily__day',
        class: this.getRelativeClasses(day),
        style: {
          maxWidth: width + '%'
        },
        on: {
          ...this.getDefaultMouseEventHandlers(':time2', event => {
            const scope = this.getScopeForSlot(this.getTimestampAtEvent(event, day, this.timeClicksClamped), idx)
            return { scope, event }
          })
        }
      }, [
        ...this.__renderDayIntervals(h, dayIndex, idx),
        slot && slot(scope)
      ])
    },

    __renderDayIntervals (h, index, idx) {
      return this.intervals[index].map((interval) => this.__renderDayInterval(h, interval, idx))
    },

    __renderDayInterval (h, interval, idx) {
      const height = convertToUnit(this.intervalHeight)
      const styler = this.intervalStyle || this.intervalStyleDefault
      const slot = this.$scopedSlots.interval
      const scope = this.getScopeForSlot(interval, idx)
      let dragOver

      const data = {
        key: getDateTime(interval),
        staticClass: interval.minute === 0 ? 'q-calendar-daily__day-interval' : 'q-calendar-daily__day-interval--section',
        class: {
          ...this.getIntervalClasses(interval, this.selectedDates, this.selectedStartEndDates),
          'q-calendar-daily__day-interval--droppable': dragOver
        },
        style: {
          height,
          ...styler(interval)
        },
        domProps: {
          ondragover: (e) => {
            if (this.dragOverFunc !== undefined) {
              dragOver = this.dragOverFunc(e, interval, 'interval', idx)
            }
          },
          ondrop: (e) => {
            if (this.dropFunc !== undefined) {
              this.dropFunc(e, interval, 'interval', idx)
            }
          }
        }
      }

      const children = slot ? slot(scope) : undefined

      return h('div', data, children)
    },

    __renderBodyIntervals (h) {
      const data = {
        staticClass: 'q-calendar-daily__intervals-body',
        on: {
          ...this.getDefaultMouseEventHandlers(':interval2', event => {
            const timestamp = this.getTimestampAtEvent(event, this.parsedStart, this.timeClicksClamped)
            return { scope: { timestamp }, event }
          })
        }
      }

      return h('div', data, this.__renderIntervalLabels(h))
    },

    __renderIntervalLabels (h) {
      return this.intervals[0].map((interval) => this.__renderIntervalLabel(h, interval))
    },

    __renderIntervalLabel (h, interval) {
      const height = convertToUnit(this.intervalHeight)
      const short = this.shortIntervalLabel
      const shower = this.showIntervalLabel || this.showIntervalLabelDefault
      const show = shower(interval)
      const label = show ? this.intervalFormatter(interval, short) : undefined

      return h('div', {
        key: interval.time,
        staticClass: 'q-calendar-daily__interval',
        style: {
          height
        }
      }, [
        h('div', {
          staticClass: 'q-calendar-daily__interval-text'
        }, label)
      ])
    }
  },

  render (h) {
    return h('div', {
      class: 'q-calendar-daily',
      directives: [{
        modifiers: { quiet: true },
        name: 'resize',
        value: this.onResize
      }]
    }, [
      !this.hideHeader && this.__renderHead(h),
      this.__renderBody(h)
    ])
  }
}
