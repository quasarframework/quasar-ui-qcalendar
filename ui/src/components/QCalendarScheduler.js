// Quasar
import { QBtn } from 'quasar'

// Directives
import Resize from '../directives/resize.js'

// Mixins
import CalendarScheduler from '../mixins/calendar-scheduler.js'

// Util
import { convertToUnit } from '../utils/helpers.js'

/* @vue/component */
export default {
  name: 'QCalendarScheduler',

  mixins: [
    CalendarScheduler
  ],

  directives: { Resize },

  props: {
    direction: {
      type: String,
      default: 'next'
    }
  },

  data () {
    return {
      scrollWidth: 0
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

    resourceStartPos (resource, clamp = true) {
      const index = this.resource.indexOf(resource)
      let y = index * this.parsedResourceHeight

      if (clamp) {
        if (y < 0) {
          y = 0
        }
        if (y > this.bodyHeight) {
          y = this.bodyHeight
        }
      }

      return y
    },

    __renderHead (h) {
      const component = h('div', {
        staticClass: 'q-calendar-scheduler__head',
        style: {
          marginRight: this.scrollWidth + 'px'
        }
      }, [
        this.__renderHeadResources(h),
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

    __renderHeadResources (h) {
      const slot = this.$scopedSlots['scheduler-resources-header']
      const width = convertToUnit(this.resourceWidth)

      let colors = new Map(), color, backgroundColor
      let updateColors = this.useDefaultTheme
      if (this.enableTheme === true) {
        color = 'colorSchedulerHeader'
        backgroundColor = 'backgroundSchedulerHeader'
        colors = this.getThemeColors([color, backgroundColor])
        updateColors = this.setBothColors
      }

      return h('div', updateColors(colors.get(color), colors.get(backgroundColor), {
        staticClass: 'q-calendar-scheduler__resources-head q-calendar-scheduler__resources-head--text',
        style: {
          width
        }
      }), [
        slot && slot(this.days)
      ])
    },

    __renderHeadDays (h) {
      if (this.days.length === 1 && this.columnCount && parseInt(this.columnCount, 10) > 0) {
        return Array.apply(null, new Array(parseInt(this.columnCount, 10)))
          .map((_, i) => i + parseInt(this.columnIndexStart, 10))
          .map((idx) => this.__renderHeadDay(h, this.days[0], idx))
      } else {
        return this.days.map((day) => this.__renderHeadDay(h, day))
      }
    },

    __renderHeadDay (h, day, idx) {
      const headDaySlot = this.$scopedSlots['head-day']
      const dayHeaderSlot = this.$scopedSlots['scheduler-day-header']
      const scope = this.getScopeForSlot(day, idx)
      const width = 100 / this.days.length
      let dragOver

      let colors = new Map(), color, backgroundColor
      let updateColors = this.useDefaultTheme
      if (this.enableTheme === true) {
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
        staticClass: 'q-calendar-scheduler__head-day',
        class: {
          ...this.getRelativeClasses(day),
          'q-calendar-scheduler__head-day--droppable': dragOver
        },
        style: {
          maxWidth: width + '%'
        },
        domProps: {
          ondragover: (_event) => {
            if (this.dragOverFunc !== void 0) {
              dragOver = this.dragOverFunc(_event, day, 'day', idx)
            }
          },
          ondrop: (_event) => {
            if (this.dropFunc !== void 0) {
              this.dropFunc(_event, day, 'day', idx)
            }
          }
        },
        on: this.getDefaultMouseEventHandlers(':day', event => {
          return { scope, event }
        })
      }), [
        headDaySlot !== void 0 && headDaySlot(scope),
        headDaySlot === void 0 && this.columnHeaderBefore === true && this.__renderColumnHeaderBefore(h, day, idx),
        headDaySlot === void 0 && this.noDefaultHeaderText !== true && this.__renderHeadWeekday(h, day, idx),
        headDaySlot === void 0 && this.noDefaultHeaderBtn !== true && this.__renderHeadDayBtn(h, day, idx),
        headDaySlot === void 0 && dayHeaderSlot && dayHeaderSlot(scope),
        headDaySlot === void 0 && this.columnHeaderAfter === true && this.__renderColumnHeaderAfter(h, day, idx)
      ])
    },

    __renderHeadWeekday (h, day) {
      const colorCurrent = day.current === true ? this.color : void 0

      let colors = new Map(), color, backgroundColor
      let updateColors = this.useDefaultTheme
      if (this.enableTheme === true) {
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
        staticClass: 'ellipsis q-calendar-scheduler__head-weekday'
      }), [
        this.__renderHeadDayLabel(h, day, this.shortWeekdayLabel)
      ])
    },

    __renderHeadDayLabel (h, day, label) {
      return h('span', {
        staticClass: 'ellipsis'
      }, this.weekdayFormatter(day, label))
    },

    __renderHeadDayBtn (h, day, idx) {
      const colorCurrent = day.current === true ? this.color : void 0
      const activeDate = this.value === day.date
      const dayLabel = this.dayFormatter(day, false)
      const dayLabelSlot = this.$scopedSlots['day-label']
      const dayBtnSlot = this.$scopedSlots['day-btn']
      const scope = { timestamp: day, idx }
      const slotData = Object.assign(scope, { dayLabel, activeDate })

      let colors = new Map(), color, backgroundColor
      let updateColors = this.useDefaultTheme
      if (this.enableTheme === true) {
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

      return dayBtnSlot ? dayBtnSlot(slotData) : h(QBtn, updateColors(colorCurrent !== void 0 ? colorCurrent : colors.get(color), colors.get(backgroundColor), {
        staticClass: 'q-calendar-scheduler__head-day-label',
        class: [
          {
            'q-active-date': this.noActiveDate !== true && activeDate
          }
        ],
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
        }, _event => scope)
      }), [
        dayLabelSlot ? dayLabelSlot(slotData) : dayLabel
      ])
    },

    __renderColumnHeaderBefore (h, day, idx) {
      const slot = this.$scopedSlots['scheduler-column-header-before']
      const scope = { timestamp: day }
      scope.index = idx
      return h('div', {
        staticClass: 'q-calendar-scheduler__column-header--before'
      }, [
        slot && slot(scope)
      ])
    },

    __renderColumnHeaderAfter (h, day, idx) {
      const slot = this.$scopedSlots['scheduler-column-header-after']
      const scope = { timestamp: day }
      scope.index = idx
      return h('div', {
        staticClass: 'q-calendar-scheduler__column-header--after'
      }, [
        slot && slot(scope)
      ])
    },

    __renderBody (h) {
      const component = h('div', {
        staticClass: 'q-calendar-scheduler__body'
      }, [
        this.__renderScrollArea(h)
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

    __renderScrollArea (h) {
      if (this.noScroll !== void 0 && this.noScroll === true) {
        return this.__renderPane(h)
      } else {
        return h('div', {
          ref: 'scrollArea',
          staticClass: 'q-calendar-scheduler__scroll-area'
        }, [
          this.__renderPane(h)
        ])
      }
    },

    __renderPane (h) {
      return h('div', {
        ref: 'pane',
        staticClass: 'q-calendar-scheduler__pane',
        style: {
          height: convertToUnit(this.bodyHeight)
        }
      }, [
        this.__renderDayContainer(h)
      ])
    },

    __renderDayContainer (h) {
      return h('div', {
        staticClass: 'q-calendar-scheduler__day-container'
      }, [
        this.__renderBodyResources(h),
        ...this.__renderDays(h)
      ])
    },

    __renderDays (h) {
      if (this.days.length === 1 && this.columnCount && parseInt(this.columnCount, 10) > 0) {
        return Array.apply(null, new Array(parseInt(this.columnCount, 10)))
          .map((_, i) => i + parseInt(this.columnIndexStart, 10))
          .map((i) => this.__renderDay(h, this.days[0], 0, i))
      } else {
        return this.days.map((day, index) => this.__renderDay(h, day, index))
      }
    },

    __renderDay (h, day, idx) {
      const width = 100 / this.days.length
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
        staticClass: 'q-calendar-scheduler__day',
        class: this.getRelativeClasses(day),
        style: {
          maxWidth: width + '%'
        }
      }), [
        ...this.__renderDayResources(h, day, idx)
      ])
    },

    __renderDayResources (h, day, idx) {
      return this.resources.map((resource) => this.__renderDayResource(h, resource, day, idx))
    },

    __renderDayResource (h, resource, day, idx) {
      const height = convertToUnit(this.resourceHeight)
      const styler = this.resourceStyle || this.resourceStyleDefault
      const slot = this.$scopedSlots['scheduler-resource-day']
      const scope = this.getScopeForSlot(day, idx, resource)
      let dragOver

      let style = { height: height }
      style = Object.assign(style, styler(day))

      const data = {
        key: resource[this.resourceKey] + '-' + idx,
        staticClass: 'q-calendar-scheduler__day-resource',
        class: {
          'q-calendar-scheduler__day-resource--droppable': dragOver
        },
        style: style,
        domProps: {
          ondragover: (_event) => {
            if (this.dragOverFunc !== void 0) {
              dragOver = this.dragOverFunc(_event, resource, 'resource', idx)
            }
          },
          ondrop: (_event) => {
            if (this.dropFunc !== void 0) {
              this.dropFunc(_event, resource, 'resource', idx)
            }
          }
        },
        on: this.getDefaultMouseEventHandlers(':resource:day', event => {
          const scope = this.getScopeForSlot(this.getTimestampAtEvent(event, day), idx, resource)
          return { scope, event }
        })
      }

      const children = slot ? slot(scope) : void 0

      return h('div', data, children)
    },

    __renderBodyResources (h) {
      const width = convertToUnit(this.resourceWidth)
      let colors = new Map(), color, backgroundColor
      let updateColors = this.useDefaultTheme
      if (this.enableTheme === true) {
        color = 'colorSchedulerBody'
        backgroundColor = 'backgroundSchedulerBody'
        colors = this.getThemeColors([color, backgroundColor])
        updateColors = this.setBothColors
      }

      const data = {
        staticClass: 'q-calendar-scheduler__resources-body',
        style: {
          width: width
        }
      }

      return h('div', updateColors(colors.get(color), colors.get(backgroundColor), data), this.__renderResourceLabels(h))
    },

    __renderResourceLabels (h) {
      return this.resources.map((resource, idx) => this.__renderResourceLabel(h, resource, idx))
    },

    __renderResourceLabel (h, resource, idx) {
      const slot = this.$scopedSlots['scheduler-resource']
      const scope = {
        resource: resource,
        index: idx
      }
      const height = convertToUnit(this.resourceHeight)
      const label = resource.label

      let colors = new Map(), color, backgroundColor
      let updateColors = this.useDefaultTheme
      if (this.enableTheme === true) {
        color = 'colorSchedulerText'
        backgroundColor = 'backgroundSchedulerText'
        colors = this.getThemeColors([color, backgroundColor])
        updateColors = this.setBothColors
      }

      return h('div', {
        key: resource.label,
        staticClass: 'q-calendar-scheduler__resource',
        style: {
          height
        },
        on: this.getDefaultMouseEventHandlers(':resource', event => {
          return { scope, event }
        })
      }, [
        slot ? slot(scope) : h('div', updateColors(colors.get(color), colors.get(backgroundColor), {
          staticClass: 'q-calendar-scheduler__resource-text'
        }), label)
      ])
    },

    __renderResourcesError (h) {
      return h('div', {}, 'No resources have been defined')
    }
  },

  render (h) {
    return h('div', {
      staticClass: 'q-calendar-scheduler',
      directives: [{
        modifiers: { quiet: true },
        name: 'resize',
        value: this.onResize
      }]
    }, [
      !this.hideHeader && this.resources !== void 0 && this.__renderHead(h),
      this.resources !== void 0 && this.__renderBody(h),
      this.resources === void 0 && this.__renderResourcesError(h)
    ])
  }
}
