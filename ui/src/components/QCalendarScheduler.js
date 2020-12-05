// Quasar
import { QBtn, QIcon } from 'quasar'

// Directives
import Resize from '../directives/resize.js'

// Mixins
import CalendarScheduler from '../mixins/calendar-scheduler.js'

// Util
import { convertToUnit } from '../utils/helpers.js'

// Icons
const mdiMenuRight = 'M10,17L15,12L10,7V17Z'
const mdiMenuDown = 'M7,10L12,15L17,10H7Z'

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

  created () {
    this.mdiMenuRight = mdiMenuRight
    this.mdiMenuDown = mdiMenuDown
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

  computed: {
    isSticky () {
      return this.cellWidth !== undefined
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
        staticClass: 'q-calendar-scheduler__head' + (this.isSticky === true ? ' q-calendar__sticky' : ''),
        style: {
          marginRight: this.scrollWidth + 'px'
        }
      }, [
        this.__renderHeadResources(h),
        this.__renderHeadDaysWrapper(h)
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
      const width = convertToUnit(this.parsedResourceWidth)

      const scope = {
        days: this.days,
        resources: this.resources
      }

      return h('div', {
        staticClass: 'q-calendar-scheduler__resource-head' + (this.isSticky === true ? ' q-calendar__sticky' : ''),
        style: {
          minWidth: width,
          maxWidth: width
        },
        on: this.getDefaultMouseEventHandlers(':resource:header2', event => {
          return { scope, event }
        })
      }, [
        slot && slot(this.days)
      ])
    },

    __renderHeadDaysWrapper (h) {
      return h('div', {
        staticClass: 'q-calendar-scheduler__head-days-body'
      }, [
        ...this.__renderHeadDays(h)
      ])
    },

    __renderHeadDays (h) {
      if (this.days.length === 1 && this.columnCount && parseInt(this.columnCount, 10) > 0) {
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
      const dayHeaderSlot = this.$scopedSlots['scheduler-day-header']
      const activeDate = this.noActiveDate !== true && this.value === day.date
      const scope = this.getScopeForSlot(day, idx)
      scope.activeDate = activeDate
      const width = this.isSticky === true ? this.cellWidth : 100 / this.days.length + '%'
      let dragOver

      return h('div', {
        key: day.date + (idx !== undefined ? ':' + idx : ''),
        staticClass: 'q-calendar-scheduler__head-day',
        class: {
          ...this.getRelativeClasses(day),
          'q-active-date': activeDate,
          'q-calendar-scheduler__head-day--droppable': dragOver
        },
        style: {
          minWidth: width,
          maxWidth: width
        },
        domProps: {
          ondragover: (_event) => {
            if (this.dragOverFunc !== undefined) {
              dragOver = this.dragOverFunc(_event, day, 'day', idx)
            }
          },
          ondrop: (_event) => {
            if (this.dropFunc !== undefined) {
              this.dropFunc(_event, day, 'day', idx)
            }
          }
        },
        on: this.getDefaultMouseEventHandlers(':day:header2', event => {
          return { scope, event }
        })
      }, [
        headDaySlot !== undefined && headDaySlot(scope),
        headDaySlot === undefined && this.columnHeaderBefore === true && this.__renderColumnHeaderBefore(h, day, idx),
        headDaySlot === undefined && this.noDefaultHeaderText !== true && this.__renderHeadWeekday(h, day, idx),
        headDaySlot === undefined && this.noDefaultHeaderBtn !== true && this.__renderHeadDayBtn(h, day, idx),
        headDaySlot === undefined && dayHeaderSlot && dayHeaderSlot(scope),
        headDaySlot === undefined && this.columnHeaderAfter === true && this.__renderColumnHeaderAfter(h, day, idx)
      ])
    },

    __renderHeadWeekday (h, day) {
      return h('div', {
        staticClass: 'ellipsis q-calendar-scheduler__head-weekday'
      }, [
        this.__renderHeadDayLabel(h, day, this.shortWeekdayLabel)
      ])
    },

    __renderHeadDayLabel (h, day, label) {
      return h('span', {
        staticClass: 'ellipsis'
      }, this.weekdayFormatter(day, label))
    },

    __renderHeadDayBtn (h, day, idx) {
      const activeDate = this.noActiveDate !== true && this.value === day.date
      const dayLabel = this.dayFormatter(day, false)
      const dayLabelSlot = this.$scopedSlots['day-label']
      const dayBtnSlot = this.$scopedSlots['day-btn']
      const scope = { timestamp: day, index: idx, dayLabel, activeDate }

      return dayBtnSlot ? dayBtnSlot(scope) : h(QBtn, {
        staticClass: 'q-calendar-scheduler__head-day-label',
        props: {
          unelevated: true,
          round: true,
          dense: true,
          noCaps: true,
          outline: day.current === true,
          disable: day.disabled
        },
        on: {
          ...this.getMouseEventHandlers({
            'click:date2': { event: 'click', stop: true },
            'contextmenu:date2': { event: 'contextmenu', stop: true, prevent: true, result: false }
          }, (event, eventName) => {
            return { scope, event }
          })
        }
      }, [
        dayLabelSlot ? dayLabelSlot(scope) : dayLabel
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
      if (this.noScroll !== undefined && this.noScroll === true) {
        return this.__renderPane(h)
      }
      else {
        return h('div', {
          ref: 'scrollArea',
          staticClass: 'q-calendar-scheduler__scroll-area'
        }, [
          this.isSticky !== true && this.__renderPane(h),
          this.isSticky === true && this.__renderDayContainer(h)
        ])
      }
    },

    __renderPane (h) {
      return h('div', {
        ref: 'pane',
        staticClass: 'q-calendar-scheduler__pane',
        style: {
          height: this.resourceHeight === 0 ? 'auto' : convertToUnit(this.bodyHeight)
        }
      }, [
        this.__renderDayContainer(h)
      ])
    },

    __renderDayContainer (h) {
      return h('div', {
        staticClass: 'q-calendar-scheduler__day-container'
      }, [
        this.isSticky === true && this.__renderHead(h),
        h('div', {
          staticClass: ''
        }, [
          this.__renderResources(h)
        ])
      ])
    },

    __renderResources (h, resources = undefined, indentLevel = 0) {
      if (resources === undefined) {
        resources = this.resources
      }
      return resources.map((resource, idx) => {
        return this.__renderResourceRow(h, resource, idx, indentLevel)
      })
    },

    __renderResourceRow (h, resource, idx, indentLevel = 0) {
      const height = resource.height !== void 0 ? convertToUnit(resource.height) : convertToUnit(this.parsedResourceHeight)
      const style = { height: height }
      const resourceRow = h('div', {
        staticClass: 'q-calendar-scheduler__resource-row',
        style
      }, [
        this.__renderResource(h, resource, idx, indentLevel),
        this.__renderBodyResources(h, resource, idx, indentLevel)
      ])
      if (resource.expanded === true) {
        return [resourceRow, ...this.__renderResources(h, resource.children, indentLevel + 1)]
      }

      return [resourceRow]
    },

    __renderResource (h, resource, idx, indentLevel = 0) {
      return this.__renderResourceLabel(h, resource, idx, indentLevel)
    },

    __renderBodyResources (h, resource, idx, indentLevel = 0) {
      const width = convertToUnit(this.parsedResourceWidth)

      const data = {
        staticClass: 'q-calendar-scheduler__resources-body',
        style: {
          width
        }
      }

      return h('div', data,
        [
          ...this.__renderDays(h, resource, idx)
        ])
    },

    __renderDays (h, resource, idx) {
      if (this.days.length === 1 && this.columnCount && parseInt(this.columnCount, 10) > 0) {
        return Array.apply(null, new Array(parseInt(this.columnCount, 10)))
          .map((_, i) => i + parseInt(this.columnIndexStart, 10))
          .map(i => this.__renderDay(h, resource, this.days[0], i))
      }
      else {
        return this.days.map((day, index) => this.__renderDay(h, resource, day, index, idx))
      }
    },

    __renderDay (h, resource, day, idx, resourceIndex) {
      const width = this.isSticky === true ? this.cellWidth : 100 / this.days.length + '%'
      const key = day.date + (resourceIndex !== undefined ? ':' + resourceIndex : '') + (idx !== undefined ? ':' + idx : '')

      return h('div', {
        key,
        staticClass: 'q-calendar-scheduler__day',
        class: this.getRelativeClasses(day),
        style: {
          minWidth: width,
          maxWidth: width
        }
      }, [
        this.__renderDayResource(h, resource, day, idx, resourceIndex)
      ])
    },

    __renderDayResource (h, resource, day, idx, resourceIndex) {
      const styler = this.resourceStyle || this.resourceStyleDefault
      const slot = this.$scopedSlots['scheduler-resource-day']
      const scope = this.getScopeForSlot(day, idx, resource)
      const key = day.date + (resourceIndex !== undefined ? ':' + resourceIndex : '') + (idx !== undefined ? ':' + idx : '')
      let dragOver

      const style = styler({ timestamp: day, index: resourceIndex, resource })

      const data = {
        key,
        staticClass: 'q-calendar-scheduler__day-resource',
        class: {
          'q-calendar-scheduler__day-resource--droppable': dragOver
        },
        style,
        domProps: {
          ondragover: (_event) => {
            if (this.dragOverFunc !== undefined) {
              dragOver = this.dragOverFunc(_event, resource, 'resource', resourceIndex)
            }
          },
          ondrop: (_event) => {
            if (this.dropFunc !== undefined) {
              this.dropFunc(_event, resource, 'resource', resourceIndex)
            }
          }
        },
        on: this.getDefaultMouseEventHandlers(':resource:day2', event => {
          const scope = this.getScopeForSlot(this.getTimestampAtEvent(event, day, this.timeClicksClamped), resourceIndex, resource)
          return { scope, event }
        })
      }

      const children = slot ? slot(scope) : undefined

      return h('div', data, children)
    },

    __renderResourceLabel (h, resource, idx, indentLevel = 0) {
      const slot = this.$scopedSlots['scheduler-resource']
      const scope = {
        resource: resource,
        index: idx,
        days: this.days
      }
      const width = convertToUnit(this.parsedResourceWidth)
      const label = resource[this.resourceKey]
      if (label === undefined) {
        /* eslint-disable-next-line */
        console.warn('QCalendarScheduler: resource object requires "resource-key" property to contain resource object key')
      }

      return h('div', {
        key: label + (idx !== undefined ? ':' + idx : ''),
        staticClass: 'q-calendar-scheduler__resource' + (this.isSticky === true ? ' q-calendar__sticky' : ''),
        style: {
          maxWidth: width,
          minWidth: width,
          height: '100%',
          paddingLeft: (10 * indentLevel + 2) + 'px'
        },
        on: this.getDefaultMouseEventHandlers(':resource2', event => {
          return { scope, event }
        })
      }, [
        slot ? slot(scope) : h('div', {
          staticClass: 'q-calendar-scheduler__resource-text'
        }, [
          resource.children && resource.children.length > 0 && h(QIcon, {
            props: {
              name: (resource.expanded === true ? this.mdiMenuDown : this.mdiMenuRight),
              size: 'md'
            },
            on: {
              click: (e) => {
                resource.expanded = !resource.expanded
                e.stopPropagation()
                this.$emit('expanded', resource)
              }
            }
          }),
          label
        ])
      ])
    },

    __renderResourcesError (h) {
      return h('div', {}, 'No resources have been defined')
    }
  },

  render (h) {
    return h('div', {
      class: 'q-calendar-scheduler',
      directives: [{
        modifiers: { quiet: true },
        name: 'resize',
        value: this.onResize
      }]
    }, [
      this.isSticky !== true && this.hideHeader !== true && this.resources !== undefined && this.__renderHead(h),
      this.resources !== undefined && this.__renderBody(h),
      this.resources === undefined && this.__renderResourcesError(h)
    ])
  }
}
