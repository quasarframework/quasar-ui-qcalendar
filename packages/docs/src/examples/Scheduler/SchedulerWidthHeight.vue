<template>
  <div class="subcontent">
    <navigation-bar @today="onToday" @prev="onPrev" @next="onNext" />

    <div class="row justify-center full-width">
      <div class="column justify-center">
        <div class="row justify-evenly q-gutter-sm q-mb-lg">
          <span class="no-wrap">Note: setting Resource Height to 0 will make it 'auto' height</span>
        </div>
        <div class="row justify-evenly no-wrap q-gutter-sm" style="width: 600px">
          <span class="col-shrink no-wrap" style="min-width: 142px">Resource Width</span>
          <q-slider v-model="resourceWidth" label label-always :min="60" :max="200" class="col" />
        </div>
        <div class="row justify-evenly no-wrap q-gutter-sm" style="width: 600px">
          <span class="col-shrink no-wrap" style="min-width: 142px">Resource Height</span>
          <q-slider v-model="resourceHeight" label label-always :min="0" :max="200" class="col" />
        </div>
        <div class="row justify-evenly no-wrap q-gutter-sm" style="width: 600px">
          <span class="col-shrink no-wrap" style="min-width: 142px">Resource Min. Height</span>
          <q-slider
            v-model="resourceMinHeight"
            label
            label-always
            :min="0"
            :max="200"
            class="col"
          />
        </div>
        <div class="row justify-evenly no-wrap q-gutter-sm" style="width: 600px">
          <span class="col-shrink no-wrap" style="min-width: 142px">Cell Width</span>
          <q-slider v-model="cellWidth" label label-always :min="50" :max="250" class="col" />
        </div>
      </div>
    </div>

    <div class="row justify-center">
      <div style="display: flex; max-width: 800px; width: 100%">
        <q-calendar-scheduler
          ref="calendar"
          v-model="selectedDate"
          v-model:model-resources="resources"
          view="week"
          resource-key="id"
          resource-label="name"
          :resource-height="resourceHeight"
          :resource-min-height="resourceMinHeight"
          :cell-width="cellWidth"
          bordered
          :style="styles"
          @change="onChange"
          @moved="onMoved"
          @resource-expanded="onResourceExpanded"
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

import { ref, computed } from 'vue'
import NavigationBar from 'components/NavigationBar.vue'

interface Resource {
  id: string | number
  name: string
  height?: number
  expanded?: boolean
  children?: Resource[]
}

const calendar = ref<QCalendarScheduler>(),
  selectedDate = ref(today()),
  resourceWidth = ref(100),
  resourceHeight = ref(70),
  resourceMinHeight = ref(20),
  cellWidth = ref(200),
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

const styles = computed(() => {
  return {
    '--calendar-resources-width': resourceWidth.value + 'px',
  }
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
function onResourceExpanded(data: Timestamp) {
  console.info('onResourceExpanded', data)
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
