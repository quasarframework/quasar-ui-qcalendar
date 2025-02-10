<template>
  <div class="subcontent">
    <navigation-bar @today="onToday" @prev="onPrev" @next="onNext" />

    <div style="display: flex; justify-content: center; align-items: center">
      <q-checkbox v-model="mobile" label="Mobile selection (first click, second click)" />
      <q-checkbox v-model="hover" label="Hover mode" />
    </div>

    <div style="display: flex; justify-content: center; align-items: center; flex-wrap: nowrap">
      <div style="display: flex; max-width: 560px; width: 100%">
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

<script setup lang="ts">
import {
  QCalendarMonth,
  addToDate,
  getDayIdentifier,
  parseTimestamp,
  today,
  Timestamp,
} from '@quasar/quasar-ui-qcalendar'
import '@quasar/quasar-ui-qcalendar/index.css'

import { ref, computed, onBeforeMount } from 'vue'
import NavigationBar from 'components/NavigationBar.vue'

function leftClick(e: MouseEvent) {
  return e.button === 0
}

const calendar1 = ref<QCalendarMonth>(),
  calendar2 = ref<QCalendarMonth>(),
  selectedDate1 = ref(today()),
  selectedDate2 = ref(today()),
  anchorTimestamp = ref<Timestamp | null>(null),
  otherTimestamp = ref<Timestamp | null>(null),
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
      if (anchorTimestamp.value && otherTimestamp.value) {
        dates.push(anchorTimestamp.value.date, otherTimestamp.value.date)
      }
    } else {
      if (otherTimestamp.value && anchorTimestamp.value) {
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

onBeforeMount(() => {
  selectedDate1.value = today()
  let tm = parseTimestamp(selectedDate1.value)
  if (tm) {
    tm = addToDate(tm, { month: 1 })
    selectedDate2.value = tm.date
  }
})

function onMouseDownDay({ scope, event }: { scope: { timestamp: Timestamp }; event: MouseEvent }) {
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

function onMouseUpDay({ scope, event }: { scope: { timestamp: Timestamp }; event: MouseEvent }) {
  if (leftClick(event)) {
    // mouse is up, capture last and cancel selection
    otherTimestamp.value = scope.timestamp
    mouseDown.value = false
  }
}

function onMouseMoveDay({
  scope /*, event*/,
}: {
  scope: { timestamp: Timestamp; outside: boolean }
}) {
  if (mouseDown.value === true && scope.outside !== true) {
    otherTimestamp.value = scope.timestamp
  }
}

function onToday() {
  selectedDate1.value = today()
  let tm = parseTimestamp(selectedDate1.value)
  if (tm) {
    tm = addToDate(tm, { month: 1 })
    selectedDate2.value = tm.date
  }
}
function onPrev() {
  if (calendar1.value && calendar2.value) {
    calendar1.value.prev()
    calendar2.value.prev()
  }
}
function onNext() {
  if (calendar1.value && calendar2.value) {
    calendar1.value.next()
    calendar2.value.next()
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
function onClickDay(data: Timestamp) {
  console.info('onClickDay', data)
}
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
