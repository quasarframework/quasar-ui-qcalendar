<template>
  <div class="subcontent">
    <navigation-bar @today="onToday" @prev="onPrev" @next="onNext" />

    <div class="row justify-center">
      <div style="display: flex; max-width: 800px; width: 100%; height: 400px">
        <q-calendar-day
          ref="calendar"
          v-model="selectedDate"
          view="day"
          animated
          bordered
          transition-next="slide-left"
          transition-prev="slide-right"
          no-active-date
          :interval-minutes="15"
          :interval-start="24"
          :interval-count="68"
          :interval-height="28"
          @change="onChange"
          @moved="onMoved"
          @click-date="onClickDate"
          @click-time="onClickTime"
          @click-interval="onClickInterval"
          @click-head-intervals="onClickHeadIntervals"
          @click-head-day="onClickHeadDay"
        >
          <template #head-day-event="{ scope: { timestamp } }">
            <div style="display: flex; justify-content: center; flex-wrap: wrap; padding: 2px">
              <template v-for="event in eventsMap[timestamp.date]" :key="event.id">
                <q-badge
                  v-if="!event.time"
                  :class="badgeClasses(event, 'header')"
                  :style="badgeStyles(event, 'header')"
                  style="width: 100%; cursor: pointer; height: 12px; font-size: 10px; margin: 1px"
                >
                  <div class="title q-calendar__ellipsis">
                    {{ event.title }}
                    <q-tooltip>{{ event.details }}</q-tooltip>
                  </div>
                </q-badge>
                <q-badge
                  v-else
                  :class="badgeClasses(event, 'header')"
                  :style="badgeStyles(event, 'header')"
                  style="
                    margin: 1px;
                    width: 10px;
                    max-width: 10px;
                    height: 10px;
                    max-height: 10px;
                    cursor: pointer;
                  "
                  @click="scrollToEvent(event)"
                >
                  <q-tooltip>{{ event.time + ' - ' + event.details }}</q-tooltip>
                </q-badge>
              </template>
            </div>
          </template>

          <template #day-body="{ scope: { timestamp, timeStartPos, timeDurationHeight } }">
            <template v-for="event in getEvents(timestamp.date)" :key="event.id">
              <div
                v-if="event.time !== undefined"
                class="my-event"
                :class="badgeClasses(event, 'body')"
                :style="badgeStyles(event, 'body', timeStartPos, timeDurationHeight)"
              >
                <div class="title q-calendar__ellipsis">
                  {{ event.title }}
                  <q-tooltip>{{ event.time + ' - ' + event.details }}</q-tooltip>
                </div>
              </div>
            </template>
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
  isBetweenDates,
  today,
  parsed,
  parseTime,
  Timestamp,
} from '@quasar/quasar-ui-qcalendar'
import '@quasar/quasar-ui-qcalendar/index.css'
import { ref, computed } from 'vue'
import NavigationBar from 'components/NavigationBar.vue'

interface Event {
  id: number
  title: string
  details: string
  date: string
  time: string
  duration: number
  bgcolor: string
  icon: string
  side?: string
  days?: number
}

const calendar = ref<QCalendarDay>()
const selectedDate = ref(today())

const events = ref<Event[]>([
  {
    id: 1,
    title: 'Meeting',
    details: 'Time to pitch my idea to the company',
    date: today(),
    time: '09:00',
    duration: 120,
    bgcolor: 'red',
    icon: 'fas fa-handshake',
  },
  {
    id: 2,
    title: 'Lunch',
    details: 'Company is paying!',
    date: today(),
    time: '12:00',
    duration: 60,
    bgcolor: 'teal',
    icon: 'fas fa-hamburger',
  },
  {
    id: 3,
    title: 'Conference',
    details: 'Teaching Javascript 101',
    date: today(),
    time: '13:00',
    duration: 240,
    bgcolor: 'blue',
    icon: 'fas fa-chalkboard-teacher',
  },
  {
    id: 4,
    title: 'Girlfriend',
    details: 'Meet GF for dinner at Swanky Restaurant',
    date: today(),
    time: '19:00',
    duration: 180,
    bgcolor: 'teal-2',
    icon: 'fas fa-utensils',
  },
])

// convert the events into a map of lists keyed by date
const eventsMap = computed(() => {
  const map: { [key: string]: Event[] } = {}
  events.value.forEach((event) => {
    if (!map[event.date]) {
      map[event.date] = []
    }
    map[event.date]!.push(event)
    if (event.days) {
      let timestamp = parseTimestamp(event.date)
      let days = event.days
      do {
        if (timestamp) {
          timestamp = addToDate(timestamp, { day: 1 })
          if (!map[timestamp.date]) {
            map[timestamp.date] = []
          }
          map[timestamp.date]!.push(event)
        }
      } while (--days > 0)
    }
  })
  return map
})

function badgeClasses(event: Event, type: string) {
  const isHeader = type === 'header'
  return {
    [`text-white bg-${event.bgcolor}`]: true,
    'full-width': !isHeader && (!event.side || event.side === 'full'),
    'left-side': !isHeader && event.side === 'left',
    'right-side': !isHeader && event.side === 'right',
    'rounded-border': true,
  }
}

function badgeStyles(
  event: Event,
  _type: string,
  timeStartPos?: (_time: string) => number,
  timeDurationHeight?: (_minutes: number) => number,
) {
  const s: { [key: string]: string } = {}
  if (timeStartPos && timeDurationHeight) {
    s.top = timeStartPos(event.time) + 'px'
    s.height = timeDurationHeight(event.duration) + 'px'
  }
  s['align-items'] = 'flex-start'
  return s
}

function getEvents(dt: string): Event[] {
  // get all events for the specified date
  const events = eventsMap.value[dt] || []

  if (events.length === 1 && events[0]) {
    events[0].side = 'full'
  } else if (events.length === 2 && events[0] && events[1]) {
    // this example does no more than 2 events per day
    // check if the two events overlap and if so, select
    // left or right side alignment to prevent overlap
    const startTimestamp = parsed(events[0].date)
    if (startTimestamp) {
      const startTime = addToDate(startTimestamp, { minute: parseTime(events[0].time) })
      const endTime = addToDate(startTime, { minute: events[0].duration })
      const startTime2 = addToDate(parsed(events[1].date)!, {
        minute: parseTime(events[1].time),
      })
      const endTime2 = addToDate(startTime2, { minute: events[1].duration })
      if (
        isBetweenDates(startTime2, startTime, endTime, true) ||
        isBetweenDates(endTime2, startTime, endTime, true)
      ) {
        events[0].side = 'left'
        events[1].side = 'right'
      } else {
        events[0].side = 'full'
        events[1].side = 'full'
      }
    }
  }

  return events
}

function scrollToEvent(event: Event) {
  if (calendar.value) {
    calendar.value.scrollToTime(event.time, 350)
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
.my-event {
  position: absolute;
  font-size: 12px;
  justify-content: center;
  margin: 0 1px;
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

.bg-blue {
  background: blue;
}

.bg-green {
  background: green;
}

.bg-orange {
  background: orange;
}

.bg-red {
  background: red;
}

.bg-teal {
  background: teal;
}

.bg-grey {
  background: grey;
}

.bg-purple {
  background: purple;
}

.full-width {
  left: 0;
  width: calc(100% - 2px);
}

.left-side {
  left: 0;
  width: calc(50% - 3px);
}

.right-side {
  left: 50%;
  width: calc(50% - 3px);
}

.rounded-border {
  border-radius: 2px;
}
</style>
