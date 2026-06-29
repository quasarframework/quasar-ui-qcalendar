<template>
  <div class="subcontent calendar-adapter">
    <p class="text-body2 text-center q-mb-md">
      QCalendar keeps emitted dates Gregorian while the adapter controls month boundaries,
      outside-day state, and native labels.
    </p>

    <div class="calendar-adapter__toolbar">
      <calendar-adapter-selector v-model="calendarId" :calendars="calendarExamples" />

      <navigation-bar @today="onToday" @prev="onPrev" @next="onNext" />
    </div>

    <calendar-adapter-title
      :calendar-label="activeCalendar.label"
      :month-title="selectedNativeMonthTitle"
      :range-label="selectedNativeMonthRange"
      :direction="activeCalendar.direction"
    />

    <div class="row justify-center full-width">
      <div class="calendar-adapter__month" :dir="activeCalendar.direction">
        <q-calendar-month
          ref="calendar"
          v-model="selectedDate"
          animated
          bordered
          focusable
          hoverable
          no-active-date
          :calendar-system="activeCalendar.calendar"
          :locale="activeCalendar.locale"
          :weekdays="activeCalendar.weekdays"
          :dir="activeCalendar.direction"
          :day-min-height="84"
          :day-height="0"
          @click-day="onClickDay"
          @click-date="onClickDay"
        >
          <template #day="{ scope: { timestamp, calendarTimestamp, outside } }">
            <div
              class="calendar-adapter__cell"
              :class="{
                'calendar-adapter__cell--native-outside': outside,
              }"
            >
              <div class="calendar-adapter__gregorian">
                Gregorian {{ timestamp.month }}/{{ timestamp.day }}
              </div>
              <div class="calendar-adapter__badges">
                <span v-if="outside" class="calendar-adapter__badge">
                  Outside {{ activeCalendar.shortLabel }} month
                </span>
                <span
                  v-if="getNativeBoundaryLabel(calendarTimestamp)"
                  class="calendar-adapter__badge"
                >
                  {{ getNativeBoundaryLabel(calendarTimestamp) }}
                </span>
              </div>
              <div
                v-for="event in getNativeEvents(calendarTimestamp)"
                :key="event"
                class="calendar-adapter__event"
              >
                {{ event }}
              </div>
            </div>
          </template>
        </q-calendar-month>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { QCalendarMonth } from '@quasar/quasar-ui-qcalendar'
import {
  createCalendarTimestampFromEpochDay,
  getCalendarEndOfMonth,
  getCalendarStartOfMonth,
  getEpochDay,
  parseTimestamp,
  type CalendarSystem,
  type Timestamp,
} from '@timestamp-js/core'
import { islamicCivilCalendar } from '@timestamp-js/calendar-islamic'
import { indianNationalCalendar } from '@timestamp-js/calendar-saka'
import '@quasar/quasar-ui-qcalendar/index.css'

import CalendarAdapterSelector from '@/components/CalendarAdapterSelector.vue'
import CalendarAdapterTitle from '@/components/CalendarAdapterTitle.vue'
import NavigationBar from '@/components/NavigationBar.vue'

type CalendarId = 'islamic-civil' | 'saka'

interface CalendarExample {
  id: CalendarId
  label: string
  shortLabel: string
  calendar: CalendarSystem
  locale: string
  direction: 'ltr' | 'rtl'
  weekdays: number[]
  months: string[]
  events: Record<string, string[]>
}

const calendarExamples: CalendarExample[] = [
  {
    id: 'islamic-civil',
    label: 'Islamic Civil (Hijri)',
    shortLabel: 'Hijri',
    calendar: islamicCivilCalendar,
    locale: 'ar',
    direction: 'rtl',
    weekdays: [6, 0, 1, 2, 3, 4, 5],
    months: [
      'محرم',
      'صفر',
      'ربيع الأول',
      'ربيع الآخر',
      'جمادى الأولى',
      'جمادى الآخرة',
      'رجب',
      'شعبان',
      'رمضان',
      'شوال',
      'ذو القعدة',
      'ذو الحجة',
    ],
    events: {
      '1445-09-01': ['Native date key'],
      '1445-09-15': ['Mid-month review'],
      '1445-09-20': ['Planning checkpoint'],
      '1445-09-30': ['Month close'],
    },
  },
  {
    id: 'saka',
    label: 'Indian National (Saka)',
    shortLabel: 'Saka',
    calendar: indianNationalCalendar,
    locale: 'hi-IN',
    direction: 'ltr',
    weekdays: [0, 1, 2, 3, 4, 5, 6],
    months: [
      'चैत्र',
      'वैशाख',
      'ज्येष्ठ',
      'आषाढ़',
      'श्रावण',
      'भाद्र',
      'आश्विन',
      'कार्तिक',
      'अग्रहायण',
      'पौष',
      'माघ',
      'फाल्गुन',
    ],
    events: {
      '1946-01-01': ['New Saka year'],
      '1946-01-05': ['Native date key'],
      '1946-01-15': ['Planning review'],
      '1946-01-31': ['Month close'],
    },
  },
]

const calendar = ref<QCalendarMonth>()
const calendarId = ref<CalendarId>('islamic-civil')
const selectedDate = ref('2024-03-25')

const activeCalendar = computed<CalendarExample>(
  () => calendarExamples.find((entry) => entry.id === calendarId.value) ?? calendarExamples[0]!,
)
const selectedNativeTimestamp = computed(() =>
  getNativeTimestamp(parseRequired(selectedDate.value)),
)
const selectedNativeMonthStart = computed(() =>
  getCalendarStartOfMonth(selectedNativeTimestamp.value, activeCalendar.value.calendar),
)
const selectedNativeMonthEnd = computed(() =>
  getCalendarEndOfMonth(selectedNativeTimestamp.value, activeCalendar.value.calendar),
)
const selectedNativeMonthTitle = computed(() => {
  const start = selectedNativeMonthStart.value

  return `${getNativeMonthName(start)} ${start.year}`
})
const selectedNativeMonthRange = computed(() => {
  const start = selectedNativeMonthStart.value
  const end = selectedNativeMonthEnd.value
  const startGregorian = getGregorianTimestamp(start)
  const endGregorian = getGregorianTimestamp(end)

  return `${start.date} to ${end.date} (${startGregorian.date} to ${endGregorian.date} Gregorian)`
})

function parseRequired(value: string): Timestamp {
  const timestamp = parseTimestamp(value)

  if (timestamp === null) {
    throw new Error(`Invalid QCalendar date: ${value}`)
  }

  return timestamp
}

function getNativeTimestamp(timestamp: Timestamp): Timestamp {
  return createCalendarTimestampFromEpochDay(getEpochDay(timestamp), activeCalendar.value.calendar)
}

function getGregorianTimestamp(nativeTimestamp: Timestamp): Timestamp {
  return createCalendarTimestampFromEpochDay(
    getEpochDay(nativeTimestamp, activeCalendar.value.calendar),
  )
}

function getNativeMonthName(timestamp: Timestamp): string {
  return activeCalendar.value.months[timestamp.month - 1] ?? `Month ${timestamp.month}`
}

function getNativeEvents(timestamp: Timestamp): string[] {
  return activeCalendar.value.events[timestamp.date] ?? []
}

function getNativeBoundaryLabel(timestamp: Timestamp): string {
  if (timestamp.day === 1) {
    return 'Month start'
  }

  if (
    timestamp.day === activeCalendar.value.calendar.daysInMonth(timestamp.year, timestamp.month)
  ) {
    return 'Month end'
  }

  return ''
}

function onToday() {
  calendar.value?.moveToToday()
}

function onPrev() {
  calendar.value?.prev()
}

function onNext() {
  calendar.value?.next()
}

function onClickDay({ scope }: { scope: { timestamp: Timestamp; outside: boolean } }) {
  if (scope.outside === true) {
    return
  }

  selectedDate.value = scope.timestamp.date
}
</script>

<style scoped lang="scss">
.calendar-adapter {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: 18px;
  width: 100%;
  min-width: 0;
  max-width: 100%;
  overflow: hidden;
}

.calendar-adapter > * {
  min-width: 0;
  max-width: 100%;
}

.calendar-adapter__toolbar {
  display: grid;
  gap: 16px;
  grid-template-columns: minmax(240px, 420px) auto;
  align-items: center;
  justify-content: space-between;
  width: 100%;
}

.calendar-adapter__month {
  display: flex;
  max-width: 860px;
  width: 100%;
}

.calendar-adapter__cell {
  display: grid;
  gap: 4px;
  padding: 3px 6px 6px;
}

.calendar-adapter__cell--native-outside {
  opacity: 0.45;
  background: color-mix(in srgb, currentColor 5%, transparent);
}

.calendar-adapter__gregorian {
  color: color-mix(in srgb, currentColor 58%, transparent);
  display: flex;
  font-size: 0.68rem;
  gap: 4px;
}

.calendar-adapter__badges {
  display: flex;
  flex-wrap: wrap;
  gap: 3px;
}

.calendar-adapter__badge {
  border: 1px solid color-mix(in srgb, var(--q-primary) 42%, transparent);
  border-radius: 999px;
  color: color-mix(in srgb, currentColor 76%, transparent);
  font-size: 0.62rem;
  line-height: 1.1;
  padding: 1px 5px;
}

.calendar-adapter__event {
  background: color-mix(in srgb, var(--q-primary) 16%, transparent);
  border-left: 3px solid var(--q-primary);
  border-radius: 3px;
  font-size: 0.72rem;
  padding: 2px 5px;
}

@media (max-width: 760px) {
  .calendar-adapter__toolbar {
    grid-template-columns: 1fr;
  }
}
</style>
