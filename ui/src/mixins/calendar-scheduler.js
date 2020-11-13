// Mixins
import CalendarBase from './calendar-base'

// Util
import props from '../utils/props'
import {
  // parseTime,
  copyTimestamp,
  createDayList,
  updateRelative
} from '../utils/Timestamp.js'

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
      const height = parseFloat(this.resourceHeight)
      if (height === 0) {
        return 'auto'
      }
      return height
    },

    parsedResourceWidth () {
      return parseFloat(this.resourceWidth)
    },

    bodyHeight () {
      let height = 0
      const getHeight = (resources) => {
        let resourceHeight = 0
        resources.forEach(resource => {
          resourceHeight += resource.height !== void 0 ? resource.height : this.parsedResourceHeight
          if (resource.children && resource.children.length > 0 && resource.expanded === true) {
            resourceHeight += getHeight(resource.children)
          }
        })
        return resourceHeight
      }

      if (this.resources && this.resources.length > 0) {
        height += getHeight(this.resources)
      }

      return height
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
      if (idx !== undefined) {
        scope.index = idx
      }
      if (resource !== undefined) {
        scope.resource = resource
      }
      return scope
    }
  }
}
