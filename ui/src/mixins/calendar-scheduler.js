// Mixins
import CalendarBase from './calendar-base'

// Util
import props from '../utils/props'
import {
  // parseTime,
  copyTimestamp,
  createDayList,
  updateRelative
} from '../utils/timestamp'

export default {
  name: 'CalendarWithScheduler',

  mixins: [
    CalendarBase
  ],

  props: {
    ...props.scheduler
  },

  computed: {
    parsedResourceHeight () {
      return parseFloat(this.resourceHeight)
    },

    parsedResourceWidth () {
      return parseFloat(this.resourceWidth)
    },

    bodyHeight () {
      if (this.resources && this.resources.length > 0) {
        let bodyHeight = 0
        for (let i = 0; i < this.resources.length; i++) {
          bodyHeight += this.getResourceHeight(this.resources[i])
        }
        return bodyHeight
      }
      return 0
    },

    days () {
      return createDayList(
        this.parsedStart,
        this.parsedEnd,
        this.times.today,
        this.weekdaySkips,
        this.disabledBefore,
        this.disabledAfter,
        this.disabledWeekdays,
        this.disabledDays,
        this.maxDays
      )
    }
  },

  methods: {
    resourceStyleDefault (_timestamp) {
      return undefined
    },

    getTimestampAtEvent (e, day) {
      const timestamp = copyTimestamp(day)
      return updateRelative(timestamp, this.times.now, false)
    },

    getScopeForSlot (timestamp, idx, resource) {
      const scope = { timestamp: copyTimestamp(timestamp) }
      if (idx !== void 0) {
        scope.index = idx
      }
      if (resource !== void 0) {
        scope.resource = resource
      }
      return scope
    },

    getResourceHeight (resource) {
      if (!resource.expanded) {
        return this.resourceHeight
      }

      const subResource = resource[this.subResourceKey]
      if (subResource === void 0) {
        console.warn('resource object requires a ', this.subResourceKey + ' label')
        return this.resourceHeight
      }

      let newResourceHeight = this.resourceHeight
      for (let i = 0; i < subResource.length; i++) {
        if (subResource[i].subResourceHeight === void 0) {
          newResourceHeight += this.subResourceHeight
        } else {
          newResourceHeight += subResource[i].subResourceHeight
        }
      }
      return newResourceHeight
    }
  }
}
