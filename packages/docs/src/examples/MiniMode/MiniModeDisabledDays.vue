<template>
  <div class="subcontent">
    <navigation-bar @today="onToday" @prev="onPrev" @next="onNext" />

    <div class="row justify-center">
      <div
        class="q-gutter-md"
        style="display: flex; flex-direction: column; max-width: 280px; width: 100%"
      >
        <q-calendar-month
          ref="calendar"
          v-model="selectedDate"
          mini-mode
          :disabled-days="disabledDays"
          no-outside-days
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
        <q-calendar-month
          ref="calendar2"
          v-model="selectedDate"
          mini-mode
          :disabled-days="disabledDaysRange"
          no-outside-days
          animated
          bordered
          style="max-width: 280px; width: 100%"
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
  parseTimestamp,
  today,
  Timestamp,
} from '@quasar/quasar-ui-qcalendar'
import '@quasar/quasar-ui-qcalendar/index.css'

import { ref, computed } from 'vue'
import NavigationBar from 'components/NavigationBar.vue'

const calendar = ref<QCalendarMonth>()
const selectedDate = ref(today())

const disabledDays = computed(() => {
  const ts = parseTimestamp(today())
  // make next 4 days, after today, disabled
  return Array.from({ length: 4 }, (_, i) => addToDate(ts!, { day: i + 1 }).date)
})

const disabledDaysRange = computed(() => {
  // create the range for example 2
  // Note: this is an array, within an array
  return [[disabledDays.value[0], disabledDays.value[disabledDays.value.length - 1]]]
})

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
