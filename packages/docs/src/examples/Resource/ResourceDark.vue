<template>
  <div class="subcontent">
    <navigation-bar @today="onToday" @prev="onPrev" @next="onNext" />

    <div class="row justify-center">
      <div style="display: flex; max-width: 800px; width: 100%; max-height: 400px">
        <q-calendar-resource
          ref="calendar"
          v-model="selectedDate"
          v-model:model-resources="resources"
          resource-key="id"
          resource-label="name"
          animated
          bordered
          dark
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
import { QCalendarResource, today, Timestamp } from '@quasar/quasar-ui-qcalendar'
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

const calendar = ref<QCalendarResource>(),
  selectedDate = ref(today()),
  resources = ref<Resource[]>([
    { id: '1', name: 'John' },
    { id: '2', name: 'Board Room' },
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
  console.log('onMoved', data)
}
function onChange(data: { start: Timestamp; end: Timestamp; days: Timestamp[] }) {
  console.log('onChange', data)
}
function onResourceExpanded(data: Timestamp) {
  console.log('onResourceExpanded', data)
}
function onClickDate(data: Timestamp) {
  console.log('onClickDate', data)
}
function onClickTime(data: Timestamp) {
  console.log('onClickTime', data)
}
function onClickResource(data: Timestamp) {
  console.log('onClickResource', data)
}
function onClickHeadResources(data: Timestamp) {
  console.log('onClickHeadResources', data)
}
function onClickInterval(data: Timestamp) {
  console.log('onClickInterval', data)
}
</script>
