<template>
  <div class="subcontent">
    <div class="line">The example below uses the <code class="token">selected-start-end-dates</code> property in conjunction with mouse events to select iterval ranges.</div>
    <div class="line">Try toggling the <code class="token">Mobile selection</code> to see how selection can be changed.</div>

    <div style="display: flex; justify-content: center; align-items: center;">
      <input
        id="mobile"
        v-model="mobile"
        type="checkbox"
      >
      <label for="mobile">Mobile selection (first click, second click)</label>
    </div>

    <navigation-bar
      @today="onToday"
      @prev="onPrev"
      @next="onNext"
    />

    <div style="display: flex; justify-content: center">
      <QCalendarDay
        ref="calendar"
        v-model="selectedDate"
        view="week"
        style="max-width: 800px; width: 100%; height: 400px;"
        :interval-minutes="15"
        :interval-count="96"
        :interval-height="15"
        time-clicks-clamped
        :selected-start-end-dates="startEndDates"
        animated
        bordered
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
    </div>
  </div>
</template>

<script>
import {
  today,
  getDateTime,
  getDayTimeIdentifier
} from '@quasar/quasar-ui-qcalendar/Timestamp.js'
import { QCalendarDay } from '@quasar/quasar-ui-qcalendar/QCalendarDay.js'
import '@quasar/quasar-ui-qcalendar/QCalendarVariables.sass'
import '@quasar/quasar-ui-qcalendar/QCalendarTransitions.sass'
import '@quasar/quasar-ui-qcalendar/QCalendarDay.sass'

import { defineComponent, ref, computed } from 'vue'
import NavigationBar from '../components/NavigationBar.vue'

function leftClick (e) {
  return e.button === 0
}

export default defineComponent({
  name: 'WeekSelection',
  components: {
    NavigationBar,
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
      calendar.value.moveToToday()
    }
    function onPrev () {
      calendar.value.prev()
    }
    function onNext () {
      calendar.value.next()
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
    function onClickTime (data) {
      console.log('onClickTime', data)
    }
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
      startEndDates,
      mobile,
      onMouseDownTime,
      onMouseUpTime,
      onMouseMoveTime,
      onToday,
      onPrev,
      onNext,
      onMoved,
      onChange,
      onClickDate,
      onClickTime,
      onClickInterval,
      onClickHeadIntervals,
      onClickHeadDay
    }
  }
})
</script>
