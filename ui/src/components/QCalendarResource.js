// Quasar
// import { QBtn } from 'quasar'

// Directives
import Resize from '../directives/resize.js'

// Mixins
import CalendarIntervals from '../mixins/calendar-intervals.js'

// Util
import props from '../utils/props'
// import {
//   // parseTime,
//   copyTimestamp,
//   createDayList,
//   updateRelative
// } from '../utils/timestamp'
import { convertToUnit } from '../utils/helpers.js'

/* @vue/component */
export default {
  name: 'QCalendarResource',

  mixins: [
    CalendarIntervals
  ],

  directives: { Resize },

  props: {
    ...props.intervals,
    ...props.resource
  },

  data () {
    return {
      minWidth: '100px',
      scrollWidth: '0'
    }
  },

  computed: {
    computedWidth () {
      // return 100 / this.days.length
      return 0
    },
    parsedResourceHeight () {
      const height = parseFloat(this.resourceHeight)
      if (height === 0) {
        return 'auto'
      }
      return height
    },

    parsedResourceWidth () {
      return parseFloat(this.resourceWidth)
    },

    parsedIntervalWidth () {
      return parseFloat(this.intervalWidth)
    },

    parsedIntervalHeight () {
      const height = parseFloat(this.intervalHeight)
      if (height === 0) {
        return 'auto'
      }
      return height

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
      // this.scrollWidth = this.getScrollWidth()
    },

    // getScrollWidth () {
    //   const area = this.$refs.scrollArea
    //   const pane = this.$refs.pane

    //   return area && pane ? (area.offsetWidth - pane.offsetWidth) : 0
    // },

    __renderHeadIntervals (h) {
      return h('div', {
        staticClass: 'q-calendar-resource__head-intervals'
      }, [
        this.intervals.map(day => day.map((interval, index) => this.__renderHeadInterval(h, interval, index)))
      ])
    },

    __renderHeadInterval (h, interval, index) {
      const width = convertToUnit(this.parsedIntervalWidth)
      const height = convertToUnit(this.parsedIntervalHeight)
      const slot = this.$scopedSlots['head-label']
      const short = this.shortIntervalLabel
      const label = this.intervalFormatter(interval, short)
      const scope = {
        interval,
        index,
        label
      }
      return slot ? slot(scope) : h('div', {
        staticClass: 'q-calendar-resource__head-label',
        style: {
          maxWidth: width,
          minWidth: width,
          height
        }
      }, label)
    },

    __renderBody (h) {
      return h('div', {
        staticClass: 'q-calendar-resource__body'
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
          staticClass: 'q-calendar-resource__scroll-area'
        }, [
          this.__renderDayContainer(h)
        ])
      }
    },

    __renderHead (h) {
      return h('div', {
        staticClass: 'q-calendar-resource__head' + (this.sticky === true ? ' q-calendar__sticky' : '')
      }, [
        this.__renderHeadResource(h),
        this.__renderHeadIntervals(h)
      ])
    },

    __renderHeadResource (h) {
      const width = convertToUnit(this.parsedResourceWidth)
      const height = convertToUnit(this.parsedIntervalHeight)

      return h('div', {
        staticClass: 'q-calendar-resource__head-resource' + (this.sticky === true ? ' q-calendar__sticky' : ''),
        style: {
          maxWidth: width,
          minWidth: width,
          height
        }
      })
    },

    __renderDayContainer (h) {
      return h('div', {
        staticClass: 'q-calendar-resource__day-container'
      }, [
        this.__renderHead(h),
        this.resources === void 0 && this.__renderResourcesError(h),
        this.resources !== void 0 && this.__renderBodyResources(h)
      ])
    },

    __renderBodyResources (h) {
      let colors = new Map(), color, backgroundColor
      let updateColors = this.useDefaultTheme
      if (this.enableTheme === true) {
        color = 'colorResourceBody'
        backgroundColor = 'backgroundResourceBody'
        colors = this.getThemeColors([color, backgroundColor])
        updateColors = this.setBothColors
      }

      const data = {
        staticClass: 'q-calendar-resource__resources-body'
      }

      return h('div', updateColors(colors.get(color), colors.get(backgroundColor), data), this.__renderResourceLabels(h))
    },

    __renderResourceLabels (h) {
      return this.resources.map((resource, idx) => this.__renderResouceRow(h, resource, idx))
    },

    __renderResouceRow (h, resource, idx) {
      return h('div', {
        staticClass: 'q-calendar-resource__resource-row'
      }, [
        this.__renderResourceLabel(h, resource, idx),
        this.__renderResourceIntervals(h)
      ])
    },

    __renderResourceLabel (h, resource, idx) {
      const slot = this.$scopedSlots['resource-resource']
      const scope = {
        resource: resource,
        index: idx
      }
      const width = convertToUnit(this.parsedResourceWidth)
      const height = convertToUnit(this.parsedResourceHeight)

      let colors = new Map(), color, backgroundColor
      let updateColors = this.useDefaultTheme
      if (this.enableTheme === true) {
        color = 'colorResourceText'
        backgroundColor = 'backgroundResourceText'
        colors = this.getThemeColors([color, backgroundColor])
        updateColors = this.setBothColors
      }

      return h('div', updateColors(colors.get(color), colors.get(backgroundColor), {
        key: resource.label,
        staticClass: 'q-calendar-resource__resource' + (this.sticky === true ? ' q-calendar__sticky' : ''),
        style: {
          maxWidth: width,
          minWidth: width,
          height
        },
        on: this.getDefaultMouseEventHandlers(':resource', event => {
          return { scope, event }
        })
      }), [
        slot ? slot(scope) : this.__renderResourceText(h, resource)
      ])
    },

    __renderResourceText (h, resource) {
      const label = resource.label

      return h('div', {
        staticClass: 'q-calendar-resource__resource-text'
      }, label)
    },

    __renderResourceIntervals (h) {
      return h('div', {
        staticClass: 'q-calendar-resource__resource-intervals'
      }, [
        this.intervals.map(day => day.map((interval, index) => this.__renderResourceInterval(h, interval, index)))
      ])
    },

    // interval related to resource
    __renderResourceInterval (h, interval, index) {
      const width = convertToUnit(this.parsedIntervalWidth)
      const height = convertToUnit(this.parsedResourceHeight)
      return h('div', {
        staticClass: 'q-calendar-resource__resource-interval',
        style: {
          maxWidth: width,
          minWidth: width,
          height
        }
      })
    },

    __renderResourcesError (h) {
      return h('div', {}, 'No resources have been defined')
    }
  },

  render (h) {
    return h('div', {
      staticClass: 'q-calendar-resource',
      directives: [{
        modifiers: { quiet: true },
        name: 'resize',
        value: this.onResize
      }]
    }, [
      this.__renderBody(h)
    ])
  }
}
