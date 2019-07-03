// Mixins
import CalendarBase from './calendar-base'

// Util
import props from '../utils/props'
import {
  // parseTime,
  copyTimestamp,
  updateMinutes,
  createDayList
} from '../utils/timestamp'

export default CalendarBase.extend({
  name: 'calendar-with-scheduler',

  props: {
    ...props.scheduler
  },

  computed: {
    parsedResourceHeight () {
      return parseFloat(this.resourceHeight)
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
        this.maxDays
      )
    }
  },

  methods: {
    resourceStyleDefault (_interval) {
      return undefined
    },
    getTimestampAtEvent (e, day) {
      const timestamp = copyTimestamp(day)
      const bounds = (e.currentTarget).getBoundingClientRect()
      const baseMinutes = this.startMinute
      const touchEvent = e
      const mouseEvent = e
      const touches = touchEvent.changedTouches || touchEvent.touches
      const clientY = touches && touches[0] ? touches[0].clientY : mouseEvent.clientY
      const addIntervals = (clientY - bounds.top) / this.parsedIntervalHeight
      const addMinutes = Math.floor(addIntervals * this.parsedIntervalMinutes)
      const minutes = baseMinutes + addMinutes

      return updateMinutes(timestamp, minutes, this.times.now)
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
})
