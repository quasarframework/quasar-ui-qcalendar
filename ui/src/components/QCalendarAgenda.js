// Mixins
import QCalendarDaily from './QCalendarDaily.js'

// Util
import props from '../utils/props.js'

export default {
  name: 'QCalendarAgenda',

  mixins: [
    QCalendarDaily
  ],

  props: {
    ...props.agenda
  },

  computed: {
    computedColumnCount () {
      return this.days.length +
        (this.leftColumnOptionsValid === true ? this.leftColumnOptions.length : 0) +
        (this.rightColumnOptionsValid === true ? this.rightColumnOptions.length : 0)
    },

    computedWidth () {
      return 100 / this.computedColumnCount
    },

    leftColumnOptionsValid () {
      return this.leftColumnOptions !== void 0 && Array.isArray(this.leftColumnOptions)
    },

    rightColumnOptionsValid () {
      return this.rightColumnOptions !== void 0 && Array.isArray(this.rightColumnOptions)
    }
  },

  methods: {
    __renderHead (h) {
      return h('div', {
        staticClass: 'q-calendar-daily__head',
        style: {
          marginRight: this.scrollWidth + 'px'
        }
      }, this.__renderHeadDays(h))
    },

    __renderHeadDays (h) {
      if (this.days.length === 1 && this.columnCount !== void 0 && parseInt(this.columnCount, 10) > 0) {
        // return [...new Array(parseInt(this.columnCount, 10))]
        return [
          Array.apply(null, new Array(parseInt(this.columnCount, 10)))
            .map((_, i) => i + parseInt(this.columnIndexStart, 10))
            .map((idx) => this.__renderHeadDay(h, this.days[0], idx))
        ]
      } else {
        return [
          this.leftColumnOptionsValid === true && this.leftColumnOptions.map((column, _i) => this.__renderColumnHead(h, column, _i)),
          this.days.map((day) => this.__renderHeadDay(h, day)),
          this.rightColumnOptionsValid === true && this.rightColumnOptions.map((column, _i) => this.__renderColumnHead(h, column, _i))
        ]
      }
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

    __renderColumnHead (h, column, idx) {
      const slot = this.$scopedSlots['column-header']
      const scope = column
      const width = this.computedWidth
      let dragOver

      let colors = new Map(), color, backgroundColor
      let updateColors = this.useDefaultTheme
      if (this.enableTheme === true) {
      //   if (day.past === true) {
      //     color = 'colorHeaderPast'
      //     backgroundColor = 'backgroundHeaderPast'
      //   } else if (day.current === true) {
      //     color = 'colorHeaderCurrent'
      //     backgroundColor = 'backgroundHeaderCurrent'
      //   } else if (day.future === true) {
      //     color = 'colorHeaderFuture'
      //     backgroundColor = 'backgroundHeaderFuture'
      //   }
        colors = this.getThemeColors([color, backgroundColor])
        updateColors = this.setBothColors
      }

      return h('div', updateColors(colors.get(color), colors.get(backgroundColor), {
        key: (this.columnOptionsId !== void 0 ? column[this.columnOptionsId] : column.id) + (idx !== void 0 ? `-${idx}` : ''),
        staticClass: 'q-calendar-daily__head-day',
        class: {
          'q-column-day': true,
          'q-calendar-daily__head-day--droppable': dragOver
        },
        style: {
          maxWidth: width + '%'
        },
        domProps: {
          ondragover: (e) => {
            if (this.dragOverFunc !== void 0) {
              dragOver = this.dragOverFunc(e, column, 'column', idx)
            }
          },
          ondrop: (e) => {
            if (this.dropFunc !== void 0) {
              this.dropFunc(e, column, 'column', idx)
            }
          }
        },
        on: this.getDefaultMouseEventHandlers(':column:head', _event => {
          return scope
        })
      }), [
        this.noDefaultHeaderText !== true && this.__renderHeadColumn(h, column),
        slot && slot(scope)
      ])
    },

    __renderHeadColumn (h, column) {
      const slot = this.$scopedSlots['column-header-label']
      const scope = column
      // const colorCurrent = day.current === true ? this.color : void 0

      let colors = new Map(), color, backgroundColor
      let updateColors = this.useDefaultTheme
      if (this.enableTheme === true) {
      //   if (day.past === true) {
      //     color = 'colorDayLabelPast'
      //     backgroundColor = 'backgroundDayLabelPast'
      //   } else if (day.current === true) {
      //     color = 'colorDayLabelCurrent'
      //     backgroundColor = 'backgroundDayLabelCurrent'
      //   } else if (day.future === true) {
      //     color = 'colorDayLabelFuture'
      //     backgroundColor = 'backgroundDayLabelFuture'
      //   }
        colors = this.getThemeColors([color, backgroundColor])
        updateColors = this.setBothColors
      }

      return h('div', updateColors(colors.get(color), colors.get(backgroundColor), {
        staticClass: 'ellipsis q-calendar-daily__head-weekday'
      }), [
        slot && slot(scope),
        !slot && this.__renderHeadColumnLabel(h, (this.columnOptionsLabel !== void 0 ? column[this.columnOptionsLabel] : column.label))
      ])
    },

    __renderHeadColumnLabel (h, label) {
      return h('span', {
        staticClass: 'ellipsis'
      }, label)
    },

    __renderDays (h) {
      if (this.days.length === 1 && this.columnCount && parseInt(this.columnCount, 10) > 0) {
        return [
          Array.apply(null, new Array(parseInt(this.columnCount, 10)))
            .map((_, i) => i + parseInt(this.columnIndexStart, 10))
            .map((i) => this.__renderDay(h, this.days[0], 0, i))
        ]
      } else {
        return [
          this.leftColumnOptionsValid === true && this.leftColumnOptions.map((column, _i) => this.__renderColumn(h, column, _i)),
          this.days.map((day, index) => this.__renderDay(h, day, index)),
          this.rightColumnOptionsValid === true && this.rightColumnOptions.map((column, _i) => this.__renderColumn(h, column, _i))
        ]
      }
    },

    __renderColumn (h, column, idx) {
      const slot = this.$scopedSlots['column-body']
      const scope = column
      const width = this.computedWidth
      let dragOver

      let colors = new Map(), color, backgroundColor
      let updateColors = this.useDefaultTheme
      if (this.enableTheme === true) {
      //   if (day.past === true) {
      //     color = 'colorBodyPast'
      //     backgroundColor = 'backgroundBodyPast'
      //   } else if (day.current === true) {
      //     color = 'colorBodyCurrent'
      //     backgroundColor = 'backgroundBodyCurrent'
      //   } else if (day.future === true) {
      //     color = 'colorBodyFuture'
      //     backgroundColor = 'backgroundBodyFuture'
      //   }
        colors = this.getThemeColors([color, backgroundColor])
        updateColors = this.setBothColors
      }

      return h('div', updateColors(colors.get(color), colors.get(backgroundColor), {
        key: (this.columnOptionsId !== void 0 ? column[this.columnOptionsId] : column.id) + '-body-' + (idx !== void 0 ? `:${idx}` : ''),
        staticClass: 'q-calendar-daily__day',
        class: {
          'q-column-day': true,
          'q-calendar-daily__day--droppable': dragOver
        },
        style: {
          maxWidth: width + '%'
        },
        domProps: {
          ondragover: (e) => {
            if (this.dragOverFunc !== void 0) {
              dragOver = this.dragOverFunc(e, column, 'column')
            }
          },
          ondrop: (e) => {
            if (this.dropFunc !== void 0) {
              this.dropFunc(e, column, 'column')
            }
          }
        },
        on: this.getDefaultMouseEventHandlers(':column', _event => {
          return scope
        })
      }), [
        slot && slot(scope)
      ])
    },

    __renderDay (h, day, dayIndex, idx) {
      const slot = this.$scopedSlots['day-body']
      const scope = { ...day }
      const width = this.computedWidth
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
