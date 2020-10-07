<template>
  <div>
    <q-toolbar>
      <q-btn stretch flat label="Prev" @click="calendarPrev" />
      <q-separator vertical />
      <q-btn stretch flat label="Next" @click="calendarNext" />
      <q-space />
    </q-toolbar>
    <q-separator />
    <div class="row justify-between">
      <div class="col-8" style="overflow: hidden;">
        <q-calendar
          ref="calendar"
          v-model="selectedDate"
          view="month"
          locale="en-us"
          animated
          transition-prev="slide-right"
          transition-next="slide-left"
          :day-class="classDay"
          :selected-start-end-dates="startEndDates"
          style="height: 320px"
          @mousedown:day="onMouseDownDay"
          @mouseup:day="onMouseUpDay"
          @mousemove:day="onMouseMoveDay"
        >
          <template #day="{ /* date */ }">
          </template>
        </q-calendar>
      </div>
      <div class="col-4" style="min-height: 100%; border: #c0c0c0 solid 1px;">
      </div>
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
      anchorTimestamp: '',
      otherTimestamp: '',
      mouseDown: false
    }
  },
  computed: {
    startEndDates () {
      const dates = []
      if (this.anchorDayIdentifier !== false && this.otherDayIdentifier !== false) {
        if (this.anchorDayIdentifier <= this.otherDayIdentifier) {
          dates.push(this.anchorTimestamp.date, this.otherTimestamp.date)
        } else {
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
    calendarNext () {
      this.$refs.calendar.next()
    },
    calendarPrev () {
      this.$refs.calendar.prev()
    },
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
