<template>
  <div class="subcontent">
    <div class="calendar-shell">
      <aside class="calendar-sidebar">
        <q-btn
          unelevated
          color="primary"
          icon="add"
          label="Create"
          class="create-button"
          no-caps
        />

        <div class="mini-calendar-header">
          <q-btn dense flat round icon="chevron_left" @click="onMiniPrev" />
          <div class="mini-calendar-title">{{ miniMonthLabel }}</div>
          <q-btn dense flat round icon="chevron_right" @click="onMiniNext" />
        </div>

        <q-calendar-month
          ref="miniCalendar"
          v-model="selectedDate"
          mini-mode
          focusable
          hoverable
          no-active-date
          :min-weeks="6"
          class="mini-calendar"
          @click-date="onMiniDateClick"
        />

        <q-input
          v-model="searchText"
          dense
          outlined
          color="primary"
          placeholder="Search for people"
          class="q-mt-md"
        >
          <template #prepend>
            <q-icon name="group" />
          </template>
        </q-input>

        <div class="calendar-list">
          <div class="calendar-list__title">My calendars</div>
          <q-checkbox
            v-for="calendar in calendars"
            :key="calendar.id"
            v-model="visibleCalendars"
            :val="calendar.id"
            :label="calendar.label"
            :color="calendar.color"
            dense
          />
        </div>
      </aside>

      <main class="calendar-main">
        <div class="calendar-toolbar">
          <div class="calendar-toolbar__left">
            <q-btn outline rounded no-caps label="Today" @click="onToday" />
            <q-btn dense flat round icon="chevron_left" @click="onPrev" />
            <q-btn dense flat round icon="chevron_right" @click="onNext" />
            <div class="calendar-toolbar__title">{{ mainMonthLabel }}</div>
          </div>

          <q-btn-toggle
            v-model="density"
            no-caps
            rounded
            unelevated
            toggle-color="primary"
            :options="[
              { label: 'Comfortable', value: 'comfortable' },
              { label: 'Compact', value: 'compact' },
            ]"
          />
        </div>

        <div class="main-calendar-wrapper">
          <q-calendar-month
            ref="mainCalendar"
            v-model="selectedDate"
            animated
            bordered
            focusable
            hoverable
            no-active-date
            :day-min-height="density === 'comfortable' ? 110 : 80"
            :day-height="0"
            @change="onChange"
            @moved="onMoved"
            @click-date="onClickDate"
            @click-day="onClickDay"
            @click-workweek="onClickWorkweek"
            @click-head-workweek="onClickHeadWorkweek"
            @click-head-day="onClickHeadDay"
          >
            <template #day="{ scope: { timestamp } }">
              <template v-for="event in eventsMap[timestamp.date]" :key="event.id">
                <div
                  v-if="visibleCalendars.includes(event.calendarId)"
                  class="calendar-event"
                  :style="{ backgroundColor: event.color }"
                >
                  <q-icon v-if="event.icon" :name="event.icon" size="12px" class="q-mr-xs" />
                  <span class="q-calendar__ellipsis">
                    {{ event.title }}
                  </span>
                  <q-tooltip>{{ event.details }}</q-tooltip>
                </div>
              </template>
            </template>
          </q-calendar-month>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  QCalendarMonth,
  addToDate,
  parseDate,
  parseTimestamp,
  today,
  Timestamp,
} from '@quasar/quasar-ui-qcalendar'
import '@quasar/quasar-ui-qcalendar/index.css'

import { computed, reactive, ref, watch } from 'vue'

interface CalendarDefinition {
  id: string
  label: string
  color: string
}

interface Event {
  id: number
  title: string
  details: string
  date: string
  calendarId: string
  color: string
  icon?: string
  days?: number
}

const CURRENT_DAY = new Date()

function getCurrentDay(day: number) {
  const date = new Date(CURRENT_DAY)
  date.setDate(day)

  return parseDate(date)!.date
}

const mainCalendar = ref<QCalendarMonth>()
const miniCalendar = ref<QCalendarMonth>()
const selectedDate = ref(today())
const miniDate = ref(today())
const searchText = ref('')
const density = ref<'comfortable' | 'compact'>('comfortable')

const calendars = reactive<CalendarDefinition[]>([
  { id: 'personal', label: 'Personal', color: 'indigo' },
  { id: 'family', label: 'Family', color: 'green' },
  { id: 'work', label: 'Work', color: 'blue' },
  { id: 'travel', label: 'Travel', color: 'deep-orange' },
])

const visibleCalendars = ref(calendars.map((calendar) => calendar.id))

const events = reactive<Event[]>([
  {
    id: 1,
    title: 'Pay mortgage',
    details: 'Monthly home payment',
    date: getCurrentDay(1),
    calendarId: 'personal',
    color: '#7986cb',
  },
  {
    id: 2,
    title: "Mother's Day",
    details: 'Remember to call mom',
    date: getCurrentDay(10),
    calendarId: 'family',
    color: '#ef9a9a',
  },
  {
    id: 3,
    title: 'Product planning',
    details: 'Roadmap and release planning',
    date: getCurrentDay(12),
    calendarId: 'work',
    color: '#80cbc4',
    icon: 'event',
  },
  {
    id: 4,
    title: 'Team check-in',
    details: 'Weekly sync',
    date: getCurrentDay(14),
    calendarId: 'work',
    color: '#90caf9',
  },
  {
    id: 5,
    title: 'Long weekend',
    details: 'Camping and appointments',
    date: getCurrentDay(18),
    calendarId: 'travel',
    color: '#ffcc80',
    icon: 'hiking',
    days: 3,
  },
  {
    id: 6,
    title: 'Birthday dinner',
    details: 'Family dinner reservation',
    date: getCurrentDay(29),
    calendarId: 'family',
    color: '#a5d6a7',
  },
  {
    id: 7,
    title: 'Release window',
    details: 'Ship and monitor',
    date: getCurrentDay(30),
    calendarId: 'work',
    color: '#5c6bc0',
    days: 2,
  },
])

const eventsMap = computed<Record<string, Event[]>>(() => {
  const map: Record<string, Event[]> = {}

  events.forEach((event) => {
    ;(map[event.date] = map[event.date] || []).push(event)

    if (event.days !== undefined) {
      let timestamp = parseTimestamp(event.date)
      let days = event.days

      while (timestamp !== null && --days > 0) {
        timestamp = addToDate(timestamp, { day: 1 })
        ;(map[timestamp.date] = map[timestamp.date] || []).push(event)
      }
    }
  })

  return map
})

const mainMonthLabel = computed(() => formatMonthLabel(selectedDate.value))
const miniMonthLabel = computed(() => formatMonthLabel(miniDate.value))

watch(selectedDate, (value) => {
  miniDate.value = value
})

function formatMonthLabel(date: string): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(date))
}

function onMiniDateClick(data: { scope: { timestamp: Timestamp } }) {
  selectedDate.value = data.scope.timestamp.date
}

function onToday() {
  selectedDate.value = today()
}

function onPrev() {
  mainCalendar.value?.prev()
}

function onNext() {
  mainCalendar.value?.next()
}

function onMiniPrev() {
  miniCalendar.value?.prev()
}

function onMiniNext() {
  miniCalendar.value?.next()
}

function onMoved(data: Timestamp) {
  miniDate.value = data.date
  console.info('onMoved', data)
}

function onChange(data: { start: Timestamp; end: Timestamp; days: Timestamp[] }) {
  console.info('onChange', data)
}

function onClickDate(data: { scope: { timestamp: Timestamp } }) {
  selectedDate.value = data.scope.timestamp.date
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
.calendar-shell {
  display: grid;
  grid-template-columns: 250px minmax(0, 1fr);
  gap: 18px;
  align-items: start;
  width: 100%;
  min-height: 620px;
}

.calendar-sidebar {
  position: sticky;
  top: 12px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 14px;
  border: 1px solid rgb(127 127 127 / 25%);
  border-radius: 18px;
  background: rgb(255 255 255 / 70%);
  box-shadow: 0 8px 26px rgb(0 0 0 / 8%);
}

:global(.body--dark) .calendar-sidebar {
  background: rgb(34 34 34 / 70%);
}

.create-button {
  align-self: flex-start;
  border-radius: 18px;
}

.mini-calendar-header {
  display: grid;
  grid-template-columns: 32px 1fr 32px;
  align-items: center;
}

.mini-calendar-title {
  font-weight: 700;
  text-align: center;
}

.mini-calendar {
  border: 0;
  box-shadow: none;
}

.calendar-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 8px;
}

.calendar-list__title {
  font-weight: 700;
}

.calendar-main {
  min-width: 0;
}

.calendar-toolbar {
  display: flex;
  gap: 12px;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}

.calendar-toolbar__left {
  display: flex;
  gap: 8px;
  align-items: center;
}

.calendar-toolbar__title {
  margin-left: 8px;
  font-size: 1.6rem;
  font-weight: 700;
}

.main-calendar-wrapper {
  display: flex;
  overflow: hidden;
  border-radius: 24px;
}

.main-calendar-wrapper :deep(.q-calendar) {
  border-radius: inherit;
}

.calendar-event {
  display: flex;
  align-items: center;
  min-width: 0;
  width: 100%;
  margin: 2px 0 0;
  padding: 2px 6px;
  border-radius: 6px;
  color: white;
  font-size: 12px;
  line-height: 1.3;
  cursor: pointer;
}

@media (max-width: 900px) {
  .calendar-shell {
    grid-template-columns: 1fr;
  }

  .calendar-sidebar {
    position: static;
  }

  .calendar-toolbar {
    align-items: flex-start;
    flex-direction: column;
  }
}
</style>
