<template>
  <div class="subcontent">
    <navigation-bar @today="onToday" @prev="onPrev" @next="onNext" />

    <div class="row justify-center">
      <div style="display: flex; max-width: 800px; width: 100%">
        <q-calendar-month
          ref="calendar"
          v-model="selectedDate"
          animated
          bordered
          focusable
          hoverable
          no-active-date
          :day-min-height="60"
          :day-height="0"
          @change="onChange"
          @moved="onMoved"
          @click-date="onClickDate"
          @click-day="onClickDay"
          @click-workweek="onClickWorkweek"
          @click-head-workweek="onClickHeadWorkweek"
          @click-head-day="onClickHeadDay"
        >
          <template #week="{ scope: { week, weekdays } }">
            <template v-for="(displayedEvent, index) in getWeekEvents(week, weekdays)" :key="index">
              <div
                :class="badgeClasses(displayedEvent)"
                :style="badgeStyles(displayedEvent, week.length)"
              >
                <div
                  v-if="displayedEvent.event && displayedEvent.event.details"
                  class="title q-calendar__ellipsis"
                >
                  <q-icon
                    v-if="displayedEvent.event?.icon"
                    :name="displayedEvent.event.icon"
                  ></q-icon>
                  {{
                    displayedEvent.event.title +
                    (displayedEvent.event.time ? ' - ' + displayedEvent.event.time : '')
                  }}
                  <q-tooltip>{{ displayedEvent.event.details }}</q-tooltip>
                </div>
              </div>
            </template>
          </template>
        </q-calendar-month>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  QCalendarMonth,
  daysBetween,
  isOverlappingDates,
  parsed,
  parseDate,
  today,
  Timestamp,
} from '@quasar/quasar-ui-qcalendar'
import { indexOf } from '@quasar/quasar-ui-qcalendar/src/utils/helpers.js'
import '@quasar/quasar-ui-qcalendar/index.css'

import { ref, reactive } from 'vue'
import NavigationBar from 'components/NavigationBar.vue'

interface Event {
  id: number
  title: string
  details: string
  start: string
  end: string
  time?: string
  duration?: number
  bgcolor: string
  icon?: string
}

interface DisplayedEvent {
  id?: number
  left?: number
  right?: number
  size: number
  event?: Event | undefined
}

// The function below is used to set up our demo data
const CURRENT_DAY = new Date()
function getCurrentDay(day: number): string {
  const newDay = new Date(CURRENT_DAY)
  newDay.setDate(day)
  const tm = parseDate(newDay)
  return tm!.date
}

const calendar = ref<QCalendarMonth>(),
  selectedDate = ref(today()),
  events = reactive<Event[]>([
    {
      id: 1,
      title: '1st of the Month',
      details: 'Everything is funny as long as it is happening to someone else',
      start: getCurrentDay(1),
      end: getCurrentDay(1),
      bgcolor: 'orange',
    },
    {
      id: 2,
      title: 'Sisters Birthday',
      details: 'Buy a nice present',
      start: getCurrentDay(4),
      end: getCurrentDay(4),
      bgcolor: 'green',
      icon: 'fas fa-birthday-cake',
    },
    {
      id: 3,
      title: 'Meeting',
      details: 'Time to pitch my idea to the company',
      start: getCurrentDay(10),
      end: getCurrentDay(10),
      time: '10:00',
      duration: 120,
      bgcolor: 'red',
      icon: 'fas fa-handshake',
    },
    {
      id: 4,
      title: 'Lunch',
      details: 'Company is paying!',
      start: getCurrentDay(10),
      end: getCurrentDay(10),
      time: '11:30',
      duration: 90,
      bgcolor: 'teal',
      icon: 'fas fa-hamburger',
    },
    {
      id: 5,
      title: 'Visit mom',
      details: 'Always a nice chat with mom',
      start: getCurrentDay(20),
      end: getCurrentDay(20),
      time: '17:00',
      duration: 90,
      bgcolor: 'grey',
      icon: 'fas fa-car',
    },
    {
      id: 6,
      title: 'Conference',
      details: 'Teaching Javascript 101',
      start: getCurrentDay(22),
      end: getCurrentDay(22),
      time: '08:00',
      duration: 540,
      bgcolor: 'blue',
      icon: 'fas fa-chalkboard-teacher',
    },
    {
      id: 7,
      title: 'Girlfriend',
      details: 'Meet GF for dinner at Swanky Restaurant',
      start: getCurrentDay(22),
      end: getCurrentDay(22),
      time: '19:00',
      duration: 180,
      bgcolor: 'teal',
      icon: 'fas fa-utensils',
    },
    {
      id: 8,
      title: 'Rowing',
      details: 'Stay in shape!',
      start: getCurrentDay(27),
      end: getCurrentDay(28),
      bgcolor: 'purple',
      icon: 'rowing',
    },
    {
      id: 9,
      title: 'Fishing',
      details: 'Time for some weekend R&R',
      start: getCurrentDay(22),
      end: getCurrentDay(29),
      bgcolor: 'purple',
      icon: 'fas fa-fish',
    },
    {
      id: 10,
      title: 'Vacation',
      details: "Trails and hikes, going camping! Don't forget to bring bear spray!",
      start: getCurrentDay(22),
      end: getCurrentDay(29),
      bgcolor: 'purple',
      icon: 'fas fa-plane',
    },
  ])

function getWeekEvents(week: Timestamp[], _weekdays: number[]): DisplayedEvent[] {
  if (!week || week.length === 0) return []

  // Define week range
  const firstDay = parsed(`${week[0]!.date} 00:00`)
  const lastDay = parsed(`${week[week.length - 1]?.date} 23:59`)
  if (!firstDay || !lastDay) return []

  // Filter and process events
  const eventsWeek = events
    .map((event, id) => {
      const startDate = parsed(`${event.start} 00:00`)
      const endDate = parsed(`${event.end} 23:59`)

      if (startDate && endDate && isOverlappingDates(startDate, endDate, firstDay, lastDay)) {
        const left = daysBetween(firstDay, startDate)
        const right = daysBetween(endDate, lastDay)
        return {
          id,
          left,
          right,
          size: week.length - (left + right),
          event,
        }
      }
      return null
    })
    .filter(Boolean) as DisplayedEvent[] // Remove null values

  // Sort and insert events into week structure
  const evts: DisplayedEvent[] = []
  if (eventsWeek.length > 0) {
    const sortedWeek = eventsWeek.sort((a, b) => (a.left ?? 0) - (b.left ?? 0))
    sortedWeek.forEach((_, i) => {
      insertEvent(evts, week.length, sortedWeek, i, 0, 0)
    })
  }

  return evts
}

function insertEvent(
  events: DisplayedEvent[],
  weekLength: number,
  infoWeek: DisplayedEvent[],
  index: number,
  availableDays: number,
  level: number,
) {
  const iEvent = infoWeek[index]
  if (iEvent !== undefined && 'left' in iEvent && iEvent.left >= availableDays) {
    // If you have space available, more events are placed
    if (iEvent.left - availableDays) {
      // It is filled with empty events
      events.push({ size: iEvent.left - availableDays })
    }
    // The event is built
    events.push({ size: iEvent.size, event: iEvent.event })

    if (level !== 0) {
      // If it goes into recursion, then the item is deleted
      infoWeek.splice(index, 1)
    }

    const currentAvailableDays = iEvent.left + iEvent.size

    if (currentAvailableDays <= weekLength) {
      const indexNextEvent = indexOf(
        infoWeek,
        (e: DisplayedEvent) =>
          e.id !== iEvent.id && e.left !== undefined && e.left >= currentAvailableDays,
      )

      insertEvent(
        events,
        weekLength,
        infoWeek,
        indexNextEvent !== -1 ? indexNextEvent : index,
        currentAvailableDays,
        level + 1,
      )
    } // else: There are no more days available, end of iteration
  } else {
    events.push({ size: weekLength - availableDays })
    // end of iteration
  }
}

function badgeClasses(displayedEvent: DisplayedEvent) {
  if (displayedEvent.event !== undefined) {
    return {
      'my-event': true,
      'text-white': true,
      [`bg-${displayedEvent.event.bgcolor}`]: true,
      'rounded-border': true,
      'q-calendar__ellipsis': true,
    }
  }
  return {
    'my-void-event': true,
  }
}

function badgeStyles(displayedEvent: DisplayedEvent, weekLength: number) {
  const s: Record<string, any> = {}
  if (displayedEvent.size !== undefined) {
    s.width = (100 / weekLength) * displayedEvent.size + '%'
  }
  return s
}

// function isBetweenDatesWeek(dateStart, dateEnd, weekStart, weekEnd) {
//   return (
//     (dateEnd < weekEnd && dateEnd >= weekStart) ||
//     dateEnd === weekEnd ||
//     (dateEnd > weekEnd && dateStart <= weekEnd)
//   )
// }

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
</script>

<style lang="scss" scoped>
.my-event {
  position: relative;
  display: inline-flex;
  white-space: nowrap;
  font-size: 12px;
  height: 20px;
  margin: 1px 0 0 0;
  padding: 2px 2px;
  justify-content: start;
  text-overflow: ellipsis;
  overflow: hidden;
  cursor: pointer;
}

.title {
  display: inline-block; /* Ensures the text can truncate */
  white-space: nowrap; /* Prevents text from wrapping to a new line */
  overflow: hidden; /* Hides the overflowing text */
  text-overflow: ellipsis; /* Displays the ellipsis for truncated text */
  max-width: 100%; /* Ensures the truncation works within the parent container */
  vertical-align: middle; /* Aligns the text with icons, if any */
  text-align: left; /* Aligns the text to the left */
}

.my-void-event {
  display: inline-flex;
  white-space: nowrap;
  height: 1px;
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

.rounded-border {
  border-radius: 6px;
}
</style>
