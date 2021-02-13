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
    <input
      id="mobile"
      v-model="mobile"
      type="checkbox"
    >
    <label for="mobile">Mobile selection</label>
    <input
      id="hover"
      v-model="useHover"
      type="checkbox"
    >
    <label for="hover">Use Hover</label>
  </div>

  <div style="width: 100%; display: flex; justify-content: center">
    <QCalendarMonth
      ref="calendar"
      v-model="selectedDate"
      mini-mode
      no-active-date
      :selected-start-end-dates="startEndDates"
      :hover="hover"
      animated
      bordered
      style="max-width: 280px; width: 100%;"
      @mousedown-day="onMouseDownDay"
      @mouseup-day="onMouseUpDay"
      @mousemove-day="onMouseMoveDay"
      @change="onChange"
      @moved="onMoved"
      @click-day="onClickDay"
      @click-date="onClickDate"
      @click-workweek="onClickWorkweek"
      @click-head-workweek="onClickHeadWorkweek"
      @click-head-day="onClickHeadDay"
    />
  </div>
</template>

<script>
import { QCalendarMonth } from '@quasar/quasar-ui-qcalendar/QCalendarMonth.js'
import {
  getDayIdentifier,
  today
} from '@quasar/quasar-ui-qcalendar/Timestamp.js'
import '@quasar/quasar-ui-qcalendar/QCalendarVariables.sass'
import '@quasar/quasar-ui-qcalendar/QCalendarTransitions.sass'
import '@quasar/quasar-ui-qcalendar/QCalendarMonth.sass'

function leftClick (e) {
  return e.button === 0
}

import { defineComponent, ref, computed } from 'vue'

export default defineComponent({
  name: 'MiniModeSelection',
  components: {
    QCalendarMonth
  },
  setup () {
    const selectedDate = ref(today()),
      calendar = ref(null),
      anchorTimestamp = ref(null),
      otherTimestamp = ref(null),
      mouseDown = ref(false),
      mobile = ref(false),
      hover = ref(false),
      useHover = ref(false)

    const startEndDates = computed(() => {
      const dates = []
      if (anchorDayIdentifier.value !== false && otherDayIdentifier.value !== false) {
        if (anchorDayIdentifier.value <= otherDayIdentifier.value) {
          dates.push(anchorTimestamp.value.date, otherTimestamp.value.date)
        }
        else {
          dates.push(otherTimestamp.value.date, anchorTimestamp.value.date)
        }
      }
      return dates
    })

    const anchorDayIdentifier = computed(() => {
      if (anchorTimestamp.value !== null) {
        return getDayIdentifier(anchorTimestamp.value)
      }
      return false
    })

    const otherDayIdentifier = computed(() => {
      if (otherTimestamp.value !== null) {
        return getDayIdentifier(otherTimestamp.value)
      }
      return false
    })

    function onMouseDownDay ({ scope, event }) {
      if (leftClick(event)) {
        if (mobile.value === true
          && anchorTimestamp.value !== null
          && otherTimestamp.value !== null
          && anchorTimestamp.value.date === otherTimestamp.value.date) {
          otherTimestamp.value = scope.timestamp
          mouseDown.value = false
          return
        }
        // mouse is down, start selection and capture current
        mouseDown.value = true
        anchorTimestamp.value = scope.timestamp
        otherTimestamp.value = scope.timestamp
        hover.value = useHover.value
      }
    }

    function onMouseUpDay ({ scope, event }) {
      if (leftClick(event)) {
        // mouse is up, capture last and cancel selection
        otherTimestamp.value = scope.timestamp
        mouseDown.value = false
        hover.value = false
      }
    }

    function onMouseMoveDay ({ scope, event }) {
      if (mouseDown.value === true && scope.outside !== true) {
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
    function onClickDay (data) {
      console.log('onClickDay', data)
    }
    function onClickWorkweek (data) {
      console.log('onClickWorkweek', data)
    }
    function onClickHeadDay (data) {
      console.log('onClickHeadDay', data)
    }
    function onClickHeadWorkweek (data) {
      console.log('onClickHeadWorkweek', data)
    }

    return {
      selectedDate,
      calendar,
      mobile,
      hover,
      useHover,
      startEndDates,
      onMouseDownDay,
      onMouseUpDay,
      onMouseMoveDay,
      onToday,
      onPrev,
      onNext,
      onMoved,
      onChange,
      onClickDate,
      onClickDay,
      onClickWorkweek,
      onClickHeadDay,
      onClickHeadWorkweek
    }
  }
})
</script>
