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
          @change="onChange"
          @moved="onMoved"
          @resource-expanded="onResourceExpanded"
          @click-date="onClickDate"
          @click-time="onClickTime"
          @click-resource="onClickResource"
          @click-head-resources="onClickHeadResources"
          @click-interval="onClickInterval"
        >
          <template #interval-label="{ scope }">
            <div class="my-resource-header">
              {{ showDate(scope) }}
            </div>
          </template>
        </q-calendar-resource>
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
}

const calendar = ref<QCalendarResource>(),
  selectedDate = ref(today()),
  locale = ref('en-US'),
  resources = ref<Resource[]>([
    { id: '1', name: 'John' },
    { id: '2', name: 'Board Room' },
    { id: '3', name: 'Mary' },
    { id: '4', name: 'Susan' },
    { id: '5', name: 'Olivia' },
  ])

function showDate(scope: { label: string; timestamp: Timestamp }) {
  if (scope.timestamp.date) {
    const date = new Date(scope.timestamp.date)
    /// @ts-expect-error ignore for now
    return monthFormatter().format(date) + (scope?.label ? '-' + scope.label : '')
  }
  return ''
}

function monthFormatter() {
  try {
    return new Intl.DateTimeFormat(locale.value || undefined, {
      day: '2-digit',
      month: 'short',
      year: '2-digit',
      timeZone: 'UTC',
    })
  } catch {
    //
  }
}

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

<style lang="scss" scoped>
.my-resource-header {
  display: block;
  width: 100%;
  position: relative;
  font-size: 10px;
  font-weight: 700;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
}
</style>
