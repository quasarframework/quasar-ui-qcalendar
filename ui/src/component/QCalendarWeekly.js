// Quasar
import { QBtn } from 'quasar'

// Mixins
import CalendarBase from './mixins/calendar-base'

// Util
import props from './utils/props'
import {
  createDayList,
  getDayIdentifier,
  createNativeLocaleFormatter
} from './utils/timestamp'
import { convertToUnit } from './utils/helpers'

export default {
  name: 'QCalendarWeekly',

  mixins: [
    CalendarBase
  ],

  props: props.weeks,

  computed: {
    staticClass () {
      return 'q-calendar-weekly'
    },

    parsedMinWeeks () {
      return parseInt(this.minWeeks)
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
      if (this.dayHeight > 0) {
        const height = convertToUnit(this.dayHeight)
        let style = {
          height: height
        }
        if (this.dayPadding !== void 0) {
          style['padding'] = this.dayPadding
        }
        return style
      }
      return ''
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
      const outside = this.isOutside(this.days[index])
      let colors = new Map(), color, backgroundColor
      let updateColors = this.useDefaultTheme
      if (this.enableTheme === true) {
        if (outside) {
          color = 'colorHeaderOutside'
          backgroundColor = 'backgroundHeaderOutside'
        } else {
          color = 'colorHeader'
          backgroundColor = 'backgroundHeader'
        }
        colors = this.getThemeColors([color, backgroundColor])
        updateColors = this.setBothColors
      }

      return h('div', updateColors(colors.get(color), colors.get(backgroundColor), {
        key: day.date,
        staticClass: 'ellipsis q-calendar-weekly__head-weekday',
        class: this.getRelativeClasses(day, outside)
      }), [
        this.__renderHeadDayLabel(h, day, this.shortWeekdayLabel)
      ])
    },

    __renderHeadDayLabel (h, day, label) {
      return h('span', {
        staticClass: 'ellipsis'
      }, this.weekdayFormatter(day, label))
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
      return h('div', {
        key: week[0].date,
        staticClass: 'q-calendar-weekly__week'
      }, [
        this.showWorkWeeks === true && this.__renderWorkWeekGutter(h, week),
        week.map((day) => this.__renderDay(h, day))
      ])
    },

    __renderWorkWeekGutter (h, week) {
      const slot = this.$scopedSlots.workweek
      // adjust day to account for Sunday/Monday start of week calendars
      let day = week.length > 2 ? week[2] : week[0]
      let { timestamp } = this.isCurrentWeek(week)
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

      const workweekLabel = Number(day.workweek).toLocaleString(this.locale)

      return h('div', updateColors(colorCurrent !== void 0 ? colorCurrent : colors.get(color), colors.get(backgroundColor), {
        key: day.workweek,
        staticClass: 'q-calendar-weekly__workweek',
        class: this.getRelativeClasses(timestamp !== false ? timestamp : day, false),
        style: {
          height: this.dayHeight && this.dayHeight > 0 ? height : 'auto'
        }
      }), slot ? slot({ workweekLabel, week }) : workweekLabel)
    },

    __renderDay (h, day) {
      const styler = this.dayStyle || this.dayStyleDefault
      const outside = this.isOutside(day)
      const slot = this.$scopedSlots.day
      const slotData = { outside, ...day }
      const hasMonth = day.day === 1 && this.showMonthLabel
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

      let style = { ...this.styles }
      style = Object.assign(style, styler(day))

      return h('div', updateColors(colors.get(color), colors.get(backgroundColor), {
        key: day.date,
        staticClass: 'q-calendar-weekly__day',
        class: {
          ...this.getRelativeClasses(day, outside),
          'q-calendar-weekly__day--droppable': dragOver
        },
        style: style,
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
        this.showDayOfYearLabel && !hasMonth ? this.__renderDayOfYearLabel(h, day) : '',
        hasMonth ? this.__renderDayMonth(h, day) : '',
        slot ? slot(slotData) : ''
      ])
    },

    __renderDayLabel (h, day) {
      const outside = this.isOutside(day)
      const colorCurrent = day.current === true ? this.color : void 0
      const slot = this.$scopedSlots['day-label']

      let colors = new Map(), color, backgroundColor
      let updateColors = this.useDefaultTheme
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

      const dayLabel = this.dayFormatter(day, false)

      return h(QBtn, updateColors(colorCurrent !== void 0 ? colorCurrent : colors.get(color), colors.get(backgroundColor), {
        staticClass: 'q-calendar-weekly__day-label',
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
      }), slot ? slot({ dayLabel, ...day }) : dayLabel)
    },

    __renderDayOfYearLabel (h, day) {
      const color = day.current === true ? this.color : void 0
      const slot = this.$scopedSlots['day-of-year']

      return h('div', this.setTextColor(color, {
        staticClass: 'q-calendar-weekly__day-month--day-of-year'
      }), slot ? slot(day) : day.doy)
    },

    __renderDayMonth (h, day) {
      const color = day.current === true ? this.color : void 0
      const slot = this.$scopedSlots['month-label']
      const monthLabel = this.monthFormatter(day, this.shortMonthLabel)

      return h('div', this.setTextColor(color, {
        staticClass: 'q-calendar-weekly__day-month'
      }), slot ? slot({ monthLabel, ...day }) : monthLabel)
    }
  },

  render (h) {
    return h('div', {
      staticClass: this.staticClass,
      nativeOn: {
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
