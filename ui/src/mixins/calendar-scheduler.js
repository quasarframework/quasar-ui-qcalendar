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
      let count = 0
      function getCount (resources) {
        let count = 0
        resources.forEach(resource => {
          ++count
          if (resource.children && resource.children.length > 0 && resource.expanded === true) {
            count += getCount(resource.children)
          }
        })
        return count
      }

      if (this.resources && this.resources.length > 0) {
        count += getCount(this.resources)
      }

      if (this.resources && this.resources.length > 0) {
        return count * this.parsedResourceHeight
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
