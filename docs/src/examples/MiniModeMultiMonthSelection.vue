<template>
  <div class="subcontent">
    <navigation-bar
      @today="onToday"
      @prev="onPrev"
      @next="onNext"
    />

    <div style="display: flex; justify-content: center; align-items: center;">
      <q-checkbox
        v-model="mobile"
        label="Mobile selection (first click, second click)"
      />
      <q-checkbox
        v-model="hover"
        label="Hover mode"
      />
    </div>

    <div style="display: flex; justify-content: center; align-items: center; flex-wrap: nowrap;">
      <div style="display: flex; max-width: 560px; width: 100%;">
        <q-calendar-month
          ref="calendar1"
          v-model="selectedDate1"
          mini-mode
          no-active-date
          :hover="canHover"
          :selected-start-end-dates="startEndDates"
          :min-weeks="6"
          bordered
          animated
          @mousedown-day="onMouseDownDay"
          @mouseup-day="onMouseUpDay"
          @mousemove-day="onMouseMoveDay"
          @change="onChange"
          @moved="onMoved"
          @click-day="onClickDay"
          @click-workweek="onClickWorkweek"
          @click-head-workweek="onClickHeadWorkweek"
          @click-head-day="onClickHeadDay"
        />
        <q-calendar-month
          ref="calendar2"
          v-model="selectedDate2"
          mini-mode
          no-active-date
          :hover="canHover"
          :selected-start-end-dates="startEndDates"
          :min-weeks="6"
          bordered
          animated
          @mousedown-day="onMouseDownDay"
          @mouseup-day="onMouseUpDay"
          @mousemove-day="onMouseMoveDay"
          @change="onChange"
          @moved="onMoved"
          @click-date="onClickDate"
          @click-day="onClickDay"
          @click-workweek="onClickWorkweek"
          @click-head-workweek="onClickHeadWorkweek"
          @click-head-day="onClickHeadDay"
        />
      </div>
    </div>
  </div>
</template>

<script>
import {
  QCalendarMonth,
  addToDate,
  getDayIdentifier,
  parseTimestamp,
  today
} from '@quasar/quasar-ui-qcalendar/src/index.js'
import '@quasar/quasar-ui-qcalendar/src/QCalendarVariables.sass'
import '@quasar/quasar-ui-qcalendar/src/QCalendarTransitions.sass'
import '@quasar/quasar-ui-qcalendar/src/QCalendarMonth.sass'

function leftClick (e) {
  return e.button === 0
}

import { defineComponent, ref, computed, onBeforeMount } from 'vue'
import NavigationBar from '../components/NavigationBar.vue'

export default defineComponent({
  name: 'MiniModeMultiMonthSelection',
  components: {
    NavigationBar,
    QCalendarMonth
  },
  setup () {
    const selectedDate1 = ref(today()),
      selectedDate2 = ref(today()),
      calendar1 = ref(null),
      calendar2 = ref(null),
      anchorTimestamp = ref(null),
      otherTimestamp = ref(null),
      mouseDown = ref(false),
      mobile = ref(false),
      hover = ref(false)

    const canHover = computed(() => {
      return hover.value === true && mouseDown.value === true
    })

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

    onBeforeMount(() => {
      selectedDate1.value = today()
      let tm = parseTimestamp(selectedDate1.value)
      tm = addToDate(tm, { month: 1 })
      selectedDate2.value = tm.date
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
      }
    }

    function onMouseUpDay ({ scope, event }) {
      if (leftClick(event)) {
        // mouse is up, capture last and cancel selection
        otherTimestamp.value = scope.timestamp
        mouseDown.value = false
      }
    }

    function onMouseMoveDay ({ scope, event }) {
      if (mouseDown.value === true && scope.outside !== true) {
        otherTimestamp.value = scope.timestamp
      }
    }

    function onToday () {
      selectedDate1.value = today()
      let tm = parseTimestamp(selectedDate1.value)
      tm = addToDate(tm, { month: 1 })
      selectedDate2.value = tm.date
    }
    function onPrev () {
      calendar1.value.prev()
      calendar2.value.prev()
    }
    function onNext () {
      calendar1.value.next()
      calendar2.value.next()
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
      selectedDate1,
      selectedDate2,
      calendar1,
      calendar2,
      mobile,
      hover,
      canHover,
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
