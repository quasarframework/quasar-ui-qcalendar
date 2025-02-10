<template>
  <div class="subcontent">
    <navigation-bar @today="onToday" @prev="onPrev" @next="onNext" />

    <div style="display: flex; justify-content: center; align-items: center; flex-wrap: nowrap">
      <div style="display: flex; max-width: 280px; width: 100%">
        <q-calendar-month
          ref="calendar"
          v-model="selectedDate"
          mini-mode
          no-active-date
          :selected-dates="selectedDates"
          animated
          bordered
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
import { QCalendarMonth, today, Timestamp } from '@quasar/quasar-ui-qcalendar'
import '@quasar/quasar-ui-qcalendar/index.css'

import { ref } from 'vue'
import NavigationBar from 'components/NavigationBar.vue'

function leftClick(e: MouseEvent) {
  return e.button === 0
}

const calendar = ref<QCalendarMonth>(),
  selectedDate = ref(today())
const selectedDates = ref<string[]>([])

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
function onClickDate({ scope, event }: { scope: { timestamp: Timestamp }; event: MouseEvent }) {
  console.info('onClickDate', { scope, event })
  if (leftClick(event)) {
    if (selectedDates.value.includes(scope.timestamp.date)) {
      // remove the date
      for (let i = 0; i < selectedDates.value.length; ++i) {
        if (scope.timestamp.date === selectedDates.value[i]) {
          selectedDates.value.splice(i, 1)
          break
        }
      }
    } else {
      // add the date
      selectedDates.value.push(scope.timestamp.date)
    }
  }
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
