<template>
  <div class="subcontent">
    <navigation-bar @today="onToday" @prev="onPrev" @next="onNext" />

    <div class="row justify-center">
      <div style="display: flex; max-width: 800px; width: 100%; height: 400px">
        <q-calendar-day
          ref="calendar"
          v-model="selectedDate"
          view="week"
          :weekdays="weekdays"
          animated
          bordered
          @change="onChange"
          @moved="onMoved"
          @click-date="onClickDate"
          @click-time="onClickTime"
          @click-interval="onClickInterval"
          @click-head-intervals="onClickHeadIntervals"
          @click-head-day="onClickHeadDay"
        >
          <template #head-days-events="{ scope: { days, ref } }">
            <div :ref="ref" class="inner-row">
              <template v-for="(day, index) in days" :key="index">
                <template v-for="event in allDayEventsMap[day.date]" :key="event.id">
                  <div
                    class="my-event"
                    :class="badgeClasses(event)"
                    :style="badgeStyles(day, event)"
                  >
                    <span class="title q-calendar__ellipsis">
                      {{ event.title }}
                      <q-tooltip>{{ event.details }}</q-tooltip>
                    </span>
                  </div>
                </template>
              </template>
            </div>
          </template>
        </q-calendar-day>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  QCalendarDay,
  addToDate,
  parseTimestamp,
  getStartOfWeek,
  today,
  Timestamp,
} from '@quasar/quasar-ui-qcalendar'
import '@quasar/quasar-ui-qcalendar/index.css'
import { ref, reactive, computed, onBeforeMount } from 'vue'
import NavigationBar from 'components/NavigationBar.vue'

interface Event {
  id: number
  title: string
  details: string
  date: string
  days: number
  allDay: boolean
  bgcolor: string
}

const calendar = ref<QCalendarDay>()
const selectedDate = ref(today())
const weekdays = ref([0, 1, 2, 3, 4, 5, 6])
// we only need 2 events for this example
const events = reactive<Event[]>([
  {
    id: 1,
    title: 'Vacation',
    details: 'Time at the cabin',
    date: '',
    days: 2,
    allDay: true,
    bgcolor: 'orange',
  },
  {
    id: 2,
    title: 'Training',
    details: 'Javascript 101',
    date: '',
    days: 2,
    allDay: true,
    bgcolor: 'green',
  },
])

const allDayEventsMap = computed(() => {
  const map: { [key: string]: typeof events } = {}
  if (events.length > 0) {
    events.forEach(
      (event) => event.allDay === true && (map[event.date] = map[event.date] || []).push(event),
    )
  }
  return map
})

const parsedCellWidth = computed(() => {
  return 100 / weekdays.value.length
})

onBeforeMount(() => {
  // set up dates for example events
  const todayTimestamp = parseTimestamp(today())
  if (todayTimestamp) {
    let start = getStartOfWeek(todayTimestamp, weekdays.value)
    events[0]!.date = start.date
    start = addToDate(start, { day: 4 })
    events[1]!.date = start.date
  }
})

function badgeClasses(event: Event) {
  return {
    [`text-white bg-${event.bgcolor}`]: true,
    'rounded-border': true,
  }
}

function badgeStyles(day: Timestamp, event: Event) {
  const s: Record<string, any> = {}
  s.left = day.weekday === 0 ? 0 : day.weekday * parsedCellWidth.value + '%'
  s.top = 0
  s.bottom = 0
  s.width = event.days * parsedCellWidth.value + '%'
  return s
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
function onClickTime(data: Timestamp) {
  console.info('onClickTime', data)
}
function onClickInterval(data: Timestamp) {
  console.info('onClickInterval', data)
}
function onClickHeadIntervals(data: Timestamp) {
  console.info('onClickHeadIntervals', data)
}
function onClickHeadDay(data: Timestamp) {
  console.info('onClickHeadDay', data)
}
</script>

<style lang="scss" scoped>
.inner-row {
  height: 20px;
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  display: flex;
  flex-direction: row;
  align-items: center;
  vertical-align: middle;
}

.my-event {
  position: absolute;
  font-size: 12px;
  justify-content: center;
  text-overflow: ellipsis;
  overflow: hidden;
  cursor: pointer;
}

.title {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
}

.text-white {
  color: white;
}

.bg-green {
  background: green;
}

.bg-orange {
  background: orange;
}

.rounded-border {
  border-radius: 2px;
}
</style>
