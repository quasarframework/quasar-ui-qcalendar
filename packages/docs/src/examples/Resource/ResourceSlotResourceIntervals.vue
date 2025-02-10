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
          :interval-start="6"
          :interval-count="12"
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
          <template #resource-intervals="{ scope }">
            <template v-for="(event, index) in getEvents(scope)" :key="index">
              <q-badge outline color="primary" :label="event.title" :style="getStyle(event)" />
            </template>
          </template>
        </q-calendar-resource>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { QCalendarResource, today, Timestamp } from '@quasar/quasar-ui-qcalendar'
import '@quasar/quasar-ui-qcalendar/index.css'

import { ref, reactive } from 'vue'
import NavigationBar from 'components/NavigationBar.vue'

interface Resource {
  id: string
  name: string
  expanded?: boolean
  children?: Resource[]
}

interface Event {
  start: string
  title: string
  duration: number
}
const calendar = ref<QCalendarResource>(),
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
    1: [
      // John
      { start: '06:00', title: 'Gym', duration: 90 },
      {
        start: '08:00',
        title: 'Corporate Training - Partition A (Train new hires)',
        duration: 240,
      },
      { start: '12:00', title: 'Lunch', duration: 60 },
    ],
    2: [
      // Board room
    ],
    2.1: [
      // Room-1
      { start: '08:00', title: 'Board Meeting', duration: 120 },
    ],
    2.2: [
      // Room-2
    ],
    '2.2.1': [
      // Partition-A
      { start: '08:00', title: 'Corporate Training', duration: 240 },
    ],
    '2.2.2': [
      // Partition-B
    ],
    '2.2.3': [
      // Partition-C
    ],
    3: [
      // Mary
      { start: '08:00', title: 'Corporate Training - Partition A', duration: 240 },
      { start: '12:00', title: 'Lunch', duration: 60 },
    ],
    4: [
      // Susan
      { start: '08:00', title: 'Corporate Training - Partition A', duration: 240 },
      { start: '12:00', title: 'Lunch', duration: 60 },
    ],
    5: [
      // Olivia
      { start: '08:00', title: 'Corporate Training - Partition A', duration: 240 },
      { start: '12:00', title: 'Lunch', duration: 60 },
    ],
  })

interface Scope {
  resource: Resource
  timeStartPosX: (_time: string) => number
  timeDurationWidth: (_duration: number) => number
}

interface EventWithPosition {
  left: number
  width: number
  title: string
}

function getEvents(scope: Scope): EventWithPosition[] {
  const evts: EventWithPosition[] = []
  if (events[scope.resource.id]) {
    // get events for the specified resource
    const resourceEvents = events[scope.resource.id]
    // make sure we have events
    if (resourceEvents && resourceEvents.length > 0) {
      // for each events figure out start position and width
      for (let x = 0; x < resourceEvents.length; ++x) {
        evts.push({
          left: scope.timeStartPosX(resourceEvents[x]!.start),
          width: scope.timeDurationWidth(resourceEvents[x]!.duration),
          title: resourceEvents[x]!.title,
        })
      }
    }
  }
  return evts
}

function getStyle(event: EventWithPosition): Record<string, string> {
  return {
    position: 'absolute',
    background: 'white',
    left: event.left + 'px',
    width: event.width + 'px',
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
