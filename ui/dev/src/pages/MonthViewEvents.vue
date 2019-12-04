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
          :day-style="styleDay"
          :selected-start-end-dates="startEndDates"
          style="height: 400px;"
          @mousedown:day="onMouseDownDay"
          @mouseup:day="onMouseUpDay"
          @mousemove:day="onMouseMoveDay"
        >
          <template #day="{ date }">
          </template>
        </q-calendar>
      </div>
      <div class="col-4" style="min-height: 100%; border: #c0c0c0 solid 1px;">
      </div>
    </div>
  </div>
</template>

<script>
import {
  getDayIdentifier
} from '@quasar/quasar-ui-qcalendar/src/utils/timestamp'

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
      let dates = []
      if (this.anchorDayIdentifier !== false && this.otherDayIdentifier !== false ) {
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
    calendarNext () {
      this.$refs.calendar.next()
    },
    calendarPrev () {
      this.$refs.calendar.prev()
    },
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
      let nowIdentifier = getDayIdentifier(timestamp)
      return this.lowIdentifier <= nowIdentifier && this.highIdentifier >= nowIdentifier
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
