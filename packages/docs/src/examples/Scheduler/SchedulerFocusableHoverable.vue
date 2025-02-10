<template>
  <div class="subcontent">
    <navigation-bar @today="onToday" @prev="onPrev" @next="onNext" />

    <div class="q-ma-sm row justify-center q-gutter-sm">
      <q-checkbox v-model="hoverable" label="Hoverable" />

      <q-checkbox v-model="focusable" label="Focusable" />

      <q-select
        v-model="focusType"
        label="Focus Type"
        outlined
        dense
        multiple
        map-options
        emit-value
        options-dense
        :options="options"
        style="min-width: 180px"
      />
    </div>

    <div class="row justify-center">
      <div style="display: flex; max-width: 800px; width: 100%; height: 400px">
        <q-calendar-scheduler
          ref="calendar"
          v-model="selectedDate"
          v-model:model-resources="resources"
          view="week"
          :hoverable="hoverable"
          :focusable="focusable"
          :focus-type="focusType"
          animated
          bordered
          style="max-width: 800px; width: 100%"
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

import { ref, watch } from 'vue'
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
  hoverable = ref(true),
  focusable = ref(true),
  focusType = ref([]),
  options = ref(['day', 'weekday', 'date', 'resource']),
  resources = ref<Resource[]>([
    { id: 1, label: 'John' },
    { id: 2, label: 'Mary' },
    { id: 3, label: 'Susan' },
    { id: 4, label: 'Olivia' },
    { id: 5, label: 'Board Room' },
    { id: 6, label: 'Room-1' },
    { id: 7, label: 'Room-2' },
  ])

watch(hoverable, (val) => {
  console.info(`hoverable: ${val}`)
})
watch(focusable, (val) => {
  console.info(`focusable: ${val}`)
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
