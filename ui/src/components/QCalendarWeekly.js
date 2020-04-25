// Quasar
import {
  QBtn
} from 'quasar'

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

  props: props.weeks,

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
      const today = this.times.today
      const start = this.getStartOfWeek(today)
      const end = this.getEndOfWeek(today)

      return createDayList(
        start,
        end,
        today,
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
      if (this.dayPadding !== void 0) {
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

    __renderHead (h) {
      return h('div', {
        staticClass: 'q-calendar-weekly__head'
      }, [
        this.showWorkWeeks === true && this.__renderWorkWeekHead(h),
        this.__renderHeadDays(h)
      ])
    },

    __renderWorkWeekHead (h) {
      let colors = new Map(), color, backgroundColor
      let updateColors = this.useDefaultTheme
      if (this.enableTheme === true) {
        color = 'colorHeader'
        backgroundColor = 'backgroundHeader'
        colors = this.getThemeColors([color, backgroundColor])
        updateColors = this.setBothColors
      }

      return h('div', updateColors(colors.get(color), colors.get(backgroundColor), {
        staticClass: 'q-calendar-weekly__head-workweek'
      }), '#')
    },

    __renderHeadDays (h) {
      return this.todayWeek.map((day, index) => this.__renderHeadDay(h, day, index))
    },

    __renderHeadDay (h, day, index) {
      let colors = new Map(), color, backgroundColor
      let updateColors = this.useDefaultTheme
      if (this.enableTheme === true) {
        color = 'colorHeader'
        backgroundColor = 'backgroundHeader'
        colors = this.getThemeColors([color, backgroundColor])
        updateColors = this.setBothColors
      }

      return h('div', updateColors(colors.get(color), colors.get(backgroundColor), {
        key: day.date,
        staticClass: 'q-calendar-weekly__head-weekday',
        style: {
          width: 100 / this.weekdays.length + '%'
        }
      }), [
        this.__renderHeadDayLabel(h, day, this.shortWeekdayLabel || this.isMiniMode)
      ])
    },

    __renderHeadDayLabel (h, day, label) {
      const weekdayLabel = this.weekdayFormatter(day, label)
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
          }, week.map((day) => this.__renderDay(h, day))),
          slot !== void 0 ? h('div', {
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
      const slotData = { workweekLabel, week, miniMode: this.isMiniMode }
      const colorCurrent = timestamp && timestamp.current === true ? this.color : void 0
      const height = convertToUnit(this.dayHeight)
      let colors = new Map(), color, backgroundColor
      let updateColors = this.useDefaultTheme
      if (this.enableTheme === true) {
        if ((timestamp && timestamp.current === true) || day.current === true) {
          color = 'colorWorkWeekCurrent'
          backgroundColor = 'backgroundWorkWeekCurrent'
        } else if ((timestamp && timestamp.past === true) || day.past === true) {
          color = 'colorWorkWeekPast'
          backgroundColor = 'backgroundWorkWeekPast'
        } else if ((timestamp && timestamp.future === true) || day.future === true) {
          color = 'colorWorkWeekFuture'
          backgroundColor = 'backgroundWorkWeekFuture'
        }
        colors = this.getThemeColors([color, backgroundColor])
        updateColors = this.setBothColors
      }

      return h('div', updateColors(colorCurrent !== void 0 ? colorCurrent : colors.get(color), colors.get(backgroundColor), {
        key: day.workweek,
        staticClass: 'q-calendar-weekly__workweek',
        class: this.getRelativeClasses(timestamp !== false ? timestamp : day, false),
        style: {
          height: this.dayHeight && this.dayHeight > 0 ? height : 'auto'
        }
      }), slot ? slot(slotData) : workweekLabel)
    },

    __renderDay (h, day) {
      const styler = this.dayStyle || this.dayStyleDefault
      const outside = this.isOutside(day)
      const slot = this.$scopedSlots.day
      const slotData = { outside, ...day, miniMode: this.isMiniMode }
      const hasMonth = (outside === false && this.days.find(d => d.month === day.month).day === day.day && this.showMonthLabel === true)

      let dragOver

      let colors = new Map(), color, backgroundColor
      let updateColors = this.useDefaultTheme
      if (this.enableTheme === true) {
        if (outside === true) {
          color = 'colorBodyOutside'
          backgroundColor = 'backgroundBodyOutside'
        } else if (day.past === true) {
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

      const style = Object.assign({ ...this.styles }, styler(day))
      const dayClass = typeof this.dayClass === 'function' ? this.dayClass(day) : null

      return h('div', updateColors(colors.get(color), colors.get(backgroundColor), {
        key: day.date,
        staticClass: 'q-calendar-weekly__day',
        class: [
          dayClass,
          {
            ...this.getRelativeClasses(day, outside, this.isMiniMode ? void 0 : this.selectedDates),
            'q-calendar-weekly__day--droppable': dragOver
          }
        ],
        style,
        domProps: {
          ondragover: (e) => {
            if (this.dragOverFunc !== void 0) {
              dragOver = this.dragOverFunc(e, day, 'day')
            }
          },
          ondrop: (e) => {
            if (this.dropFunc !== void 0) {
              this.dropFunc(e, day, 'day')
            }
          }
        },
        on: this.getDefaultMouseEventHandlers(':day', _event => day)
      }), [
        this.__renderDayLabel(h, day),
        this.isMiniMode !== true && this.showDayOfYearLabel && !hasMonth ? this.__renderDayOfYearLabel(h, day) : '',
        this.isMiniMode !== true && hasMonth ? this.__renderDayMonth(h, day) : '',
        h('div', {
          staticClass: 'q-calendar-weekly__day--content full-width' + (this.isMiniMode === true ? ' row justify-around' : '')
        }, slot ? slot(slotData) : '')
      ])
    },

    __renderDayLabel (h, day) {
      const outside = this.isOutside(day)
      const colorCurrent = day.current === true ? this.color : void 0
      const dayLabel = this.dayFormatter(day, false)
      const slot = this.$scopedSlots['day-label']
      const slotData = { dayLabel, ...day, miniMode: this.isMiniMode }
      let colors = new Map(), color, backgroundColor
      let updateColors = this.useDefaultTheme

      const selectedDate = (
        this.isMiniMode &&
        this.selectedDates &&
        this.selectedDates.length > 0 &&
        this.selectedDates.includes(day.date)
      )
      const activeDate = this.value === day.date

      if (this.enableTheme === true) {
        if (outside === true) {
          color = 'colorDayLabelOutside'
          backgroundColor = 'backgroundDayLabelOutside'
        } else if (day.past === true) {
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

      return h(QBtn, updateColors(colorCurrent !== void 0 ? colorCurrent : colors.get(color), colors.get(backgroundColor), {
        staticClass: 'q-calendar-weekly__day-label',
        class: [
          {
            'q-selected-date': selectedDate,
            'q-active-date': this.noActiveDate !== true && activeDate
          }
        ],
        props: {
          size: this.isMiniMode ? 'sm' : this.monthLabelSize,
          unelevated: true,
          round: true,
          dense: true,
          noCaps: true,
          outline: day.current === true,
          disable: day.disabled === true || outside === true
        },
        on: this.getMouseEventHandlers({
          'click:date': { event: 'click', stop: true },
          'contextmenu:date': { event: 'contextmenu', stop: true, prevent: true, result: false }
        }, _event => day)
      }), [
        slot ? slot(slotData) : dayLabel
      ])
    },

    __renderDayOfYearLabel (h, day) {
      const color = day.current === true ? this.color : void 0
      const slot = this.$scopedSlots['day-of-year']
      const slotData = { ...day }

      return h('div', this.setTextColor(color, {
        staticClass: 'q-calendar-weekly__day-month--day-of-year'
      }), slot ? slot(slotData) : day.doy)
    },

    __renderDayMonth (h, day) {
      const color = day.current === true ? this.color : void 0
      const slot = this.$scopedSlots['month-label']
      const monthLabel = this.monthFormatter(day, this.shortMonthLabel)
      const slotData = { monthLabel, ...day, miniMode: this.isMiniMode }

      return h('div', this.setTextColor(color, {
        staticClass: 'q-calendar-weekly__day-month'
      }), slot ? slot(slotData) : this.isMiniMode !== true ? monthLabel : '')
    }
  },

  render (h) {
    return h('div', {
      staticClass: this.staticClass,
      on: {
        dragstart: (e) => {
          e.preventDefault()
        }
      }
    }, [
      !this.hideHeader && this.__renderHead(h),
      ...this.__renderWeeks(h)
    ])
  }
}
