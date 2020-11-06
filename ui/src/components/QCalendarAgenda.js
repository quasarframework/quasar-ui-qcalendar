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
      return this.leftColumnOptions !== undefined && Array.isArray(this.leftColumnOptions)
    },

    rightColumnOptionsValid () {
      return this.rightColumnOptions !== undefined && Array.isArray(this.rightColumnOptions)
    }
  },

  methods: {
    __renderHead (h) {
      const component = h('div', {
        staticClass: 'q-calendar-daily__head',
        style: {
          marginRight: this.scrollWidth + 'px'
        }
      }, this.__renderHeadDays(h))

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

    __renderHeadDays (h) {
      if (this.days.length === 1 && this.columnCount !== undefined && parseInt(this.columnCount, 10) > 0) {
        // return [...new Array(parseInt(this.columnCount, 10))]
        return [
          Array.apply(null, new Array(parseInt(this.columnCount, 10)))
            .map((_, i) => i + parseInt(this.columnIndexStart, 10))
            .map(idx => this.__renderHeadDay(h, this.days[0], idx))
        ]
      }
      else {
        return [
          this.leftColumnOptionsValid === true && this.leftColumnOptions.map((column, _i) => this.__renderColumnHead(h, column, _i)),
          this.days.map(day => this.__renderHeadDay(h, day)),
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
      return undefined
    },

    __renderColumnHead (h, column, idx) {
      const slot = this.$scopedSlots['column-header']
      const scope = column
      const width = this.computedWidth
      let dragOver

      return h('div', {
        key: (this.columnOptionsId !== undefined ? column[this.columnOptionsId] : undefined),
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
            if (this.dragOverFunc !== undefined) {
              dragOver = this.dragOverFunc(e, column, 'column', idx)
            }
          },
          ondrop: (e) => {
            if (this.dropFunc !== undefined) {
              this.dropFunc(e, column, 'column', idx)
            }
          }
        },
        // :column:head DEPRECATED in v2.4.0
        on: this.getDefaultMouseEventHandlers2(':column:head', ':column:header2', (event, eventName) => {
          if (eventName.indexOf('2') > -1) {
            return { scope: { column, index: idx }, event }
          }
          else {
            return { scope, event }
          }
        })
        // ---
      }, [
        this.noDefaultHeaderText !== true && this.__renderHeadColumn(h, column),
        slot && slot(scope)
      ])
    },

    __renderHeadColumn (h, column) {
      const slot = this.$scopedSlots['column-header-label']
      const scope = column

      return h('div', {
        staticClass: 'ellipsis q-calendar-daily__head-weekday'
      }, [
        slot && slot(scope),
        !slot && this.__renderHeadColumnLabel(h, (this.columnOptionsLabel !== undefined ? column[this.columnOptionsLabel] : column.label))
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
      }
      else {
        return [
          this.leftColumnOptionsValid === true && this.leftColumnOptions.map((column, _i) => this.__renderColumn(h, column, _i)),
          this.days.map((day, index) => this.__renderDay(h, day, index)),
          this.rightColumnOptionsValid === true && this.rightColumnOptions.map((column, _i) => this.__renderColumn(h, column, _i))
        ]
      }
    },

    __renderColumn (h, column, idx) {
      const slot = this.$scopedSlots['column-body']
      const scope = { column, index: idx }
      const width = this.computedWidth
      let dragOver

      return h('div', {
        key: (this.columnOptionsId !== undefined ? column[this.columnOptionsId] : undefined),
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
            if (this.dragOverFunc !== undefined) {
              dragOver = this.dragOverFunc(e, column, 'column')
            }
          },
          ondrop: (e) => {
            if (this.dropFunc !== undefined) {
              this.dropFunc(e, column, 'column')
            }
          }
        },
        // :column DEPRECATED in v2.4.0
        on: this.getDefaultMouseEventHandlers2(':column', ':column2', (event, eventName) => {
          if (eventName.indexOf('2') > -1) {
            return { scope: scope, event }
          }
          else {
            return { scope, event }
          }
        })
        // ---
      }, [
        slot && slot(scope)
      ])
    },

    __renderDay (h, day, dayIndex, idx) {
      const slot = this.$scopedSlots['day-body']
      const scope = { timestamp: day }
      const width = this.computedWidth
      let dragOver

      return h('div', {
        key: day.date + (idx !== undefined ? ':' + idx : ''),
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
        // :time DEPRECATED in v2.4.0
        on: this.getDefaultMouseEventHandlers2(':time', ':time2', (event, eventName) => {
          const scope = this.getScopeForSlot(this.getTimestampAtEvent(event, day), idx)
          if (eventName.indexOf('2') > -1) {
            scope.index = idx
            return { scope, event }
          }
          else {
            return { scope, event }
          }
        })
        // ---
      }, [
        slot && slot(scope)
      ])
    }
  },

  render (h) {
    return h('div', {
      class: 'q-calendar-agenda'
    }, [
      !this.hideHeader && this.__renderHead(h),
      this.__renderBody(h)
    ])
  }
}
