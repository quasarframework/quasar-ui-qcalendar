<template>
  <div class="row" style="overflow: hidden;">
    <q-calendar
      v-model="selectedDate1"
      view="month"
      locale="en-us"
      :mini-mode="true"
      short-weekday-label
      animated
      :selected-start-end-dates="startEndDates"
      :day-class="classDay"
      @mousedown:day="onMouseDownDay"
      @mouseup:day="onMouseUpDay"
      @mousemove:day="onMouseMoveDay"
    />
    <q-separator vertical />
    <q-calendar
      v-model="selectedDate2"
      view="month"
      locale="en-us"
      :mini-mode="true"
      short-weekday-label
      animated
      :selected-start-end-dates="startEndDates"
      :day-class="classDay"
      @mousedown:day="onMouseDownDay"
      @mouseup:day="onMouseUpDay"
      @mousemove:day="onMouseMoveDay"
    />
  </div>
</template>

<script>
import {
  getDayIdentifier,
  parseDate
} from '@quasar/quasar-ui-qcalendar/src/utils/timestamp'

const CURRENT_MONTH = new Date()

function getCurrentMonth (month) {
  const newDay = new Date(CURRENT_MONTH)
  newDay.setMonth(month)
  const tm = parseDate(newDay)
  return tm.date
}

export default {
  data () {
    return {
      selectedDate1: '',
      selectedDate2: '',
      anchorTimestamp: '',
      otherTimestamp: '',
      mouseDown: false
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
        } else {
          dates.push(this.otherTimestamp.date, this.anchorTimestamp.date)
        }
      }
      return dates
    },
    anchorDayIdentifier () {
      if (this.anchorTimestamp !== '') {
        return getDayIdentifier(this.anchorTimestamp)
      }
      return false
    },
    otherDayIdentifier () {
      if (this.otherTimestamp !== '') {
        return getDayIdentifier(this.otherTimestamp)
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
      const nowIdentifier = getDayIdentifier(timestamp)
      return {
        'q-selected-day-first': this.lowIdentifier === nowIdentifier,
        'q-selected-day': this.lowIdentifier <= nowIdentifier && this.highIdentifier >= nowIdentifier,
        'q-selected-day-last': this.highIdentifier === nowIdentifier
      }
    },

    onMouseDownDay (e) {
      // mouse is down, start selection and capture current
      this.mouseDown = true
      this.anchorTimestamp = e
      this.otherTimestamp = e
    },

    onMouseUpDay (e) {
      // mouse is up, capture last and cancel selection
      this.otherTimestamp = e
      this.mouseDown = false
    },

    onMouseMoveDay (e) {
      if (this.mouseDown === true) {
        this.otherTimestamp = e
      }
    }
  }
}
</script>
