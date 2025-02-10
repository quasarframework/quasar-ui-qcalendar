<template>
  <div class="subcontent">
    <navigation-bar @today="onToday" @prev="onPrev" @next="onNext" />

    <div style="display: flex; justify-content: center; width: 100%">
      <div style="margin: 10px">
        <q-list dense bordered separator>
          <q-item
            v-for="item in dragItems"
            :key="item.id"
            draggable="true"
            @dragstart="onDragStart($event, item)"
          >
            <q-item-section>{{ item.name }}</q-item-section>
          </q-item>
        </q-list>
      </div>
      <div
        style="display: flex; justify-content: center; max-width: 800px; width: 100%; height: 400px"
      >
        <q-calendar-scheduler
          ref="calendar"
          v-model="selectedDate"
          v-model:model-resources="resources"
          view="week"
          :drag-enter-func="onDragEnter"
          :drag-over-func="onDragOver"
          :drag-leave-func="onDragLeave"
          :drop-func="onDrop"
          :weekday-class="onWeekdayClass"
          :day-class="onDayClass"
          :weekdays="[1, 2, 3, 4, 5]"
          hoverable
          animated
          bordered
          :day-min-height="50"
          :day-height="0"
          style="max-width: 800px; width: 100%"
          @change="onChange"
          @moved="onMoved"
          @click-date="onClickDate"
          @click-day-resource="onClickDayResource"
          @click-resource="onClickResource"
          @click-head-resources="onClickHeadResources"
          @click-head-day="onClickHeadDay"
        >
          <template #head-date="{ scope }">
            <div
              v-if="
                allDayEventsMap[scope.timestamp.date] &&
                (allDayEventsMap[scope.timestamp.date] ?? []).length > 0
              "
              style="
                display: flex;
                justify-content: space-evenly;
                flex-wrap: wrap;
                align-items: center;
                font-weight: 400;
                font-size: 12px;
                height: auto;
              "
            >
              <template v-for="event in allDayEventsMap[scope.timestamp.date]" :key="event.time">
                <div
                  style="
                    display: flex;
                    flex: 1 0 auto;
                    flex-wrap: wrap;
                    justify-content: space-evenly;
                    align-items: center;
                    font-size: 12px;
                  "
                >
                  {{ event.name }}
                </div>
              </template>
            </div>
          </template>

          <template #day="{ scope }">
            <div
              v-if="hasEvents(scope.timestamp, scope.resource)"
              style="
                display: flex;
                flex: 1 0 auto;
                flex-wrap: wrap;
                justify-content: space-evenly;
                align-items: center;
                font-size: 12px;
              "
            >
              <template v-for="event in getEvents(scope.timestamp, scope.resource)" :key="event.id">
                <span
                  v-if="event.resource"
                  style="
                    border: 1px solid pink;
                    border-radius: 2px;
                    padding: 2px;
                    margin: 1px;
                    user-select: none;
                  "
                >
                  {{ event.name }}
                </span>
              </template>
            </div>
          </template>
        </q-calendar-scheduler>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { QCalendarScheduler, today, type Timestamp } from '@quasar/quasar-ui-qcalendar'
import '@quasar/quasar-ui-qcalendar/index.css'

import { ref, reactive, computed } from 'vue'
import NavigationBar from 'components/NavigationBar.vue'

interface Resource {
  id: number
  label: string
}

interface Item {
  id: number
  name: string
}

interface Event {
  id: number
  type: number
  name: string
  date: string
  time: string
  allDay: boolean
  resource: Resource
}

const calendar = ref<QCalendarScheduler>(),
  selectedDate = ref(today()),
  resources = ref<Resource[]>([
    { id: 1, label: 'John' },
    { id: 2, label: 'Mary' },
    { id: 3, label: 'Susan' },
    { id: 4, label: 'Olivia' },
    { id: 5, label: 'Board Room' },
    { id: 6, label: 'Room-1' },
    { id: 7, label: 'Room-2' },
  ]),
  dragItems = reactive<Item[]>([
    {
      id: 1,
      name: 'Appointment',
    },
    {
      id: 2,
      name: 'Reminder',
    },
    {
      id: 3,
      name: 'Task',
    },
  ]),
  defaultEvent = {
    id: 0,
    type: 0,
    name: '',
    date: '',
    time: '',
    allDay: false,
    resource: { id: 0, label: '' },
  },
  events = reactive<Event[]>([])

// convert the events into a map of lists keyed by date
const eventsMap = computed(() => {
  const map: { [key: string]: Event[] } = {}
  if (events.length > 0) {
    events.forEach((event) => (map[event.date] = map[event.date] || []).push(event))
  }
  // console.info('eventsMap', map)
  return map
})

const allDayEventsMap = computed(() => {
  const map: { [key: string]: Event[] } = {}
  if (events.length > 0) {
    events.forEach(
      (event) => event.allDay === true && (map[event.date] = map[event.date] || []).push(event),
    )
  }
  return map
})

interface Scope {
  scope: any
}

interface DropScope extends Scope {
  timestamp: Timestamp
  resource: Resource
}

function onDragStart(e: DragEvent, item: Item) {
  console.info('onDragStart called')
  if (e.dataTransfer) {
    e.dataTransfer.dropEffect = 'copy'
    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.setData('ID', String(item.id))
  }
}

function onDragEnter(e: DragEvent, type: string, { scope }: DropScope) {
  console.info('onDragEnter', type, scope)
  if (type === 'day' || type === 'head-day') {
    e.preventDefault()
    return true
  }
}

function onDragOver(e: DragEvent, type: string, { scope }: DropScope) {
  console.info('onDragOver', type, scope)
  if (type === 'day' || type === 'head-day') {
    e.preventDefault()
    return true
  }
}

function onDragLeave(e: DragEvent, type: string, { scope }: DropScope) {
  console.info('onDragLeave', type, scope)
  if (type === 'day' || type === 'head-day') {
    return false
  }
}

function onDrop(e: DragEvent, type: string, { scope }: DropScope) {
  console.info('onDrop', type, scope)
  if (type === 'day' || type === 'head-day') {
    if (!e.dataTransfer) {
      return
    }
    const itemID = parseInt(e.dataTransfer.getData('ID'), 10)
    const event: Event = { ...defaultEvent }
    event.id = events.length + 1
    const item = dragItems.filter((item) => item.id === itemID)
    event.type = item[0]!.id
    event.name = item[0]!.name
    event.date = scope.timestamp.date
    event.resource = scope.resource
    if (type === 'head-day') {
      event.allDay = true
    }
    events.push(event)
    return false
  }
}

function getEvents(timestamp: Timestamp, resource: Resource) {
  if (resource) {
    const events = eventsMap.value[timestamp.date]
    if (events) {
      return events.filter((item) => {
        if (item.resource) {
          return item.date === timestamp.date && item.resource.id === resource.id
        }
        return item.date === timestamp.date
      })
    }
  }
  return []
}

function hasEvents(timestamp: Timestamp, resource: Resource) {
  return getEvents(timestamp, resource).length > 0
}

function onDayClass({ scope }: { scope: { droppable: boolean } }) {
  return {
    droppable: scope.droppable === true,
  }
}

function onWeekdayClass({ scope }: { scope: { droppable: boolean } }) {
  return {
    droppable: scope.droppable === true,
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

<style lang="scss">
.droppable {
  box-shadow: inset 0 0 0 1px rgba(0, 140, 200, 0.8);
}
</style>
