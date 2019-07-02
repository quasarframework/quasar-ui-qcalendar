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
      const scope = copyTimestamp(timestamp)
      scope.resourceStartPos = this.resourceStartPos
      if (idx !== void 0) {
        scope.index = idx
      }
      if (resource !== void 0) {
        scope.resource = resource
      }
      return scope
    }
    // scrollToTime (time) {
    //   const y = this.timeStartPos(time)
    //   const pane = this.$refs.scrollArea

    //   if (y === false || !pane) {
    //     return false
    //   }

    //   pane.scrollTop = y

    //   return true
    // },
    // timeDurationHeight (minutes) {
    //   return minutes / this.parsedIntervalMinutes * this.parsedIntervalHeight
    // },
    // timeStartPos (time, clamp = true) {
    //   const minutes = parseTime(time)
    //   if (minutes === false) return false

    //   const min = this.startMinute
    //   const gap = this.parsedIntervalCount * this.parsedIntervalMinutes
    //   const delta = (minutes - min) / gap
    //   let y = delta * this.bodyHeight

    //   if (clamp) {
    //     if (y < 0) {
    //       y = 0
    //     }
    //     if (y > this.bodyHeight) {
    //       y = this.bodyHeight
    //     }
    //   }

    //   return y
    // }
  }
})
