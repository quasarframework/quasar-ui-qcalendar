// Mixins
import QCalendarDaily from './QCalendarDaily.js'

export default {
  name: 'QCalendarAgenda',

  mixins: [
    QCalendarDaily
  ],

  methods: {
    __renderHead (h) {
      return h('div', {
        staticClass: 'q-calendar-daily__head',
        style: {
          marginRight: this.scrollWidth + 'px'
        }
      }, [
        ...this.__renderHeadDays(h)
      ])
    },

    __renderPane (h) {
      return h('div', {
        ref: 'pane',
        staticClass: 'q-calendar-daily__pane',
        style: {
          // height: convertToUnit(this.bodyHeight)
        }
      }, [
        this.__renderDayContainer(h)
      ])
    },

    __renderBodyIntervals (h) {
      return void 0
    },

    __renderDayIntervals (h, index, idx) {
      return []
    },

    __renderDay (h, day, dayIndex, idx) {
      const slot = this.$scopedSlots['day-body']
      const scope = { ...day }
      const width = 100 / this.days.length
      let dragOver

      let colors = new Map(), color, backgroundColor
      let updateColors = this.useDefaultTheme
      if (this.enableTheme === true) {
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
        class: {
          ...this.getRelativeClasses(day),
          'q-calendar-daily__day--droppable': dragOver
        },
        style: {
          maxWidth: width + '%'
        },
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
        on: this.getDefaultMouseEventHandlers(':time', _event => {
          return this.getScopeForSlot(this.getTimestampAtEvent(_event, day), idx)
        })
      }), [
        ...this.__renderDayIntervals(h, dayIndex, idx),
        slot && slot(scope)
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
      !this.hideHeader && this.__renderHead(h),
      this.__renderBody(h)
    ])
  }
}
