<template>
  <div>
    <div class="q-gutter-sm q-mb-sm">
      <q-checkbox
        v-model="mobile"
        dense
        label="Use Touch (set if on mobile)"
      />
      <q-checkbox
        v-model="noActiveDate"
        dense
        label="No active date"
      />
      <q-checkbox
        v-model="disabledDays"
        dense
        label="Disabled weekends"
      />
      <q-checkbox
        v-model="noOutsideDays"
        dense
        label="No outside days"
      />
      <q-checkbox
        v-model="showWorkweeks"
        dense
        label="Show workweeks"
      />
      <div class="full-width text-caption">
        Selection Type
      </div>
      <q-radio
        v-model="selectionType"
        dense
        val="off"
        label="Off"
      />
      <q-radio
        v-model="selectionType"
        dense
        val="toggle"
        label="Selection (toggle)"
      />
      <q-radio
        v-model="selectionType"
        dense
        val="range"
        label="Range"
      />
    </div>
    <div>
      <q-calendar-month
        ref="calendar"
        v-model="selectedDate"
        view="month"
        locale="en-US"
        bordered
        :no-active-date="noActiveDate"
        :selected-start-end-dates="startEndDates"
        :selected-dates="selectedDates"
        :disabled-weekdays="disabledWeekdays"
        :no-outside-days="noOutsideDays"
        :show-work-weeks="showWorkweeks"
        :day-min-height="70"
        :style="styles"
        @click-day="onToggleDay"
        @click-date="onToggleDate"
        @mousedown-day="onMouseDownDay"
        @mouseup-day="onMouseUpDay"
        @mousemove-day="onMouseMoveDay"
      />
    </div>
  </div>
</template>

<script>
import { QCalendarMonth } from '@quasar/quasar-ui-qcalendar/src/QCalendarMonth.js'
import '@quasar/quasar-ui-qcalendar/src/index.sass'

import {
  getDayIdentifier
} from '@quasar/quasar-ui-qcalendar/src/Timestamp.js'

function leftClick (e) {
  return e.button === 0
}

export default {
  name: 'ThemeBuilderMonth',
  components: {
    QCalendarMonth
  },
  props: {
    modelValue: String,
    styles: Object
  },
  data () {
    return {
      selectedDate: '',
      selectedDates: [],
      anchorTimestamp: null,
      otherTimestamp: null,
      mouseDown: false,
      mobile: false,
      noActiveDate: false,
      selectionType: 'off',
      disabledDays: false,
      noOutsideDays: false,
      showWorkweeks: false
    }
  },

  computed: {
    disabledWeekdays () {
      return this.disabledDays === true ? [ 0, 6 ] : []
    },

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
        return getDayIdentifier(this.anchorTimestamp)
      }
      return false
    },

    otherDayIdentifier () {
      if (this.otherTimestamp !== null) {
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
    modelValue (val) {
      this.selectedDate = val
    },

    selectionType (val) {
      // clear any existing data
      this.anchorTimestamp = null
      this.otherTimestamp = null
      this.selectedDates.splice(0, this.selectedDates.length)
    }
  },

  beforeMount () {
    this.selectedDate = this.modelValue
  },

  methods: {
    onToggleDate ({ scope }) {
      if (scope !== undefined) {
        this.toggleDate(scope)
      }
    },

    onToggleDay ({ scope }) {
      if (scope !== undefined) {
        this.toggleDate(scope)
      }
    },

    toggleDate (scope) {
      if (this.selectionType !== 'toggle') return
      const date = scope.timestamp.date
      if (this.selectedDates.includes(date)) {
        // remove the date
        for (let i = 0; i < this.selectedDates.length; ++i) {
          if (date === this.selectedDates[ i ]) {
            this.selectedDates.splice(i, 1)
            break
          }
        }
      }
      else {
        // add the date if not outside
        if (scope.outside !== true) {
          this.selectedDates.push(date)
        }
      }
    },

    onMouseDownDay ({ scope, event }) {
      if (this.selectionType !== 'range') return
      if (leftClick(event)) {
        if (this.mobile === true
          && this.anchorTimestamp !== null
          && this.otherTimestamp !== null
          && this.anchorTimestamp.date === this.otherTimestamp.date) {
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
      if (this.selectionType !== 'range') return
      if (leftClick(event)) {
        // mouse is up, capture last and cancel selection
        this.otherTimestamp = scope.timestamp
        this.mouseDown = false
      }
    },

    onMouseMoveDay ({ scope, event }) {
      if (this.selectionType !== 'range') return
      if (this.mouseDown === true) {
        this.otherTimestamp = scope.timestamp
      }
    }
  }
}
</script>
