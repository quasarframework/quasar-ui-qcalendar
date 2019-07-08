// Styles
import './calendar-daily.styl'

// Directives
import Resize from './directives/resize'

// Mixins
import CalendarIntervals from './mixins/calendar-intervals'

// Util
import { convertToUnit } from './utils/helpers'

/* @vue/component */
export default CalendarIntervals.extend({
  name: 'q-calendar-daily',

  directives: { Resize },

  data () {
    return {
      scrollWidth: 0
    }
  },

  computed: {
    classes () {
      return {
        'q-calendar-daily': true
      }
    }
  },

  mounted () {
    this.init()
  },

  watch: {
    noScroll (val) {
      if (val === true) {
        this.scrollWidth = 0
      } else {
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

    dayStyleDefault (_timestamp) {
      return undefined
    },

    __renderHead (h) {
      return h('div', {
        staticClass: 'q-calendar-daily__head',
        style: {
          marginRight: this.scrollWidth + 'px'
        }
      }, [
        this.__renderHeadIntervals(h),
        ...this.__renderHeadDays(h)
      ])
    },

    __renderHeadIntervals (h) {
      const intervalsHeader = this.$scopedSlots['intervals-header']

      let colors = new Map(), color, backgroundColor
      let updateColors = this.useDefaultTheme
      if (this.enableThemes === true) {
        color = 'colorIntervalHeader'
        backgroundColor = 'backgroundIntervalHeader'
        colors = this.getThemeColors([color, backgroundColor])
        updateColors = this.setBothColors
      }

      return h('div', updateColors(colors.get(color), colors.get(backgroundColor), {
        staticClass: 'q-calendar-daily__intervals-head q-calendar-daily__intervals-head--text'
      }), [
        intervalsHeader ? intervalsHeader(this.days) : ''
      ])
    },

    __renderHeadDays (h) {
      if (this.days.length === 1 && this.columnCount && parseInt(this.columnCount) > 1) {
        return [...Array(parseInt(this.columnCount))]
          .map((_, i) => i + parseInt(this.columnIndexStart))
          .map((idx) => this.__renderHeadDay(h, this.days[0], idx))
      } else {
        return this.days.map((day) => this.__renderHeadDay(h, day))
      }
    },

    __renderHeadDay (h, day, idx) {
      const slot = this.$scopedSlots['day-header']
      const scope = this.getScopeForSlot(day, idx)
      let dragOver

      let colors = new Map(), color, backgroundColor
      let updateColors = this.useDefaultTheme
      if (this.enableThemes === true) {
        if (day.past === true) {
          color = 'colorHeaderPast'
          backgroundColor = 'backgroundHeaderPast'
        } else if (day.current === true) {
          color = 'colorHeaderCurrent'
          backgroundColor = 'backgroundHeaderCurrent'
        } else if (day.future === true) {
          color = 'colorHeaderFuture'
          backgroundColor = 'backgroundHeaderFuture'
        }
        colors = this.getThemeColors([color, backgroundColor])
        updateColors = this.setBothColors
      }

      return h('div', updateColors(colors.get(color), colors.get(backgroundColor), {
        key: day.date + (idx !== void 0 ? `-${idx}` : ''),
        staticClass: 'q-calendar-daily__head-day',
        class: {
          ...this.getRelativeClasses(day),
          'q-calendar-daily__head-day--droppable': dragOver
        },
        domProps: {
          ondragover: (e) => {
            if (this.dragOverFunc !== void 0) {
              dragOver = this.dragOverFunc(e, day, 'day', idx)
            }
          },
          ondrop: (e) => {
            if (this.dropFunc !== void 0) {
              this.dropFunc(e, day, 'day', idx)
            }
          }
        },
        on: this.getDefaultMouseEventHandlers(':day', _event => {
          return scope
        })
      }), [
        this.columnHeaderBefore === true ? this.__renderColumnHeaderBefore(h, day, idx) : '',
        this.__renderHeadWeekday(h, day),
        this.__renderHeadDayBtn(h, day),
        this.columnHeaderAfter === true ? this.__renderColumnHeaderAfter(h, day, idx) : '',
        slot ? slot(scope) : ''
      ])
    },

    __renderHeadWeekday (h, day) {
      const colorCurrent = day.current === true ? this.color : void 0

      let colors = new Map(), color, backgroundColor
      let updateColors = this.useDefaultTheme
      if (this.enableThemes === true) {
        if (day.past === true) {
          color = 'colorDayLabelPast'
          backgroundColor = 'backgroundDayLabelPast'
        } else if (day.current === true) {
          color = 'colorDayLabelCurrent'
          backgroundColor = 'backgroundDayLabelCurrent'
        } else if (day.future === true) {
          color = 'colorDayLabelFuture'
          backgroundColor = 'backgroundDayLabelFuture'
        }
        colors = this.getThemeColors([color, backgroundColor])
        updateColors = this.setBothColors
      }

      return h('div', updateColors(colorCurrent !== void 0 ? colorCurrent : colors.get(color), colors.get(backgroundColor), {
        staticClass: 'ellipsis q-calendar-daily__head-weekday'
      }), [
        this.__renderHeadDayLabel(h, day, this.shortWeekdayLabel)
      ])
    },

    __renderHeadDayLabel (h, day, label) {
      return h('span', {
        staticClass: 'ellipsis'
      }, this.weekdayFormatter(day, label))
    },

    __renderHeadDayBtn (h, day) {
      const colorCurrent = day.current === true ? this.color : void 0

      let colors = new Map(), color, backgroundColor
      let updateColors = this.useDefaultTheme
      if (this.enableThemes === true) {
        if (day.past === true) {
          color = 'colorDayLabelPast'
          backgroundColor = 'backgroundDayLabelPast'
        } else if (day.current === true) {
          color = 'colorDayLabelCurrent'
          backgroundColor = 'backgroundDayLabelCurrent'
        } else if (day.future === true) {
          color = 'colorDayLabelFuture'
          backgroundColor = 'backgroundDayLabelFuture'
        }
        colors = this.getThemeColors([color, backgroundColor])
        updateColors = this.setBothColors
      }

      return h('q-btn', updateColors(colorCurrent !== void 0 ? colorCurrent : colors.get(color), colors.get(backgroundColor), {
        staticClass: 'q-calendar-daily__head-day-label',
        style: {
          color: day.current === true ? colorCurrent : void 0
        },
        props: {
          unelevated: true,
          round: true,
          dense: true,
          noCaps: true,
          outline: day.current === true,
          disable: day.disabled
        },
        on: this.getMouseEventHandlers({
          'click:date': { event: 'click', stop: true },
          'contextmenu:date': { event: 'contextmenu', stop: true, prevent: true, result: false }
        }, _event => day)
      }), this.dayFormatter(day, false))
    },

    __renderColumnHeaderBefore (h, day, idx) {
      const slot = this.$scopedSlots['column-header-before']
      let scope = { ...day }
      scope.index = idx
      return h('div', {
        staticClass: 'q-calendar-daily__column-header--before'
      }, [
        slot ? slot(scope) : ''
      ])
    },

    __renderColumnHeaderAfter (h, day, idx) {
      const slot = this.$scopedSlots['column-header-after']
      let scope = { ...day }
      scope.index = idx
      return h('div', {
        staticClass: 'q-calendar-daily__column-header--after'
      }, [
        slot ? slot(scope) : ''
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
      if (this.noScroll !== void 0 && this.noScroll === true) {
        return this.__renderPane(h)
      } else {
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
      return h('div', {
        staticClass: 'q-calendar-daily__day-container'
      }, [
        this.__renderBodyIntervals(h),
        ...this.__renderDays(h)
      ])
    },

    __renderDays (h) {
      if (this.days.length === 1 && this.columnCount && parseInt(this.columnCount) > 1) {
        return [...Array(parseInt(this.columnCount))]
          .map((_, i) => i + parseInt(this.columnIndexStart))
          .map((i) => this.__renderDay(h, this.days[0], 0, i))
      } else {
        return this.days.map((day, index) => this.__renderDay(h, day, index))
      }
    },

    __renderDay (h, day, dayIndex, idx) {
      const slot = this.$scopedSlots['day-body']
      const scope = this.getScopeForSlot(day, idx)

      let colors = new Map(), color, backgroundColor
      let updateColors = this.useDefaultTheme
      if (this.enableThemes === true) {
        if (day.past === true) {
          color = 'colorBodyPast'
          backgroundColor = 'backgroundBodyPast'
        } else if (day.current === true) {
          color = 'colorBodyCurrent'
          backgroundColor = 'backgroundBodyCurrent'
        } else if (day.future === true) {
          color = 'colorBodyFuture'
          backgroundColor = 'backgroundBodyFuture'
        }
        colors = this.getThemeColors([color, backgroundColor])
        updateColors = this.setBothColors
      }

      return h('div', updateColors(colors.get(color), colors.get(backgroundColor), {
        key: day.date + (idx !== void 0 ? `:${idx}` : ''),
        staticClass: 'q-calendar-daily__day',
        class: this.getRelativeClasses(day),
        on: this.getDefaultMouseEventHandlers(':time', e => {
          return this.getScopeForSlot(this.getTimestampAtEvent(e, day))
        })
      }), [
        ...this.__renderDayIntervals(h, dayIndex, idx),
        slot ? slot(scope) : ''
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
        key: interval.time,
        staticClass: 'q-calendar-daily__day-interval',
        class: {
          'q-calendar-daily__day-interval--droppable': dragOver
        },
        style: {
          height,
          ...styler(interval)
        },
        domProps: {
          ondragover: (e) => {
            if (this.dragOverFunc !== void 0) {
              dragOver = this.dragOverFunc(e, interval, 'interval')
            }
          },
          ondrop: (e) => {
            if (this.dropFunc !== void 0) {
              this.dropFunc(e, interval, 'interval')
            }
          }
        }
      }

      const children = slot ? slot(scope) : void 0

      return h('div', data, children)
    },

    __renderBodyIntervals (h) {
      let colors = new Map(), color, backgroundColor
      let updateColors = this.useDefaultTheme
      if (this.enableThemes === true) {
        color = 'colorIntervalBody'
        backgroundColor = 'backgroundIntervalBody'
        colors = this.getThemeColors([color, backgroundColor])
        updateColors = this.setBothColors
      }

      const data = {
        staticClass: 'q-calendar-daily__intervals-body',
        on: this.getDefaultMouseEventHandlers(':interval', e => {
          return this.getTimestampAtEvent(e, this.parsedStart)
        })
      }

      return h('div', updateColors(colors.get(color), colors.get(backgroundColor), data), this.__renderIntervalLabels(h))
    },

    __renderIntervalLabels (h) {
      return this.intervals[0].map((interval) => this.__renderIntervalLabel(h, interval))
    },

    __renderIntervalLabel (h, interval) {
      const height = convertToUnit(this.intervalHeight)
      const short = this.shortIntervalLabel
      const shower = this.showIntervalLabel || this.showIntervalLabelDefault
      const show = shower(interval)
      const label = show ? this.intervalFormatter(interval, short) : void 0

      let colors = new Map(), color, backgroundColor
      let updateColors = this.useDefaultTheme
      if (this.enableThemes === true) {
        color = 'colorIntervalText'
        backgroundColor = 'backgroundIntervalText'
        colors = this.getThemeColors([color, backgroundColor])
        updateColors = this.setBothColors
      }

      return h('div', {
        key: interval.time,
        staticClass: 'q-calendar-daily__interval',
        style: {
          height
        }
      }, [
        h('div', updateColors(colors.get(color), colors.get(backgroundColor), {
          staticClass: 'q-calendar-daily__interval-text'
        }), label)
      ])
    }
  },

  render (h) {
    return h('div', {
      class: this.classes,
      directives: [{
        modifiers: { quiet: true },
        name: 'resize',
        value: this.onResize
      }]
    }, [
      !this.hideHeader ? this.__renderHead(h) : '',
      this.__renderBody(h)
    ])
  }
})
