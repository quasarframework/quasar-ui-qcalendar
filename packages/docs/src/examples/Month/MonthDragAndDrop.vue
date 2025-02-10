<template>
  <div class="subcontent">
    <navigation-bar @today="onToday" @prev="onPrev" @next="onNext" />

    <div class="row justify-center">
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

        <div style="display: flex; justify-content: center; max-width: 600px; width: 100%">
          <q-calendar-month
            ref="calendar"
            v-model="selectedDate"
            :weekdays="[1, 2, 3, 4, 5]"
            hoverable
            bordered
            animated
            :day-min-height="50"
            :day-height="0"
            :day-class="onDayClass"
            :weekday-class="onWeekdayClass"
            :drag-enter-func="onDragEnter"
            :drag-over-func="onDragOver"
            :drag-leave-func="onDragLeave"
            :drop-func="onDrop"
            @change="onChange"
            @moved="onMoved"
            @click-date="onClickDate"
            @click-day="onClickDay"
            @click-workweek="onClickWorkweek"
            @click-head-workweek="onClickHeadWorkweek"
            @click-head-day="onClickHeadDay"
          >
            <template #head-day-event="{ scope }">
              <div
                v-if="hasWeekdayEvents(scope.weekday) && printScope(scope)"
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
                <template
                  v-for="(event, index) in getWeekdayEvents(scope.weekday)"
                  :key="event.weekday + index"
                >
                  <span
                    style="border: 1px solid pink; border-radius: 2px; padding: 2px; margin: 1px"
                  >
                    {{ event.name }}
                  </span>
                </template>
              </div> </template
            >"

            <template #day="{ scope }">
              <div
                v-if="hasEvents(scope.timestamp) && printScope(scope)"
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
                <template v-for="event in getEvents(scope.timestamp)" :key="event.time">
                  <span
                    style="border: 1px solid pink; border-radius: 2px; padding: 2px; margin: 1px"
                  >
                    {{ event.name }}
                  </span>
                </template>
              </div>
            </template>
          </q-calendar-month>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { QCalendarMonth, today, Timestamp } from '@quasar/quasar-ui-qcalendar'
import '@quasar/quasar-ui-qcalendar/index.css'

import { ref, reactive, computed } from 'vue'
import NavigationBar from 'components/NavigationBar.vue'

interface Event {
  id: number
  type?: number
  name: string
  date?: string
  time?: string
  allDay?: boolean
  weekday?: number
}

const calendar = ref<QCalendarMonth>(),
  selectedDate = ref(today()),
  dragItems = reactive<Event[]>([
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
  defaultEvent: Event = {
    id: 0,
    type: 0,
    name: '',
    date: '',
    time: '',
    allDay: false,
  },
  events = reactive<Event[]>([])

// convert the events into a map of lists keyed by date or weekday
interface EventsMap {
  [key: string]: Event[]
}

const eventsMap = computed<EventsMap>(() => {
  const map: EventsMap = {}
  events.forEach((event) => {
    const key = event.date || event.weekday?.toString()
    if (key) {
      if (!map[key]) {
        map[key] = []
      }
      map[key].push(event)
    }
  })
  // console.info('eventsMap', map)
  return map
})

interface Scope {
  scope: any
}

function onDragStart(e: DragEvent, item: Event) {
  console.info('onDragStart called')
  if (e.dataTransfer) {
    e.dataTransfer.dropEffect = 'copy'
    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.setData('ID', String(item.id))
  }
}

function onDragEnter(e: DragEvent, type: string, { scope }: Scope) {
  console.info('onDragEnter', type, scope)
  e.preventDefault()
  return true
}

function onDragOver(e: DragEvent, type: string, { scope }: Scope) {
  console.info('onDragOver', type, scope)
  e.preventDefault()
  return true
}

function onDragLeave(_e: DragEvent, type: string, { scope }: Scope) {
  console.info('onDragLeave', type, scope)
  return false
}

function onDrop(e: DragEvent, type: string, { scope }: Scope) {
  console.info('onDrop')
  const itemID = parseInt(e.dataTransfer!.getData('ID'), 10)
  const event = { ...defaultEvent }
  event.id = events.length + 1
  const item = dragItems.filter((item) => item.id === itemID)
  if (item[0]) {
    event.type = item[0].id
    event.name = item[0].name
  }
  event.weekday = scope.timestamp.weekday
  if (type === 'day') {
    event.date = scope.timestamp.date
    event.time = scope.timestamp.time
  } else {
    // head-day
    event.allDay = true
  }
  events.push(event)
  return false
}

function getEvents(timestamp: Timestamp) {
  const events = eventsMap.value[timestamp.date]
  if (!events) return []
  return events
}

function getWeekdayEvents(weekday: number) {
  const events = eventsMap.value[weekday]
  if (!events) return []
  return events
}

function hasEvents(timestamp: Timestamp) {
  return getEvents(timestamp).length > 0
}

function hasWeekdayEvents(weekday: number) {
  return getWeekdayEvents(weekday).length > 0
}

function onDayClass({ scope }: Scope) {
  return {
    droppable: scope.droppable === true,
  }
}

function onWeekdayClass({ scope }: Scope) {
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
function onClickDay(data: Timestamp) {
  console.info('onClickDay', data)
}
function onClickWorkweek(data: Timestamp) {
  console.info('onClickWorkweek', data)
}
function onClickHeadDay(data: Timestamp) {
  console.info('onClickHeadDay', data)
}
function onClickHeadWorkweek(data: Timestamp) {
  console.info('onClickHeadWorkweek', data)
}

// this method is used only to print the scope to dev tools
function printScope({ scope }: Scope): boolean {
  console.info('scope:', scope)
  return true
}
</script>

<style lang="scss">
.droppable {
  box-shadow: inset 0 0 0 1px rgba(0, 140, 200, 0.8);
}
</style>
