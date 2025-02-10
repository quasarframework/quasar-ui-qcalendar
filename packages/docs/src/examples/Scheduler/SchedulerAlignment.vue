<template>
  <div class="subcontent">
    <navigation-bar @today="onToday" @prev="onPrev" @next="onNext" />

    <div class="q-ma-sm row justify-center q-gutter-sm">
      <q-select
        v-model="dateHeader"
        label="date-header"
        outlined
        dense
        options-dense
        :options="['stacked', 'inline', 'inverted']"
        style="min-width: 160px"
      />

      <q-select
        v-model="dateAlign"
        label="date-align"
        outlined
        dense
        options-dense
        :options="['center', 'left', 'right']"
        style="min-width: 160px"
      />

      <q-select
        v-model="weekdayAlign"
        label="weekday-align"
        outlined
        dense
        options-dense
        :options="['center', 'left', 'right']"
        style="min-width: 160px"
      />
    </div>

    <div class="row justify-center">
      <div style="display: flex; max-width: 800px; width: 100%; height: 400px">
        <q-calendar-scheduler
          ref="calendar"
          v-model="selectedDate"
          v-model:model-resources="resources"
          view="week"
          short-weekday-label
          :date-header="dateHeader"
          :weekday-align="weekdayAlign"
          :date-align="dateAlign"
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
import { QCalendarScheduler, today, Timestamp } from '@quasar/quasar-ui-qcalendar'
import '@quasar/quasar-ui-qcalendar/index.css'

import { ref } from 'vue'
import NavigationBar from 'components/NavigationBar.vue'

interface Resource {
  id: string | number
  label: string
  height?: number
  expanded?: boolean
  children?: Resource[]
}

const calendar = ref<QCalendarScheduler>(),
  selectedDate = ref(today()),
  dateAlign = ref('center'),
  weekdayAlign = ref('center'),
  dateHeader = ref('stacked'),
  resources = ref<Resource[]>([
    { id: 1, label: 'John' },
    { id: 2, label: 'Mary' },
    { id: 3, label: 'Susan' },
    { id: 4, label: 'Olivia' },
    { id: 5, label: 'Board Room' },
    { id: 6, label: 'Room-1' },
    { id: 7, label: 'Room-2' },
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
