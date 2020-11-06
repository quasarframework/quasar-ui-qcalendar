<template>
  <div>
    <div class="q-gutter-sm">
      <q-checkbox v-model="mobile" label="Use Touch (set if on mobile)" />
      <q-checkbox v-model="noActiveDate" label="No active date" />
        <div class="full-width text-caption">Selection Type</div>
        <q-radio
          v-model="selectionType"
          val="off"
          label="Off"
        />
        <q-radio
          v-model="selectionType"
          val="date"
          label="Date (toggle)"
        />
        <q-radio
          v-model="selectionType"
          val="range"
          label="Range"
        />
    </div>
    <div style="overflow: hidden;">
      <q-calendar
        ref="calendar"
        v-model="selectedDate"
        view="month"
        locale="en-us"
        bordered
        :no-active-date="noActiveDate"
        :selected-start-end-dates="startEndDates"
        :selected-dates="selectedDates"
        @click:day2="onToggleDay"
        @click:date2="onToggleDate"
        @mousedown:day2="onMouseDownDay"
        @mouseup:day2="onMouseUpDay"
        @mousemove:day2="onMouseMoveDay"
        :style="styles"
      />
    </div>
  </div>
</template>

<script>
import {
  getDayIdentifier
} from 'ui'

function leftClick (e) {
  return e.button === 0
}

export default {
  name: 'ThemeBuilderMonth',
  props: {
    value: String,
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
      selectionType: 'off'
    }
  },

  beforeMount () {
    this.selectedDate = this.value
  },

  watch: {
    value (val) {
      this.selectedDate = val
    },

    selectionType (val) {
      // clear any existing data
      this.anchorTimestamp = null
      this.otherTimestamp = null
      this.selectedDates.splice(0, this.selectedDates.length)
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
      if (this.selectionType !== 'date') return
      const date = scope.timestamp.date
      if (this.selectedDates.includes(date)) {
        // remove the date
        for (let i = 0; i < this.selectedDates.length; ++i) {
          if (date === this.selectedDates[i]) {
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
