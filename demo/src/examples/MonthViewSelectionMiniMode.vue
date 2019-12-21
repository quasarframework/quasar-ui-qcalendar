<template>
  <div style="max-width: 800px; width: 100%;">
    <div class="q-gutter-sm">
      <q-checkbox v-model="mobile" label="Use Touch (set if on mobile)" />
    </div>
    <q-separator></q-separator>
    <q-splitter
      v-model="splitterModel"
      :limits="[30, 100]"
      emit-immediately
    >
      <template v-slot:before>
        <div style="overflow: hidden;">
          <q-calendar
            ref="calendar"
            v-model="selectedDate"
            view="month"
            locale="en-us"
            :mini-mode="miniMode"
            :selected-start-end-dates="startEndDates"
            :day-class="classDay"
            @mousedown:day="onMouseDownDay"
            @mouseup:day="onMouseUpDay"
            @mousemove:day="onMouseMoveDay"
          />
      </div>
      </template>
      <template v-slot:separator>
        <q-avatar color="primary" text-color="white" size="40px" icon="drag_indicator" />
      </template>
      <template v-slot:after>
        <div style="min-width: 20px"></div>
      </template>
    </q-splitter>
  </div>
</template>

<script>
import {
  getDayIdentifier
} from 'ui' // ui is aliased from '@quasar/quasar-ui-qcalendar'

export default {
  data () {
    return {
      splitterModel: 90, // start at 90%
      selectedDate: '',
      miniMode: false,
      anchorTimestamp: '',
      otherTimestamp: '',
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

  watch: {
    splitterModel (val) {
      const rect = this.$refs.calendar.$el.getBoundingClientRect()
      this.miniMode = rect.width < 500
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
      const nowIdentifier = getDayIdentifier(timestamp)
      return {
        'q-selected-day-first': this.lowIdentifier === nowIdentifier,
        'q-selected-day': this.lowIdentifier <= nowIdentifier && this.highIdentifier >= nowIdentifier,
        'q-selected-day-last': this.highIdentifier === nowIdentifier
      }
    },

    onMouseDownDay (e) {
      if (this.mobile === true &&
        this.anchorTimestamp !== null &&
        this.otherTimestamp !== null &&
        this.anchorTimestamp.date === this.otherTimestamp.date) {
        this.otherTimestamp = e
        this.mouseDown = false
        return
      }
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
