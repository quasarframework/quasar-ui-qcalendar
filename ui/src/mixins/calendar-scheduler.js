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
        return this.resources.length * this.parsedResourceHeight
      }
      return 0
    },

    days () {
      return createDayList(
        this.parsedStart,
        this.parsedEnd,
        this.times.today,
        this.weekdaySkips,
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
      const scope = {}
      scope.day = copyTimestamp(timestamp)
      if (idx !== void 0) {
        scope.index = idx
      }
      if (resource !== void 0) {
        scope.resource = resource
      }
      return scope
    }
  }
}
