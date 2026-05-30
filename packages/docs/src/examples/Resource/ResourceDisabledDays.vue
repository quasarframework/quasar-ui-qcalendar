<template>
  <div class="subcontent">
    <navigation-bar @today="onToday" @prev="onPrev" @next="onNext" />

    <div class="row justify-center">
      <div
        class="q-gutter-md"
        style="display: flex; flex-direction: column; max-width: 900px; width: 100%; height: 720px"
      >
        <q-calendar-resource
          ref="calendar"
          v-model="selectedDate"
          v-model:model-resources="resources"
          resource-key="id"
          resource-label="name"
          :disabled-days="disabledDays"
          :interval-count="8"
          :interval-start="8"
          :max-days="4"
          animated
          bordered
          @change="onChange"
          @moved="onMoved"
          @resource-expanded="onResourceExpanded"
          @click-date="onClickDate"
          @click-time="onClickTime"
          @click-resource="onClickResource"
          @click-head-resources="onClickHeadResources"
          @click-interval="onClickInterval"
        />
        <q-calendar-resource
          ref="calendar2"
          v-model="selectedDate"
          v-model:model-resources="resources"
          resource-key="id"
          resource-label="name"
          :disabled-days="disabledDaysRange"
          :interval-count="8"
          :interval-start="8"
          :max-days="4"
          animated
          bordered
          @change="onChange"
          @moved="onMoved"
          @resource-expanded="onResourceExpanded"
          @click-date="onClickDate"
          @click-time="onClickTime"
          @click-resource="onClickResource"
          @click-head-resources="onClickHeadResources"
          @click-interval="onClickInterval"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  QCalendarResource,
  addToDate,
  parseTimestamp,
  today,
  Timestamp,
} from '@quasar/quasar-ui-qcalendar'
import '@quasar/quasar-ui-qcalendar/index.css'

import { computed, ref } from 'vue'
import NavigationBar from '@/components/NavigationBar.vue'

interface Resource {
  id: string
  name: string
  height?: number
  expanded?: boolean
  children?: Resource[]
}

const calendar = ref<QCalendarResource>()
const calendar2 = ref<QCalendarResource>()

const selectedDate = ref(today())

const resources = ref<Resource[]>([
  { id: '1', name: 'Room 101' },
  { id: '2', name: 'Room 102' },
  { id: '3', name: 'Room 103' },
  { id: '4', name: 'Room 104' },
])

const disabledDays = computed(() => {
  const ts = parseTimestamp(today())
  // make the next 3 days, after today, disabled
  return Array.from({ length: 3 }, (_, i) => addToDate(ts!, { day: i + 1 }).date)
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
  calendar.value?.moveToToday()
  calendar2.value?.moveToToday()
}
function onPrev() {
  calendar.value?.prev()
  calendar2.value?.prev()
}
function onNext() {
  calendar.value?.next()
  calendar2.value?.next()
}
function onMoved(data: Timestamp) {
  console.info('onMoved', data)
}
function onChange(data: { start: Timestamp; end: Timestamp; days: Timestamp[] }) {
  console.info('onChange', data)
}
function onResourceExpanded(data: Timestamp) {
  console.info('onResourceExpanded', data)
}
function onClickDate(data: Timestamp) {
  console.info('onClickDate', data)
}
function onClickTime(data: Timestamp) {
  console.info('onClickTime', data)
}
function onClickResource(data: Timestamp) {
  console.info('onClickResource', data)
}
function onClickHeadResources(data: Timestamp) {
  console.info('onClickHeadResources', data)
}
function onClickInterval(data: Timestamp) {
  console.info('onClickInterval', data)
}
</script>
