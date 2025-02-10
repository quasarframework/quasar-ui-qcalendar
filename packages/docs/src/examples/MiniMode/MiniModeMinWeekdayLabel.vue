<template>
  <div class="subcontent">
    <navigation-bar @today="onToday" @prev="onPrev" @next="onNext" />

    <div style="display: flex; justify-content: center; align-items: center">
      <div>Min. Weekday Label:</div>
    </div>

    <div style="display: flex; justify-content: center; align-items: center">
      <q-option-group v-model="minWeekdayLabel" :options="options" type="radio" inline />
    </div>

    <div style="display: flex; justify-content: center; align-items: center; flex-wrap: nowrap">
      <div style="display: flex; max-width: 280px; width: 100%">
        <q-calendar-month
          ref="calendar"
          v-model="selectedDate"
          mini-mode
          short-weekday-label
          :min-weekday-label="minWeekdayLabel"
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

const calendar = ref<QCalendarMonth>()
const selectedDate = ref(today())
const minWeekdayLabel = ref(1)
const options = ref([
  { label: '1 Char.', value: 1 },
  { label: '2 Char.', value: 2 },
  { label: '3 Char.', value: 3 },
])

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
