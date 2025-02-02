<template>
  <div class="subcontent">
    <navigation-bar @today="onToday" @prev="onPrev" @next="onNext" />

    <div style="display: flex; justify-content: center; align-items: center">
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
        class="button"
        style="min-width: 180px"
      />
    </div>

    <div class="row justify-center">
      <div style="display: flex; max-width: 800px; width: 100%; max-max-height: 400px">
        <q-calendar-resource
          ref="calendar"
          v-model="selectedDate"
          v-model:model-resources="resources"
          resource-key="id"
          resource-label="name"
          :hoverable="hoverable"
          :focusable="focusable"
          :focus-type="focusType"
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
import { QCalendarResource, today, Timestamp } from '@quasar/quasar-ui-qcalendar'
import '@quasar/quasar-ui-qcalendar/index.css'

import { ref, reactive } from 'vue'
import NavigationBar from 'components/NavigationBar.vue'

const calendar = ref<QCalendarResource>(),
  selectedDate = ref(today()),
  hoverable = ref(true),
  focusable = ref(true),
  focusType = ref([]),
  options = ref(['interval', 'time', 'resource']),
  resources = reactive([
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
