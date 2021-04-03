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
    <div class="row justify-evenly q-gutter-sm full-width">
      <div class="col-5">
        <div class="q-mb-md">
          Interval Range:
        </div>
        <q-range
          v-model="intervalRange"
          label
          label-always
          :min="0"
          :max="24"
          :step="intervalRangeStep"
          :left-label-value="leftLabelRange"
          :right-label-value="rightLabelRange"
          class="col"
        />
      </div>
      <div class="col-5">
        <div class="q-mb-md">
          Interval Height:
        </div>
        <q-slider
          v-model="intervalHeight"
          :min="20"
          :max="100"
          label
          label-always
          :label-value="intervalHeight + 'px'"
        />
      </div>
    </div>
    <div class="col-12 full-width q-px-md q-pb-sm">
      <span class="text-body2">Interval Step (Section)</span>
      <div class="q-gutter-sm">
        <q-radio
          v-model="intervalRangeStep"
          :val="1"
          label="60 min"
        />
        <q-radio
          v-model="intervalRangeStep"
          :val="0.5"
          label="30 min"
        />
        <q-radio
          v-model="intervalRangeStep"
          :val="0.25"
          label="15 min"
        />
      </div>
    </div>
    <q-calendar-day
      v-model="selectedDate"
      view="week"
      bordered
      time-clicks-clamped
      :interval-minutes="60 * intervalRangeStep"
      :interval-start="intervalStart"
      :interval-count="intervalCount"
      :interval-height="intervalHeight"
      :disabled-weekdays="disabledWeekdays"
      :no-active-date="noActiveDate"
      :selected-dates="selectedDates"
      :selected-start-end-dates="startEndDates"
      locale="en-US"
      style="height: 400px;"
      :style="styles"
      @click:time2="onToggleTime"
      @mousedown:time2="onMouseDownTime"
      @mouseup:time2="onMouseUpTime"
      @mousemove:time2="onMouseMoveTime"
    />
  </div>
</template>

<script>
import { QCalendarDay } from '@quasar/quasar-ui-qcalendar/QCalendarDay.js'
import '@quasar/quasar-ui-qcalendar/QCalendarVariables.sass'
import '@quasar/quasar-ui-qcalendar/QCalendarTransitions.sass'
import '@quasar/quasar-ui-qcalendar/QCalendarDay.sass'

import {
  getDayTimeIdentifier,
  getDateTime
} from 'ui'

function leftClick (e) {
  return e.button === 0
}

export default {
  name: 'ThemeBuilderWeek',
  components: {
    QCalendarDay
  },
  props: {
    modelValue: String,
    styles: Object
  },
  data () {
    return {
      selectedDate: '',
      noActiveDate: false,
      disabledDays: false,
      intervalRange: { min: 0, max: 24 },
      intervalRangeStep: 1,
      intervalHeight: 20,
      selectedDates: [],
      anchorTimestamp: null,
      otherTimestamp: null,
      mouseDown: false,
      mobile: false,
      selectionType: 'off'
    }
  },

  computed: {
    disabledWeekdays () {
      return this.disabledDays === true ? [ 0, 6 ] : []
    },
    leftLabelRange () {
      const a = Math.floor(this.intervalRange.min)
      const b = Number((this.intervalRange.min % 1).toFixed(2))
      const c = 60 * b
      return a + ':' + (c < 10 ? c + '0' : c)
    },
    rightLabelRange () {
      const a = Math.floor(this.intervalRange.max)
      const b = Number((this.intervalRange.max % 1).toFixed(2))
      const c = 60 * b
      return a + ':' + (c < 10 ? c + '0' : c)
    },
    intervalStart () {
      return this.intervalRange.min * (1 / this.intervalRangeStep)
    },
    intervalCount () {
      return (this.intervalRange.max - this.intervalRange.min) * (1 / this.intervalRangeStep)
    },
    startEndDates () {
      const dates = []
      if (this.anchorDayTimeIdentifier !== false && this.otherDayTimeIdentifier !== false) {
        if (this.anchorDayTimeIdentifier <= this.otherDayTimeIdentifier) {
          dates.push(getDateTime(this.anchorTimestamp), getDateTime(this.otherTimestamp))
        }
        else {
          dates.push(getDateTime(this.otherTimestamp), getDateTime(this.anchorTimestamp))
        }
      }
      return dates
    },
    anchorDayTimeIdentifier () {
      if (this.anchorTimestamp !== null) {
        return getDayTimeIdentifier(this.anchorTimestamp)
      }
      return false
    },
    otherDayTimeIdentifier () {
      if (this.otherTimestamp !== null) {
        return getDayTimeIdentifier(this.otherTimestamp)
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

  watch: {
    modelValue (val) {
      this.selectedDate = val
    },
    intervalRangeStep (val) {
      // normalize min/max values according to the step value
      const calcMin = (range) => {
        const b = Number((range % 1).toFixed(2))
        const c = b % val
        if (c > 0) {
          return range + c
        }
        return range
      }
      const calcMax = (range) => {
        const b = Number((range % 1).toFixed(2))
        const c = b % val
        if (c > 0) {
          return range - c
        }
        return range
      }
      this.intervalRange.min = calcMin(this.intervalRange.min)
      this.intervalRange.max = calcMax(this.intervalRange.max)
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
    onToggleTime ({ scope }) {
      if (this.selectionType !== 'toggle' || scope === undefined) {
        return
      }

      // get date with time
      const t = getDateTime(scope.timestamp)

      // toggle to/from array
      if (this.selectedDates.includes(t)) {
        // remove the date
        for (let i = 0; i < this.selectedDates.length; ++i) {
          if (t === this.selectedDates[ i ]) {
            this.selectedDates.splice(i, 1)
            break
          }
        }
      }
      else {
        // add the date if not outside
        if (scope.outside !== true) {
          this.selectedDates.push(t)
        }
      }
    },
    onMouseDownTime ({ scope, event }) {
      if (this.selectionType !== 'range') return
      if (leftClick(event)) {
        if (this.mobile === true
          && this.anchorTimestamp !== null
          && this.otherTimestamp !== null
          && getDateTime(this.anchorTimestamp) === getDateTime(this.otherTimestamp)) {
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
      if (this.selectionType !== 'range') return
      if (this.mobile !== true && leftClick(event)) {
        // mouse is up, capture last and cancel selection
        this.otherTimestamp = scope.timestamp
        this.mouseDown = false
      }
    },

    onMouseMoveTime ({ scope, event }) {
      if (this.selectionType !== 'range') return
      if (this.mobile !== true && this.mouseDown === true) {
        this.otherTimestamp = scope.timestamp
      }
    }
  }

}
</script>
