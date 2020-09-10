<template>
  <div style="max-width: 800px; width: 100%;">
    <div class="q-gutter-sm">
      <q-checkbox v-model="mobile" label="Use Touch (set if on mobile)" />
    </div>
    <q-separator></q-separator>
    <div style="overflow: hidden;">
      <q-calendar
        ref="calendar"
        v-model="selectedDate"
        view="month"
        locale="en-us"
        :selected-start-end-dates="startEndDates"
        :day-style="styleDay"
        @mousedown:day="onMouseDownDay"
        @mouseup:day="onMouseUpDay"
        @mousemove:day="onMouseMoveDay"
      />
    </div>
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
      if (this.anchorDayIdentifier !== false && this.otherDayIdentifier !== false) {
        if (this.anchorDayIdentifier <= this.otherDayIdentifier) {
          dates.push(this.anchorTimestamp.date, this.otherTimestamp.date)
        }
        else {
          dates.push(this.otherTimestamp.date, this.anchorTimestamp.date)
        }
      }
      return dates
    },
    anchorDayIdentifier () {
      if (this.anchorTimestamp !== null) {
        return QCalendar.getDayIdentifier(this.anchorTimestamp)
      }
      return false
    },
    otherDayIdentifier () {
      if (this.otherTimestamp !== null) {
        return QCalendar.getDayIdentifier(this.otherTimestamp)
      }
      return false
    },
    lowIdentifier () {
      // returns lowest of the two values
      return Math.min(this.anchorDayIdentifier, this.otherDayIdentifier)
    },
    highIdentifier () {
      // returns highest of the two values
      return Math.max(this.anchorDayIdentifier, this.otherDayIdentifier)
    }
  },

  methods: {
    styleDay (timestamp) {
      if (this.anchorDayIdentifier !== false && this.otherDayIdentifier !== false) {
        if (this.isBetween(timestamp) === true) {
          return {
            color: 'blue',
            background: '#CCCCFF'
          }
        }
      }
    },

    isBetween (timestamp) {
      const nowIdentifier = QCalendar.getDayIdentifier(timestamp)
      return this.lowIdentifier <= nowIdentifier && this.highIdentifier >= nowIdentifier
    },

    onMouseDownDay ({ scope, event }) {
      if (leftClick(event)) {
        if (this.mobile === true &&
          this.anchorTimestamp !== null &&
          this.otherTimestamp !== null &&
          this.anchorTimestamp.date === this.otherTimestamp.date) {
          this.otherTimestamp = scope
          this.mouseDown = false
          return
        }
        // mouse is down, start selection and capture current
        this.mouseDown = true
        this.anchorTimestamp = scope
        this.otherTimestamp = scope
      }
    },

    onMouseUpDay ({ scope, event }) {
      if (leftClick(event)) {
        // mouse is up, capture last and cancel selection
        this.otherTimestamp = scope
        this.mouseDown = false
      }
    },

    onMouseMoveDay ({ scope, event }) {
      if (this.mouseDown === true) {
        this.otherTimestamp = scope
      }
    }
  }
}
</script>
