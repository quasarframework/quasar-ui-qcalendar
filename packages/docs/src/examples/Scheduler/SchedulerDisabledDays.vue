<template>
  <div class="subcontent">
    <navigation-bar @today="onToday" @prev="onPrev" @next="onNext" />

    <div class="row justify-center">
      <div
        class="q-gutter-md"
        style="display: flex; flex-direction: column; max-width: 800px; width: 90%; height: 500px"
      >
        <q-calendar-scheduler
          ref="calendar"
          v-model="selectedDate"
          v-model:model-resources="resources"
          view="week"
          :disabled-days="disabledDays"
          animated
          bordered
          @change="onChange"
          @moved="onMoved"
          @click-date="onClickDate"
          @click-day-resource="onClickDayResource"
          @click-resource="onClickResource"
          @click-head-resources="onClickHeadResources"
          @click-head-day="onClickHeadDay"
        />
        <q-calendar-scheduler
          ref="calendar2"
          v-model="selectedDate"
          v-model:model-resources="resources"
          view="week"
          :disabled-days="disabledDaysRange"
          animated
          bordered
          @change="onChange"
          @moved="onMoved"
          @click-date="onClickDate"
          @click-day-resource="onClickDayResource"
          @click-resource="onClickResource"
          @click-head-resources="onClickHeadResources"
          @click-head-day="onClickHeadDay"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { QCalendarScheduler } from '@quasar/quasar-ui-qcalendar'
import { addToDate, parseTimestamp, Timestamp } from '@timestamp-js/core'
import '@quasar/quasar-ui-qcalendar/index.css'

import { ref, computed } from 'vue'
import NavigationBar from '@/components/NavigationBar.vue'

interface Resource {
  id: string | number
  label: string
  height?: number
  expanded?: boolean
  children?: Resource[]
}

const calendar = ref<QCalendarScheduler>(),
  selectedDate = ref('2026-05-26'),
  resources = ref<Resource[]>([
    { id: 1, label: 'John' },
    { id: 2, label: 'Mary' },
    { id: 3, label: 'Susan' },
    { id: 4, label: 'Olivia' },
    { id: 5, label: 'Board Room' },
    { id: 6, label: 'Room-1' },
    { id: 7, label: 'Room-2' },
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
function onClickDayResource(data: Timestamp) {
  console.info('onClickDayResource', data)
}
function onClickResource(data: Timestamp) {
  console.info('onClickResource', data)
}
function onClickHeadResources(data: Timestamp) {
  console.info('onClickHeadResources', data)
}
function onClickHeadDay(data: Timestamp) {
  console.info('onClickHeadDay', data)
}
</script>
