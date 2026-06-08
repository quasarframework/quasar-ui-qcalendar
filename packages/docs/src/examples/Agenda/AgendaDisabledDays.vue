<template>
  <div class="subcontent">
    <navigation-bar @today="onToday" @prev="onPrev" @next="onNext" />

    <div class="row justify-center">
      <div
        class="q-gutter-md"
        style="display: flex; flex-direction: column; max-width: 800px; width: 90%"
      >
        <q-calendar-agenda
          ref="calendar"
          v-model="selectedDate"
          view="week"
          :disabled-days="disabledDays"
          :left-column-options="leftColumnOptions"
          :right-column-options="rightColumnOptions"
          column-options-id="id"
          column-options-label="label"
          :day-min-height="200"
          animated
          bordered
          style="max-height: 200px"
          @change="onChange"
          @moved="onMoved"
          @click-date="onClickDate"
          @click-time="onClickTime"
          @click-interval="onClickInterval"
          @click-head-intervals="onClickHeadIntervals"
          @click-head-day="onClickHeadDay"
        />
        <q-calendar-agenda
          ref="calendar2"
          v-model="selectedDate"
          view="week"
          :disabled-days="disabledDaysRange"
          :left-column-options="leftColumnOptions"
          :right-column-options="rightColumnOptions"
          column-options-id="id"
          column-options-label="label"
          :day-min-height="200"
          animated
          bordered
          style="max-height: 200px"
          @change="onChange"
          @moved="onMoved"
          @click-date="onClickDate"
          @click-time="onClickTime"
          @click-interval="onClickInterval"
          @click-head-intervals="onClickHeadIntervals"
          @click-head-day="onClickHeadDay"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { QCalendarAgenda } from '@quasar/quasar-ui-qcalendar'
import { addToDate, parseTimestamp, Timestamp } from '@timestamp-js/core'
import '@quasar/quasar-ui-qcalendar/index.css'
import { ref, computed } from 'vue'
import NavigationBar from '@/components/NavigationBar.vue'

const calendar = ref<QCalendarAgenda>()
const selectedDate = ref('2026-05-26')
const leftColumnOptions = ref([
  {
    id: 'overdue',
    label: 'Overdue',
  },
])
const rightColumnOptions = ref([
  {
    id: 'summary',
    label: 'Summary',
  },
])

const disabledDays = computed(() => {
  const ts = parseTimestamp(selectedDate.value)
  // make 4 visible days disabled, starting with the selected date
  return Array.from({ length: 4 }, (_, i) => addToDate(ts!, { day: i }).date)
})

const disabledDaysRange = computed(() => {
  // create a reservation-style range for example 2
  return [
    {
      from: disabledDays.value[0],
      to: disabledDays.value[disabledDays.value.length - 1],
      color: '#ef5350',
      textColor: '#ffffff',
      label: 'Reserved',
    },
  ]
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
function onClickTime(data: Timestamp) {
  console.info('onClickTime', data)
}
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
