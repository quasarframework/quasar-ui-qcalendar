<template>
  <div class="subcontent">
    <navigation-bar @today="onToday" @prev="onPrev" @next="onNext" />

    <div class="row justify-center">
      <div style="display: flex; max-width: 800px; width: 100%; height: 300px">
        <q-calendar-scheduler
          ref="calendar"
          v-model="selectedDate"
          v-model:model-resources="resources"
          view="month"
          cell-width="200px"
          resource-key="id"
          resource-label="name"
          weekday-align="right"
          date-align="left"
          date-header="inline"
          short-weekday-label
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
  id: string
  name: string
  height?: number
  expanded?: boolean
  children?: Resource[]
}

const calendar = ref<QCalendarScheduler>(),
  selectedDate = ref(today()),
  resources = ref<Resource[]>([
    { id: '1', name: 'John' },
    {
      id: '2',
      name: 'Board Room',
      expanded: false,
      children: [
        { id: '2.1', name: 'Room-1' },
        {
          id: '2.2',
          name: 'Room-2',
          expanded: false,
          children: [
            { id: '2.2.1', name: 'Partition-A' },
            { id: '2.2.2', name: 'Partition-B' },
            { id: '2.2.3', name: 'Partition-C' },
          ],
        },
      ],
    },
    { id: '3', name: 'Mary' },
    { id: '4', name: 'Susan' },
    { id: '5', name: 'Olivia' },
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
