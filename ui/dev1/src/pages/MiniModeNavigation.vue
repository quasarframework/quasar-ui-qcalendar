<template>
  <div class="subcontent">
    <navigation-bar
      @today="onToday"
      @prev="onPrev"
      @next="onNext"
    />

    <div style="display: flex; justify-content: center">
      <input
        id="mobile"
        v-model="mobile"
        type="checkbox"
      >
      <label for="mobile">Mobile selection</label>
    </div>

    <div style="display: flex; justify-content: center">
      <div style="max-width: 280px; width: 100%; display: flex; flex-direction: column; justify-content: center; border: 1px solid #ccc; border-radius: 4px; padding: 10px;">
        <div style="width: 100%; display: flex; justify-content: space-evenly">
          <div style="width: 50%; display: flex; justify-content: space-between;">
            <span
              class="q-button"
              style="cursor: pointer; user-select: none;"
              @click="onPrev"
            >&lt;</span>
            {{ formattedMonth }}
            <span
              class="q-button"
              style="cursor: pointer; user-select: none;"
              @click="onNext"
            >&gt;</span>
          </div>
          <div style="width: 30%; display: flex; justify-content: space-between;">
            <span
              class="q-button"
              style="cursor: pointer; user-select: none;"
              @click="addToYear(-1)"
            >&lt;</span>
            {{ selectedYear }}
            <span
              class="q-button"
              style="cursor: pointer; user-select: none;"
              @click="addToYear(1)"
            >&gt;</span>
          </div>
        </div>
        <div style="width: 100%; display: flex; justify-content: center">
          <QCalendarMonth
            ref="calendar"
            v-model="selectedDate"
            mini-mode
            use-navigation
            focusable
            focus-type="['date']"
            no-active-date
            :selected-start-end-dates="startEndDates"
            :min-weeks="6"
            animated
            style="max-width: 280px; width: 100%;"
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
  </div>
</template>

<script>
import { QCalendarMonth } from '@quasar/quasar-ui-qcalendar/QCalendarMonth.js'
import {
  addToDate,
  getDayIdentifier,
  parseTimestamp,
  today
} from '@quasar/quasar-ui-qcalendar/Timestamp.js'
import '@quasar/quasar-ui-qcalendar/QCalendarVariables.sass'
import '@quasar/quasar-ui-qcalendar/QCalendarTransitions.sass'
import '@quasar/quasar-ui-qcalendar/QCalendarMonth.sass'

import { defineComponent, ref, computed } from 'vue'
import NavigationBar from '../components/NavigationBar.vue'

function leftClick (e) {
  return e.button === 0
}

export default defineComponent({
  name: 'MiniModeNavigation',
  components: {
    NavigationBar,
    QCalendarMonth
  },
  setup () {
    const selectedDate = ref(today()),
      calendar = ref(null),
      selectedYear = ref(new Date().getFullYear()),
      anchorTimestamp = ref(null),
      otherTimestamp = ref(null),
      mouseDown = ref(false),
      mobile = ref(false),
      locale = 'en-us'

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

    const formattedMonth = computed(() => {
      const date = new Date(selectedDate.value)
      return monthFormatter().format(date)
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

    function monthFormatter () {
      try {
        return new Intl.DateTimeFormat(locale || undefined, {
          month: 'long',
          timeZone: 'UTC'
        })
      }
      catch (e) {
        //
      }
    }

    function addToYear (amount) {
      // parse current date to timestamp
      let ts = parseTimestamp(selectedDate.value)
      // add specified amount of days
      ts = addToDate(ts, { year: amount })
      // re-assign values
      selectedDate.value = ts.date
      selectedYear.value = ts.year
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
      selectedYear,
      mobile,
      startEndDates,
      formattedMonth,
      addToYear,
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
