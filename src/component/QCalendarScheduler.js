// Styles
import './calendar-scheduler.styl'

// Directives
import Resize from './directives/resize'

// Mixins
import CalendarScheduler from './mixins/calendar-scheduler'

// Util
import { convertToUnit } from './utils/helpers'

/* @vue/component */
export default CalendarScheduler.extend({
  name: 'q-calendar-scheduler',

  directives: { Resize },

  data () {
    return {
      scrollWidth: 0
    }
  },

  computed: {
    classes () {
      return {
        'q-calendar-scheduler': true
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
      return h('div', {
        staticClass: 'q-calendar-scheduler__head',
        style: {
          marginRight: this.scrollWidth + 'px'
        }
      }, [
        this.__renderHeadResources(h),
        ...this.__renderHeadDays(h)
      ])
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
        slot ? slot(this.days) : ''
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
      const slot = this.$scopedSlots['scheduler-day-header']
      const scope = this.getScopeForSlot(day, idx)
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
        on: this.getDefaultMouseEventHandlers(':day', _event => scope)
      }), [
        this.columnHeaderBefore === true ? this.__renderColumnHeaderBefore(h, day, idx) : '',
        !slot ? this.__renderHeadWeekday(h, day, idx) : '',
        !slot ? this.__renderHeadDayBtn(h, day, idx) : '',
        slot ? slot(scope) : '',
        this.columnHeaderAfter === true ? this.__renderColumnHeaderAfter(h, day, idx) : ''
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

      let scope = { day, idx }
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

      return h('q-btn', updateColors(colorCurrent !== void 0 ? colorCurrent : colors.get(color), colors.get(backgroundColor), {
        staticClass: 'q-calendar-scheduler__head-day-label',
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
      }), this.dayFormatter(day, false))
    },

    __renderColumnHeaderBefore (h, day, idx) {
      const slot = this.$scopedSlots['scheduler-column-header-before']
      let scope = { ...day }
      scope.index = idx
      return h('div', {
        staticClass: 'q-calendar-scheduler__column-header--before'
      }, [
        slot ? slot(scope) : ''
      ])
    },

    __renderColumnHeaderAfter (h, day, idx) {
      const slot = this.$scopedSlots['scheduler-column-header-after']
      let scope = { ...day }
      scope.index = idx
      return h('div', {
        staticClass: 'q-calendar-scheduler__column-header--after'
      }, [
        slot ? slot(scope) : ''
      ])
    },

    __renderBody (h) {
      return h('div', {
        staticClass: 'q-calendar-scheduler__body'
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
      if (this.days.length === 1 && this.columnCount && parseInt(this.columnCount) > 1) {
        return [...Array(parseInt(this.columnCount))]
          .map((_, i) => i + parseInt(this.columnIndexStart))
          .map((i) => this.__renderDay(h, this.days[0], 0, i))
      } else {
        return this.days.map((day, index) => this.__renderDay(h, day, index))
      }
    },

    __renderDay (h, day, idx) {
      let colors = new Map(), color, backgroundColor
      let updateColors = this.useDefaultTheme
      let resource = this.resources && this.resources[idx] ? this.resources[idx] : void 0
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
        on: this.getDefaultMouseEventHandlers(':resource:day', _event => {
          return this.getScopeForSlot(this.getTimestampAtEvent(_event, day), idx, resource)
        })
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
      style = Object.assign(style, styler(scope))

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
        }
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
          width
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
        on: this.getDefaultMouseEventHandlers(':resource', _event => scope)
      }, [
        slot ? slot(scope) : h('div', updateColors(colors.get(color), colors.get(backgroundColor), {
          staticClass: 'q-calendar-scheduler__resource-text'
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
