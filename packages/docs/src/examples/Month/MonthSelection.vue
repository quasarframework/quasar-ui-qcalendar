<template>
  <div class="subcontent">
    <navigation-bar @today="onToday" @prev="onPrev" @next="onNext" />

    <div style="display: flex; justify-content: center; align-items: center">
      <q-checkbox v-model="mobile" label="Mobile selection (first click, second click)" />
    </div>

    <div class="row justify-center">
      <div style="display: flex; max-width: 800px; width: 100%">
        <q-calendar-month
          ref="calendar"
          v-model="selectedDate"
          :selected-start-end-dates="startEndDates"
          no-active-date
          :day-min-height="40"
          animated
          bordered
          @mousedown-day="onMouseDownDay"
          @mouseup-day="onMouseUpDay"
          @mousemove-day="onMouseMoveDay"
          @change="onChange"
          @moved="onMoved"
          @click-date="onClickDate"
          @click-workweek="onClickWorkweek"
          @click-head-workweek="onClickHeadWorkweek"
          @click-head-day="onClickHeadDay"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { QCalendarMonth, getDayIdentifier, today, Timestamp } from '@quasar/quasar-ui-qcalendar'
import '@quasar/quasar-ui-qcalendar/index.css'

import { ref, computed } from 'vue'
import NavigationBar from 'components/NavigationBar.vue'

function leftClick(e: MouseEvent) {
  return e.button === 0
}

interface Scope {
  timestamp: Timestamp
  outside: boolean
}

const calendar = ref<QCalendarMonth>(),
  selectedDate = ref(today()),
  anchorTimestamp = ref<Timestamp | null>(null),
  otherTimestamp = ref<Timestamp | null>(null),
  mouseDown = ref(false),
  mobile = ref(false)

const startEndDates = computed(() => {
  const dates = []
  if (anchorDayIdentifier.value !== false && otherDayIdentifier.value !== false) {
    if (anchorTimestamp.value && otherTimestamp.value) {
      if (anchorDayIdentifier.value <= otherDayIdentifier.value) {
        dates.push(anchorTimestamp.value.date, otherTimestamp.value.date)
      } else {
        dates.push(otherTimestamp.value.date, anchorTimestamp.value.date)
      }
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

function onMouseDownDay({ scope, event }: { scope: Scope; event: MouseEvent }) {
  if (leftClick(event)) {
    if (
      mobile.value === true &&
      anchorTimestamp.value !== null &&
      otherTimestamp.value !== null &&
      anchorTimestamp.value.date === otherTimestamp.value.date
    ) {
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

function onMouseUpDay({ scope, event }: { scope: Scope; event: MouseEvent }) {
  if (leftClick(event)) {
    // mouse is up, capture last and cancel selection
    otherTimestamp.value = scope.timestamp
    mouseDown.value = false
  }
}

function onMouseMoveDay({ scope /*, event*/ }: { scope: Scope }) {
  if (mouseDown.value === true && scope.outside !== true) {
    otherTimestamp.value = scope.timestamp
  }
}

function onToday() {
  if (calendar.value) {
    calendar.value.moveToToday()
  }
}
function onPrev() {
  if (calendar.value) {
    calendar.value.prev()
  }
}
function onNext() {
  if (calendar.value) {
    calendar.value.next()
  }
}
function onMoved(data: Timestamp) {
  console.info('onMoved', data)
}
function onChange(data: { start: Timestamp; end: Timestamp; days: Timestamp[] }) {
  console.info('onChange', data)
}
function onClickDate(data: Timestamp) {
  console.info('onClickDate', data)
}
// function onClickDay (data) {
//   console.info('onClickDay', data)
// }
function onClickWorkweek(data: Timestamp) {
  console.info('onClickWorkweek', data)
}
function onClickHeadDay(data: Timestamp) {
  console.info('onClickHeadDay', data)
}
function onClickHeadWorkweek(data: Timestamp) {
  console.info('onClickHeadWorkweek', data)
}
</script>
