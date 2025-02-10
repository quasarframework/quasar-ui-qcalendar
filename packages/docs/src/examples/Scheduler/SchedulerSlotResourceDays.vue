<template>
  <div class="subcontent">
    <navigation-bar @today="onToday" @prev="onPrev" @next="onNext" />

    <div class="row justify-center">
      <div style="display: flex; max-width: 800px; width: 100%; height: 400px">
        <q-calendar-scheduler
          ref="calendar"
          v-model="selectedDate"
          v-model:model-resources="resources"
          view="week"
          resource-key="id"
          resource-label="name"
          animated
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
        >
          <template #resource-days="{ scope }">
            <template v-for="(event, index) in getEvents(scope)" :key="index">
              <q-badge outline color="primary" :label="event.title" :style="getStyle(event)" />
            </template>
          </template>
        </q-calendar-scheduler>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { QCalendarScheduler, today, Timestamp } from '@quasar/quasar-ui-qcalendar'
import '@quasar/quasar-ui-qcalendar/index.css'

import { ref, reactive, computed } from 'vue'
import NavigationBar from 'components/NavigationBar.vue'

interface Event {
  dow: number
  title: string
  range?: number
}

interface Scope {
  resource: { id: string }
  cellWidth: string
}

interface Resource {
  id: string
  name: string
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
  ]),
  events = reactive<Record<string, Event[]>>({
    '1': [
      // John
      { dow: 1, title: 'Gym' },
      { dow: 3, title: 'Meeting: Olivia' },
      { dow: 4, title: 'Training', range: 2 },
    ],
    '2': [
      // Board room
    ],
    '2.1': [
      // Room-1
      { dow: 2, title: 'Board Meeting', range: 2 },
    ],
    '2.2': [
      // Room-2
    ],
    '2.2.1': [
      // Partition-A
      { dow: 4, title: 'Corporate Training', range: 2 },
    ],
    '2.2.2': [
      // Partition-B
    ],
    '2.2.3': [
      // Partition-C
    ],
    '3': [
      // Mary
      { dow: 4, title: 'Corporate Training', range: 2 },
      // { start: '12:00', title: 'Lunch', duration: 60 }
    ],
    '4': [
      // Susan
      { dow: 4, title: 'Corporate Training', range: 2 },
      // { start: '12:00', title: 'Lunch', duration: 60 }
    ],
    '5': [
      // Olivia
      { dow: 4, title: 'Corporate Training', range: 2 },
      { dow: 3, title: 'Meeting: John' },
    ],
  })

const styles = computed(() => {
  return {
    '--calendar-resources-width': 150 + 'px',
  }
})

function getEvents(scope: Scope): { left: string; width: string; title: string }[] {
  const evts: { left: string; width: string; title: string }[] = []
  if (events[scope.resource.id]) {
    // get events for the specified resource
    const resourceEvents: Event[] = events[scope.resource.id] || []
    // make sure we have events
    if (resourceEvents && resourceEvents.length > 0) {
      // for each event figure out start position and width
      for (let x = 0; x < resourceEvents.length; ++x) {
        evts.push({
          left: getLeft(scope, resourceEvents[x]!),
          width: getWidth(scope, resourceEvents[x]!),
          title: resourceEvents[x]!.title,
        })
      }
    }
  }
  return evts
}
function getStyle(event: { left: string; width: string }): Record<string, string> {
  return {
    position: 'absolute',
    background: 'white',
    left: event.left,
    width: event.width,
  }
}
function getLeft(scope: Scope, event: Event): string {
  const left = event.dow * parseFloat(scope.cellWidth)
  const val = left + (scope.cellWidth.endsWith('%') ? '%' : 'px')
  return val
}

function getWidth(scope: Scope, event: Event): string {
  const width = (event.range ? event.range : 1) * parseFloat(scope.cellWidth)
  const val = width + (scope.cellWidth.endsWith('%') ? '%' : 'px')
  return val
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

<style lang="scss" scoped>
.my-resource-header {
  display: flex;
  flex-direction: column;
  flex: 1;
  justify-content: center;
  align-items: center;
  position: relative;
  font-size: 14px;
  font-weight: 700;
}
</style>
