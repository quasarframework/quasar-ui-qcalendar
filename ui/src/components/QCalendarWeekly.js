// Quasar
import { QBtn } from 'quasar'

// Mixins
import CalendarBase from '../mixins/calendar-base.js'

// Util
import props from '../utils/props.js'
import {
  createDayList,
  getDayIdentifier,
  createNativeLocaleFormatter
} from '../utils/timestamp'
import { convertToUnit } from '../utils/helpers.js'

export default {
  name: 'QCalendarWeekly',

  mixins: [
    CalendarBase
  ],

  props: {
    ...props.weeks,
    direction: {
      type: String,
      default: 'next'
    }
  },

  computed: {
    staticClass () {
      return (this.isMiniMode ? ' q-calendar-mini ' : '') + 'q-calendar-weekly'
    },

    parsedMinWeeks () {
      return parseInt(this.minWeeks, 10)
    },

    days () {
      const minDays = this.parsedMinWeeks * this.weekdays.length
      const start = this.getStartOfWeek(this.parsedStart)
      const end = this.getEndOfWeek(this.parsedEnd)

      return createDayList(
        start,
        end,
        this.times.today,
        this.weekdaySkips,
        this.disabledBefore,
        this.disabledAfter,
        this.disabledWeekdays,
        this.disabledDays,
        Number.MAX_SAFE_INTEGER,
        minDays
      )
    },

    todayWeek () {
      const day = this.days[0]
      const start = this.getStartOfWeek(day)
      const end = this.getEndOfWeek(day)

      return createDayList(
        start,
        end,
        day,
        this.weekdaySkips,
        this.disabledBefore,
        this.disabledAfter,
        this.disabledWeekdays,
        this.disabledDays,
        this.weekdays.length,
        this.weekdays.length
      )
    },

    monthFormatter () {
      const longOptions = { timeZone: 'UTC', month: 'long' }
      const shortOptions = { timeZone: 'UTC', month: 'short' }

      return createNativeLocaleFormatter(
        this.locale,
        (_tms, short) => short ? shortOptions : longOptions
      )
    },

    styles () {
      const style = {}
      if (this.dayHeight > 0) {
        const height = convertToUnit(this.dayHeight)
        style.height = height
      }
      if (this.dayPadding !== undefined) {
        style.padding = this.dayPadding
      }
      style.width = 100 / this.weekdays.length + '%'
      return style
    },

    isMiniMode () {
      return this.miniMode === true ||
        (this.miniMode === 'auto' && this.$q.screen.lt[this.breakpoint])
    }
  },

  methods: {
    isOutside (day) {
      const dayIdentifier = getDayIdentifier(day)

      return dayIdentifier < getDayIdentifier(this.parsedStart) ||
             dayIdentifier > getDayIdentifier(this.parsedEnd)
    },

    isCurrentWeek (week) {
      for (let i = 0; i < week.length; ++i) {
        if (week[i].current === true) {
          return { timestamp: week[i] }
        }
      }
      return { timestamp: false }
    },

    __renderContainer (h) {
      const component = h('div', {
        staticClass: 'q-calendar-weekly__container'
      }, [
        ...this.__renderWeeks(h)
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

    __renderHead (h) {
      return h('div', {
        staticClass: 'q-calendar-weekly__head'
      }, [
        this.showWorkWeeks === true && this.__renderWorkWeekHead(h),
        this.__renderHeadDays(h)
      ])
    },

    __renderWorkWeekHead (h) {
      const slot = this.$scopedSlots['workweek-header']
      const scope = {
        start: this.parsedStart,
        end: this.parsedEnd,
        miniMode: this.isMiniMode
      }

      let colors = new Map(), color, backgroundColor
      let updateColors = this.useDefaultTheme
      if (this.enableTheme === true) {
        color = 'colorHeader'
        backgroundColor = 'backgroundHeader'
        colors = this.getThemeColors([color, backgroundColor])
        updateColors = this.setBothColors
      }

      return h('div', updateColors(colors.get(color), colors.get(backgroundColor), {
        staticClass: 'q-calendar-weekly__head-workweek',
        on: this.getDefaultMouseEventHandlers(':workweek:header2', event => {
          return { scope, event }
        })
      }), (slot ? slot({ scope }) : '#'))
    },

    __renderHeadDays (h) {
      return this.todayWeek.map((day, index) => this.__renderHeadDay(h, day, index))
    },

    __renderHeadDay (h, day, index) {
      const width = 100 / this.weekdays.length + '%'
      const headDaySlot = this.$scopedSlots['head-day']
      let colors = new Map(), color, backgroundColor
      let updateColors = this.useDefaultTheme
      if (this.enableTheme === true) {
        color = 'colorHeader'
        backgroundColor = 'backgroundHeader'
        colors = this.getThemeColors([color, backgroundColor])
        updateColors = this.setBothColors
      }
      const days = this.days.filter(day2 => day2.weekday === day.weekday)
      const scope = { timestamp: day, days, index, miniMode: this.isMiniMode }

      return h('div', updateColors(colors.get(color), colors.get(backgroundColor), {
        key: day.date,
        staticClass: 'q-calendar-weekly__head-weekday',
        style: {
          width
        },
        on: this.getDefaultMouseEventHandlers(':day:header2', event => {
          return { scope, event }
        })
      }), [
        headDaySlot === undefined && this.__renderHeadDayLabel(h, day, this.shortWeekdayLabel || this.isMiniMode),
        headDaySlot !== undefined && headDaySlot(scope)
      ])
    },

    __renderHeadDayLabel (h, day, shortWeekdayLabel) {
      const weekdayLabel = this.weekdayFormatter(day, shortWeekdayLabel)
      return h('span', {
        staticClass: 'ellipsis'
      }, this.isMiniMode === true && this.shortWeekdayLabel === true ? weekdayLabel.charAt(0) : weekdayLabel)
    },

    __renderWeeks (h) {
      const days = this.days
      const weekDays = this.weekdays.length
      const weeks = []
      for (let i = 0; i < days.length; i += weekDays) {
        weeks.push(this.__renderWeek(h, days.slice(i, i + weekDays)))
      }

      return weeks
    },

    __renderWeek (h, week) {
      const slot = this.$scopedSlots.week
      const weekdays = this.weekdays
      const slotData = { week, weekdays, miniMode: this.isMiniMode }
      const height = convertToUnit(this.dayHeight)
      return h('div', {
        key: week[0].date,
        staticClass: 'q-calendar-weekly__week--wrapper',
        style: {
          height: this.dayHeight && this.dayHeight > 0 ? height : (this.isMiniMode ? 'auto' : 'auto')
        }
      }, [
        this.showWorkWeeks === true && this.__renderWorkWeekGutter(h, week),
        h('div', {
          key: week[0].date,
          staticClass: 'q-calendar-weekly__week'
        }, [
          h('div', {
            staticClass: 'q-calendar-weekly__week-days'
          }, week.map(day => this.__renderDay(h, day))),
          slot !== undefined ? h('div', {
            staticClass: 'q-calendar-weekly__week-events'
          }, slot(slotData)) : ''
        ])
      ])
    },

    __renderWorkWeekGutter (h, week) {
      const slot = this.$scopedSlots.workweek
      // adjust day to account for Sunday/Monday start of week calendars
      const day = week.length > 2 ? week[2] : week[0]
      const { timestamp } = this.isCurrentWeek(week)
      const workweekLabel = Number(day.workweek).toLocaleString(this.locale)
      const scope = { workweekLabel, week, miniMode: this.isMiniMode }
      const colorCurrent = timestamp && timestamp.current === true ? this.color : undefined
      const height = convertToUnit(this.dayHeight)
      let colors = new Map(), color, backgroundColor
      let updateColors = this.useDefaultTheme
      if (this.enableTheme === true) {
        if ((timestamp && timestamp.current === true) || day.current === true) {
          color = 'colorWorkWeekCurrent'
          backgroundColor = 'backgroundWorkWeekCurrent'
        }
        else if ((timestamp && timestamp.past === true) || day.past === true) {
          color = 'colorWorkWeekPast'
          backgroundColor = 'backgroundWorkWeekPast'
        }
        else if ((timestamp && timestamp.future === true) || day.future === true) {
          color = 'colorWorkWeekFuture'
          backgroundColor = 'backgroundWorkWeekFuture'
        }
        colors = this.getThemeColors([color, backgroundColor])
        updateColors = this.setBothColors
      }

      return h('div', updateColors(colorCurrent !== undefined ? colorCurrent : colors.get(color), colors.get(backgroundColor), {
        key: day.workweek,
        staticClass: 'q-calendar-weekly__workweek',
        class: this.getRelativeClasses(timestamp !== false ? timestamp : day, false),
        style: {
          height: this.dayHeight && this.dayHeight > 0 ? height : 'auto'
        },
        // :workweek DEPRECATED in v2.4.0
        on: this.getDefaultMouseEventHandlers2(':workweek', ':workweek2', event => {
          return { scope, event }
        })
        // ---
      }), slot ? slot(scope) : workweekLabel)
    },

    __renderDay (h, day) {
      const styler = this.dayStyle || this.dayStyleDefault
      const outside = this.isOutside(day)
      const slot = this.$scopedSlots.day
      const scope = { outside, timestamp: day, miniMode: this.isMiniMode }
      const hasMonth = (outside === false && this.days.find(d => d.month === day.month).day === day.day && this.showMonthLabel === true)

      let dragOver

      let colors = new Map(), color, backgroundColor
      let updateColors = this.useDefaultTheme
      if (this.enableTheme === true) {
        if (outside === true) {
          color = 'colorBodyOutside'
          backgroundColor = 'backgroundBodyOutside'
        }
        else if (day.past === true) {
          color = 'colorBodyPast'
          backgroundColor = 'backgroundBodyPast'
        }
        else if (day.current === true) {
          color = 'colorBodyCurrent'
          backgroundColor = 'backgroundBodyCurrent'
        }
        else if (day.future === true) {
          color = 'colorBodyFuture'
          backgroundColor = 'backgroundBodyFuture'
        }
        colors = this.getThemeColors([color, backgroundColor])
        updateColors = this.setBothColors
      }

      const style = Object.assign({ ...this.styles }, styler(day))
      const dayClass = typeof this.dayClass === 'function' ? this.dayClass(day) : null

      return h('div', updateColors(colors.get(color), colors.get(backgroundColor), {
        key: day.date,
        staticClass: 'q-calendar-weekly__day',
        class: [
          dayClass,
          {
            ...this.getRelativeClasses(day, outside, this.isMiniMode ? undefined : this.selectedDates),
            'q-calendar-weekly__day--droppable': dragOver
          }
        ],
        style,
        domProps: {
          ondragover: (e) => {
            if (this.dragOverFunc !== undefined) {
              dragOver = this.dragOverFunc(e, day, 'day')
            }
          },
          ondrop: (e) => {
            if (this.dropFunc !== undefined) {
              this.dropFunc(e, day, 'day')
            }
          }
        },
        // :day DEPRECATED in v2.4.0
        on: this.getDefaultMouseEventHandlers2(':day', ':day2', event => {
          return { scope, event }
        })
        // ---
      }), [
        this.__renderDayLabel(h, day),
        this.isMiniMode !== true && this.showDayOfYearLabel && !hasMonth ? this.__renderDayOfYearLabel(h, day) : '',
        this.isMiniMode !== true && hasMonth ? this.__renderDayMonth(h, day) : '',
        h('div', {
          staticClass: 'q-calendar-weekly__day--content full-width' + (this.isMiniMode === true ? ' row justify-around' : '')
        }, slot ? slot(scope) : '')
      ])
    },

    __renderDayLabel (h, day) {
      const outside = this.isOutside(day)

      // return if outside days are hidden
      if (outside === true && this.hideOutsideDays === true) {
        return
      }

      const colorCurrent = day.current === true ? this.color : undefined
      const dayLabel = this.dayFormatter(day, false)
      const dayLabelSlot = this.$scopedSlots['day-label']
      const dayBtnSlot = this.$scopedSlots['day-btn']

      const selectedDate = (
        this.isMiniMode &&
        this.selectedDates &&
        this.selectedDates.length > 0 &&
        this.selectedDates.includes(day.date)
      )

      const activeDate = this.noActiveDate !== true && this.value === day.date

      const slotData = { dayLabel, timestamp: day, outside, selectedDate, activeDate, miniMode: this.isMiniMode }

      let colors = new Map(), color, backgroundColor
      let updateColors = this.useDefaultTheme

      if (this.enableTheme === true) {
        if (outside === true) {
          color = 'colorDayLabelOutside'
          backgroundColor = 'backgroundDayLabelOutside'
        }
        else if (day.past === true) {
          color = 'colorDayLabelPast'
          backgroundColor = 'backgroundDayLabelPast'
        }
        else if (day.current === true) {
          color = 'colorDayLabelCurrent'
          backgroundColor = 'backgroundDayLabelCurrent'
        }
        else if (day.future === true) {
          color = 'colorDayLabelFuture'
          backgroundColor = 'backgroundDayLabelFuture'
        }
        colors = this.getThemeColors([color, backgroundColor])
        updateColors = this.setBothColors
      }

      return dayBtnSlot ? dayBtnSlot(slotData) : h(QBtn, updateColors(colorCurrent !== undefined ? colorCurrent : colors.get(color), colors.get(backgroundColor), {
        staticClass: 'q-calendar-weekly__day-label' +
          (activeDate === true ? ' q-active-date' : '') +
          (selectedDate === true ? ' q-selected-date' : ''),
        props: {
          size: this.isMiniMode ? 'sm' : this.monthLabelSize,
          unelevated: true,
          round: true,
          dense: true,
          noCaps: true,
          outline: day.current === true,
          disable: day.disabled === true || (outside === true && this.enableOutsideDays !== true)
        },
        on: {
          ...this.getMouseEventHandlers({
            // DEPRECATED in v2.4.0
            'click:date': { event: 'click', stop: true },
            'contextmenu:date': { event: 'contextmenu', stop: true, prevent: true, result: false },
            // ---
            'click:date2': { event: 'click', stop: true },
            'contextmenu:date2': { event: 'contextmenu', stop: true, prevent: true, result: false }
          }, (event, eventName) => {
            if (eventName.indexOf('2') > -1) {
              return { scope: { timestamp: day }, event }
            }
            // DEPRECATED in v2.4.0
            else {
              return day
            }
            // ---
          })
        }
      }), [
        dayLabelSlot ? dayLabelSlot(slotData) : dayLabel
      ])
    },

    __renderDayOfYearLabel (h, day) {
      const color = day.current === true ? this.color : undefined
      const slot = this.$scopedSlots['day-of-year']
      const slotData = { timestamp: day }

      return h('div', this.setTextColor(color, {
        staticClass: 'q-calendar-weekly__day-month--day-of-year'
      }), slot ? slot(slotData) : day.doy)
    },

    __renderDayMonth (h, day) {
      const color = day.current === true ? this.color : undefined
      const slot = this.$scopedSlots['month-label']
      const monthLabel = this.monthFormatter(day, this.shortMonthLabel)
      const slotData = { monthLabel, timestamp: day, miniMode: this.isMiniMode }

      return h('div', this.setTextColor(color, {
        staticClass: 'q-calendar-weekly__day-month'
      }), slot ? slot(slotData) : this.isMiniMode !== true ? monthLabel : '')
    }
  },

  render (h) {
    return h('div', {
      class: this.staticClass,
      on: {
        dragstart: (e) => {
          e.preventDefault()
        }
      }
    }, [
      !this.hideHeader && this.__renderHead(h),
      this.__renderContainer(h)
    ])
  }
}
