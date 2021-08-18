<template>
  <div style="max-width: 800px; width: 100%;">
    <div class="q-gutter-sm">
      <q-checkbox
        v-model="mobile"
        label="Use Touch (set if on mobile)"
      />
    </div>
    <q-separator />
    <q-calendar
      v-model="selectedDate"
      view="week"
      animated
      :interval-minutes="15"
      :interval-count="96"
      time-clicks-clamped
      :selected-start-end-dates="startEndDates"
      locale="en-us"
      style="height: 400px;"
      @mousedown:time2="onMouseDownTime"
      @mouseup:time2="onMouseUpTime"
      @mousemove:time2="onMouseMoveTime"
    />
  </div>
</template>

<script>
// normally you would not import "all" of QCalendar, but is needed for this example to work with UMD (codepen)
import QCalendar from 'ui' // ui is aliased from '@quasar/quasar-ui-qcalendar'

function leftClick (e) {
  return e.button === 0
}

export default {
  data () {
    return {
      selectedDate: '',
      anchorTimestamp: null,
      otherTimestamp: null,
      mouseDown: false,
      mobile: false
    }
  },

  computed: {
    startEndDates () {
      const dates = []
      if (this.anchorDayTimeIdentifier !== false && this.otherDayTimeIdentifier !== false) {
        if (this.anchorDayTimeIdentifier <= this.otherDayTimeIdentifier) {
          dates.push(QCalendar.getDateTime(this.anchorTimestamp), QCalendar.getDateTime(this.otherTimestamp))
        }
        else {
          dates.push(QCalendar.getDateTime(this.otherTimestamp), QCalendar.getDateTime(this.anchorTimestamp))
        }
      }
      return dates
    },
    anchorDayTimeIdentifier () {
      if (this.anchorTimestamp !== null) {
        return QCalendar.getDayTimeIdentifier(this.anchorTimestamp)
      }
      return false
    },
    otherDayTimeIdentifier () {
      if (this.otherTimestamp !== null) {
        return QCalendar.getDayTimeIdentifier(this.otherTimestamp)
      }
      return false
    },
    lowIdentifier () {
      // returns lowest of the two values
      return Math.min(this.anchorDayTimeIdentifier, this.otherDayTimeIdentifier)
    },
    highIdentifier () {
      // returns highest of the two values
      return Math.max(this.anchorDayTimeIdentifier, this.otherDayTimeIdentifier)
    }
  },

  methods: {
    onMouseDownTime ({ scope, event }) {
      if (leftClick(event)) {
        if (this.mobile === true &&
          this.anchorTimestamp !== null &&
          this.otherTimestamp !== null &&
          QCalendar.getDateTime(this.anchorTimestamp) === QCalendar.getDateTime(this.otherTimestamp)) {
          this.otherTimestamp = scope.timestamp
          this.mouseDown = false
          return
        }
        // mouse is down, start selection and capture current
        this.mouseDown = true
        this.anchorTimestamp = scope.timestamp
        this.otherTimestamp = scope.timestamp
      }
    },

    onMouseUpTime ({ scope, event }) {
      if (this.mobile !== true && leftClick(event)) {
        // mouse is up, capture last and cancel selection
        this.otherTimestamp = scope.timestamp
        this.mouseDown = false
      }
    },

    onMouseMoveTime ({ scope, event }) {
      if (this.mobile !== true && this.mouseDown === true) {
        this.otherTimestamp = scope.timestamp
      }
    }
  }
}
</script>
