<template>
  <div style="margin: 12px;">
    <div style="width: 100%">
      <button
        class="button"
        style="margin: 2px;"
        @click="onToday"
      >
        Today
      </button>
      <button
        class="button"
        style="margin: 2px;"
        @click="onPrev"
      >
        &lt; Prev
      </button>
      <button
        class="button"
        style="margin: 2px;"
        @click="onNext"
      >
        Next &gt;
      </button>
    </div>
    <div class="line">The example below uses the <code class="token">selected-start-end-dates</code> property in conjunction with mouse events to select iterval ranges.</div>
    <div class="line">Try toggling the <code class="token">Mobile selection</code> to see how selection can be changed.</div>
    <input
      id="mobile"
      v-model="mobile"
      type="checkbox"
    >
    <label for="mobile">Mobile selection (first click, second click)</label>
  </div>
  <QCalendarDay
    ref="calendar"
    v-model="selectedDate"
    style="max-width: 800px; width: 100%; height: 400px; display: inline-flex;"
    :interval-minutes="15"
    :interval-count="96"
    :interval-height="15"
    time-clicks-clamped
    :selected-start-end-dates="startEndDates"
    @change="onChange"
    @moved="onMoved"
    @mousedown-time="onMouseDownTime"
    @mouseup-time="onMouseUpTime"
    @mousemove-time="onMouseMoveTime"
    @click-date="onClickDate"
    @click-interval="onClickInterval"
    @click-head-intervals="onClickHeadIntervals"
    @click-head-day="onClickHeadDay"
  />
</template>

<script>
import { QCalendarDay } from '@quasar/quasar-ui-qcalendar/QCalendarDay.js'
import {
  today,
  getDateTime,
  getDayTimeIdentifier
} from '@quasar/quasar-ui-qcalendar/Timestamp.js'
import '@quasar/quasar-ui-qcalendar/QCalendarVariables.sass'
import '@quasar/quasar-ui-qcalendar/QCalendarTransitions.sass'
import '@quasar/quasar-ui-qcalendar/QCalendarDay.sass'

function leftClick (e) {
  return e.button === 0
}

import { defineComponent, ref, computed } from 'vue'

export default defineComponent({
  name: 'DaySelection',
  components: {
    QCalendarDay
  },
  setup () {
    const selectedDate = ref(today()),
      calendar = ref(null),
      anchorTimestamp = ref(null),
      otherTimestamp = ref(null),
      mouseDown = ref(false),
      mobile = ref(true)

    const startEndDates = computed(() => {
      const dates = []
      if (anchorDayTimeIdentifier.value !== false && otherDayTimeIdentifier.value !== false) {
        if (anchorDayTimeIdentifier.value <= otherDayTimeIdentifier.value) {
          dates.push(getDateTime(anchorTimestamp.value), getDateTime(otherTimestamp.value))
        }
        else {
          dates.push(getDateTime(otherTimestamp.value), getDateTime(anchorTimestamp.value))
        }
      }
      return dates
    })

    const anchorDayTimeIdentifier = computed(() => {
      if (anchorTimestamp.value !== null) {
        return getDayTimeIdentifier(anchorTimestamp.value)
      }
      return false
    })

    const otherDayTimeIdentifier = computed(() => {
      if (otherTimestamp.value !== null) {
        return getDayTimeIdentifier(otherTimestamp.value)
      }
      return false
    })

    function onMouseDownTime ({ scope, event }) {
      console.log('onMouseDownTime', { scope, event })
      if (leftClick(event)) {
        if (mobile.value === true
          && anchorTimestamp.value !== null
          && otherTimestamp.value !== null
          && getDateTime(anchorTimestamp.value) === getDateTime(otherTimestamp.value)) {
          otherTimestamp.value = scope.timestamp
          mouseDown.value = false
          return
        }
        // mouse is down, start selection and capture current
        mouseDown.value = true
        anchorTimestamp.value = scope.timestamp
        otherTimestamp.value = scope.timestamp
      }
    }

    function onMouseUpTime ({ scope, event }) {
      if (mobile.value !== true && leftClick(event)) {
        // mouse is up, capture last and cancel selection
        otherTimestamp.value = scope.timestamp
        mouseDown.value = false
      }
    }

    function onMouseMoveTime ({ scope, event }) {
      if (mobile.value !== true && mouseDown.value === true) {
        otherTimestamp.value = scope.timestamp
      }
    }

    function onToday () {
      this.$refs.calendar.moveToToday()
    }
    function onPrev () {
      this.$refs.calendar.prev()
    }
    function onNext () {
      this.$refs.calendar.next()
    }
    function onMoved (data) {
      console.log('onMoved', data)
    }
    function onChange (data) {
      console.log('onChange', data)
    }
    function onClickDate (data) {
      console.log('onClickDate', data)
    }
    // function onClickTime (data) {
    //   console.log('onClickTime', data)
    // }
    function onClickInterval (data) {
      console.log('onClickInterval', data)
    }
    function onClickHeadIntervals (data) {
      console.log('onClickHeadIntervals', data)
    }
    function onClickHeadDay (data) {
      console.log('onClickHeadDay', data)
    }

    return {
      selectedDate,
      calendar,
      mobile,
      startEndDates,
      onMouseDownTime,
      onMouseUpTime,
      onMouseMoveTime,
      onToday,
      onPrev,
      onNext,
      onMoved,
      onChange,
      onClickDate,
      onClickInterval,
      onClickHeadIntervals,
      onClickHeadDay
    }
  }
})
</script>
