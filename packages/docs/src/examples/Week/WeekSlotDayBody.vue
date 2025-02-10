<template>
  <div class="subcontent">
    <navigation-bar @today="onToday" @prev="onPrev" @next="onNext" />

    <div class="row justify-center">
      <div style="display: flex; max-width: 800px; width: 100%; height: 400px">
        <q-calendar-day
          ref="calendar"
          v-model="selectedDate"
          view="week"
          animated
          bordered
          transition-next="slide-left"
          transition-prev="slide-right"
          no-active-date
          :interval-start="6"
          :interval-count="18"
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
                  <span class="title q-calendar__ellipsis">
                    {{ event.title }}
                    <q-tooltip>{{ event.details }}</q-tooltip>
                  </span>
                </q-badge>
                <q-badge
                  v-else
                  :class="badgeClasses(event, 'header')"
                  :style="badgeStyles(event, 'header')"
                  style="margin: 1px; width: 10px; max-width: 10px; height: 10px; max-height: 10px"
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
                <span class="title q-calendar__ellipsis">
                  {{ event.title }}
                  <q-tooltip>{{ event.details }}</q-tooltip>
                </span>
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
  parseDate,
  parseTime,
  Timestamp,
} from '@quasar/quasar-ui-qcalendar'
import '@quasar/quasar-ui-qcalendar/index.css'
import { ref, reactive, computed } from 'vue'
import NavigationBar from 'components/NavigationBar.vue'

// The function below is used to set up our demo data
const CURRENT_DAY = new Date()
function getCurrentDay(day: number) {
  const newDay = new Date(CURRENT_DAY)
  newDay.setDate(day)
  const tm = parseDate(newDay)
  return tm!.date
}

interface Event {
  id: number
  title: string
  details: string
  date: string
  time?: string
  duration?: number
  bgcolor?: string
  icon?: string
  days?: number
  side?: string
}

const calendar = ref<QCalendarDay>(),
  selectedDate = ref(today()),
  events = reactive<Event[]>([
    {
      id: 1,
      title: '1st of the Month',
      details: 'Everything is funny as long as it is happening to someone else',
      date: getCurrentDay(1),
      bgcolor: 'orange',
    },
    {
      id: 2,
      title: 'Sisters Birthday',
      details: 'Buy a nice present',
      date: getCurrentDay(4),
      bgcolor: 'green',
      icon: 'fas fa-birthday-cake',
    },
    {
      id: 3,
      title: 'Meeting',
      details: 'Time to pitch my idea to the company',
      date: getCurrentDay(10),
      time: '10:00',
      duration: 120,
      bgcolor: 'red',
      icon: 'fas fa-handshake',
    },
    {
      id: 4,
      title: 'Lunch',
      details: 'Company is paying!',
      date: getCurrentDay(10),
      time: '11:30',
      duration: 90,
      bgcolor: 'teal',
      icon: 'fas fa-hamburger',
    },
    {
      id: 5,
      title: 'Visit mom',
      details: 'Always a nice chat with mom',
      date: getCurrentDay(20),
      time: '17:00',
      duration: 90,
      bgcolor: 'grey',
      icon: 'fas fa-car',
    },
    {
      id: 6,
      title: 'Conference',
      details: 'Teaching Javascript 101',
      date: getCurrentDay(22),
      time: '08:00',
      duration: 540,
      bgcolor: 'blue',
      icon: 'fas fa-chalkboard-teacher',
    },
    {
      id: 7,
      title: 'Girlfriend',
      details: 'Meet GF for dinner at Swanky Restaurant',
      date: getCurrentDay(22),
      time: '19:00',
      duration: 180,
      bgcolor: 'teal',
      icon: 'fas fa-utensils',
    },
    {
      id: 8,
      title: 'Fishing',
      details: 'Time for some weekend R&R',
      date: getCurrentDay(27),
      bgcolor: 'purple',
      icon: 'fas fa-fish',
      days: 2,
    },
    {
      id: 9,
      title: 'Vacation',
      details: "Trails and hikes, going camping! Don't forget to bring bear spray!",
      date: getCurrentDay(29),
      bgcolor: 'purple',
      icon: 'fas fa-plane',
      days: 5,
    },
  ])

// convert the events into a map of lists keyed by date
const eventsMap = computed<Record<string, Event[]>>(() => {
  const map: Record<string, Event[]> = {}

  events.forEach((event) => {
    const addEventToMap = (date: string) => {
      if (!map[date]) {
        map[date] = []
      }
      map[date].push(event)
    }

    addEventToMap(event.date)

    if (event.days) {
      let timestamp = parseTimestamp(event.date)
      if (timestamp) {
        for (let i = 1; i < event.days; i++) {
          timestamp = addToDate(timestamp, { day: 1 })
          addEventToMap(timestamp.date)
        }
      }
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
  type: string,
  timeStartPos?: (_time: string) => number,
  timeDurationHeight?: (_duration: number) => number,
): Record<string, string> {
  const s: Record<string, string> = {}

  if (timeStartPos && timeDurationHeight && event.time && event.duration) {
    s.top = `${timeStartPos(event.time)}px`
    s.height = `${timeDurationHeight(event.duration)}px`
  }

  s['align-items'] = 'flex-start'
  return s
}

function getEvents(dt: string) {
  // get all events for the specified date
  const evts = eventsMap.value[dt] || []

  if (events.length === 1 && evts[0]) {
    evts[0].side = 'full'
  } else if (events.length === 2 && evts[0] && evts[1]) {
    // this example does no more than 2 events per day
    // check if the two events overlap and if so, select
    // left or right side alignment to prevent overlap
    const parsedDate1 = parsed(evts[0].date)
    const startTime =
      parsedDate1 && evts[0].time
        ? addToDate(parsedDate1, { minute: parseTime(evts[0].time) })
        : null
    const parsedDate2 = parsed(evts[1].date)
    const startTime2 =
      parsedDate2 && evts[1].time
        ? addToDate(parsedDate2, { minute: parseTime(evts[1].time) })
        : null

    if (startTime && startTime2) {
      const endTime = addToDate(startTime, { minute: evts[0].duration ?? 0 })
      const endTime2 = addToDate(startTime2, { minute: evts[1].duration ?? 0 })
      if (
        (endTime && endTime2 && isBetweenDates(startTime2, startTime, endTime, true)) ||
        isBetweenDates(endTime2, startTime, endTime, true)
      ) {
        evts[0].side = 'left'
        evts[1].side = 'right'
      } else {
        evts[0].side = 'full'
        evts[1].side = 'full'
      }
    }
  }

  return evts
}

function scrollToEvent(event: Event) {
  if (calendar.value && event.time) {
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
