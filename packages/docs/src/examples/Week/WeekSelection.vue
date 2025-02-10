<template>
  <div class="subcontent">
    <navigation-bar @today="onToday" @prev="onPrev" @next="onNext" />

    <div style="display: flex; justify-content: center; align-items: center">
      <q-checkbox v-model="mobile" label="Mobile selection (first click, second click)" />
    </div>

    <div class="row justify-center">
      <div style="display: flex; max-width: 800px; width: 100%; height: 400px">
        <q-calendar-day
          ref="calendar"
          v-model="selectedDate"
          view="week"
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
  </div>
</template>

<script setup lang="ts">
import {
  QCalendarDay,
  today,
  getDayTimeIdentifier,
  getDateTime,
  Timestamp,
} from '@quasar/quasar-ui-qcalendar'
import '@quasar/quasar-ui-qcalendar/index.css'
import { ref, computed } from 'vue'
import NavigationBar from 'components/NavigationBar.vue'

function leftClick(e: MouseEvent) {
  return e.button === 0
}

const calendar = ref<QCalendarDay>(),
  selectedDate = ref(today()),
  anchorTimestamp = ref<Timestamp | null>(null),
  otherTimestamp = ref<Timestamp | null>(null),
  mouseDown = ref(false),
  mobile = ref(true)

const startEndDates = computed(() => {
  const dates = []
  if (anchorDayTimeIdentifier.value !== false && otherDayTimeIdentifier.value !== false) {
    if (anchorDayTimeIdentifier.value <= otherDayTimeIdentifier.value) {
      dates.push(getDateTime(anchorTimestamp.value!), getDateTime(otherTimestamp.value!))
    } else {
      dates.push(getDateTime(otherTimestamp.value!), getDateTime(anchorTimestamp.value!))
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

function onMouseDownTime({ scope, event }: { scope: any; event: MouseEvent }) {
  console.info('onMouseDownTime', { scope, event })
  if (leftClick(event)) {
    if (
      mobile.value === true &&
      anchorTimestamp.value !== null &&
      otherTimestamp.value !== null &&
      getDateTime(anchorTimestamp.value) === getDateTime(otherTimestamp.value)
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

function onMouseUpTime({ scope, event }: { scope: any; event: MouseEvent }) {
  if (mobile.value !== true && leftClick(event)) {
    // mouse is up, capture last and cancel selection
    otherTimestamp.value = scope.timestamp
    mouseDown.value = false
  }
}

function onMouseMoveTime({ scope }: { scope: any /*, event*/ }) {
  if (mobile.value !== true && mouseDown.value === true) {
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
// function onClickTime(data: Timestamp) {
//   console.info('onClickTime', data)
// }
function onClickInterval(data: Timestamp) {
  console.info('onClickInterval', data)
}
function onClickHeadIntervals(data: Timestamp) {
  console.info('onClickHeadIntervals', data)
}
function onClickHeadDay(data: Timestamp) {
  console.info('onClickHeadDay', data)
}
</script>
