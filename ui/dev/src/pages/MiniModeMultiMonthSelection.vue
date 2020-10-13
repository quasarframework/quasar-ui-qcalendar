<template>
  <div class="row justify-center" style="max-width: 800px; width: 100%; overflow: hidden;">
    <div class="q-gutter-sm">
      <q-checkbox v-model="mobile" label="Use Touch (set if on mobile)" />
    </div>
    <q-separator class="full-width" />
    <div class="row justify-center" style="max-width: 800px; width: 100%; overflow: hidden;">
      <q-calendar
        v-model="selectedDate1"
        view="month"
        locale="en-us"
        mini-mode
        no-active-date
        short-weekday-label
        animated
        :selected-start-end-dates="startEndDates"
        :day-class="classDay"
        @mousedown:day2="onMouseDownDay"
        @mouseup:day2="onMouseUpDay"
        @mousemove:day2="onMouseMoveDay"
        style="max-width: 300px; min-width: auto; overflow: hidden"
      />
      <q-separator vertical />
      <q-calendar
        v-model="selectedDate2"
        view="month"
        locale="en-us"
        mini-mode
        no-active-date
        short-weekday-label
        animated
        :selected-start-end-dates="startEndDates"
        :day-class="classDay"
        @mousedown:day2="onMouseDownDay"
        @mouseup:day2="onMouseUpDay"
        @mousemove:day2="onMouseMoveDay"
        style="max-width: 300px; min-width: auto; overflow: hidden"
      />
    </div>
  </div>
</template>

<script>
// normally you would not import "all" of QCalendar, but is needed for this example to work with UMD (codepen)
import QCalendar from 'ui' // ui is aliased from '@quasar/quasar-ui-qcalendar'

const CURRENT_MONTH = new Date()

function getCurrentMonth (month) {
  const newDay = new Date(CURRENT_MONTH)
  newDay.setMonth(month)
  const tm = QCalendar.parseDate(newDay)
  return tm.date
}

function leftClick (e) {
  return e.button === 0
}

export default {
  data () {
    return {
      selectedDate1: '',
      selectedDate2: '',
      anchorTimestamp: '',
      otherTimestamp: '',
      mouseDown: false,
      mobile: false
    }
  },

  beforeMount () {
    this.selectedDate1 = getCurrentMonth(CURRENT_MONTH.getMonth())
    this.selectedDate2 = getCurrentMonth(CURRENT_MONTH.getMonth() + 1)
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
      if (this.anchorTimestamp !== '') {
        return QCalendar.getDayIdentifier(this.anchorTimestamp)
      }
      return false
    },

    otherDayIdentifier () {
      if (this.otherTimestamp !== '') {
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
    classDay (timestamp) {
      if (this.anchorDayIdentifier !== false && this.otherDayIdentifier !== false) {
        return this.getBetween(timestamp)
      }
    },

    getBetween (timestamp) {
      const nowIdentifier = QCalendar.getDayIdentifier(timestamp)
      return {
        'q-selected-day-first': this.lowIdentifier === nowIdentifier,
        'q-selected-day': this.lowIdentifier <= nowIdentifier && this.highIdentifier >= nowIdentifier,
        'q-selected-day-last': this.highIdentifier === nowIdentifier
      }
    },

    onMouseDownDay ({ scope, event }) {
      if (leftClick(event)) {
        if (this.mobile === true &&
          this.anchorTimestamp !== null &&
          this.otherTimestamp !== null &&
          this.anchorTimestamp.date === this.otherTimestamp.date) {
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

    onMouseUpDay ({ scope, event }) {
      if (leftClick(event)) {
        // mouse is up, capture last and cancel selection
        this.otherTimestamp = scope.timestamp
        this.mouseDown = false
      }
    },

    onMouseMoveDay ({ scope, event }) {
      if (this.mouseDown === true) {
        this.otherTimestamp = scope.timestamp
      }
    }
  }
}
</script>
