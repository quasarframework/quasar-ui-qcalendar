<template>
  <div class="subcontent calendar-adapter-agenda">
    <p class="text-body2 text-center q-mb-md">
      Agenda views can use adapter labels in headers and body cells while QCalendar still owns the
      visible Gregorian week.
    </p>

    <div class="calendar-adapter-agenda__toolbar">
      <div class="calendar-adapter-agenda__selector" role="group" aria-label="Calendar adapter">
        <button
          v-for="calendar in calendarExamples"
          :key="calendar.id"
          class="calendar-adapter-agenda__choice"
          :class="{ 'calendar-adapter-agenda__choice--active': calendar.id === calendarId }"
          type="button"
          :aria-pressed="calendar.id === calendarId"
          @click="calendarId = calendar.id"
        >
          <span class="calendar-adapter-agenda__choice-kicker">{{ calendar.shortLabel }}</span>
          <span>{{ calendar.label }}</span>
        </button>
      </div>

      <navigation-bar @today="onToday" @prev="onPrev" @next="onNext" />
    </div>

    <q-banner rounded class="calendar-adapter-agenda__banner">
      <strong>{{ activeCalendar.label }}</strong>
      <span>{{ selectedNativeMonthLabel }}</span>
    </q-banner>

    <div class="row justify-center">
      <div class="calendar-adapter-agenda__calendar">
        <q-calendar-agenda
          ref="calendar"
          v-model="selectedDate"
          view="week"
          :day-min-height="180"
          :calendar-system="activeCalendar.calendar"
          :locale="activeCalendar.locale"
          :weekdays="activeCalendar.weekdays"
          :dir="activeCalendar.direction"
          animated
          bordered
          hoverable
          @click-day="onClickDay"
          @click-date="onClickDay"
        >
          <template #head-day-event="{ scope }">
            <span class="calendar-adapter-agenda__head-label">
              <small>{{ getNativeMonthShort(scope.calendarTimestamp) }}</small>
            </span>
          </template>

          <template #day="{ scope: { timestamp, calendarTimestamp } }">
            <article
              class="calendar-adapter-agenda__day-card"
              :class="{
                'calendar-adapter-agenda__day-card--native-outside':
                  isOutsideSelectedNativeMonth(calendarTimestamp),
              }"
            >
              <div>
                <strong>{{ getNativeDateLabel(calendarTimestamp) }}</strong>
                <span>Gregorian {{ timestamp.date }}</span>
              </div>
              <div class="calendar-adapter-agenda__badges">
                <span
                  v-if="isOutsideSelectedNativeMonth(calendarTimestamp)"
                  class="calendar-adapter-agenda__badge"
                >
                  Outside {{ activeCalendar.shortLabel }} month
                </span>
                <span
                  v-if="getNativeBoundaryLabel(calendarTimestamp)"
                  class="calendar-adapter-agenda__badge"
                >
                  {{ getNativeBoundaryLabel(calendarTimestamp) }}
                </span>
              </div>

              <ul>
                <li v-for="item in getNativeItems(calendarTimestamp)" :key="item">
                  {{ item }}
                </li>
              </ul>
            </article>
          </template>
        </q-calendar-agenda>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { QCalendarAgenda } from '@quasar/quasar-ui-qcalendar'
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
  monthShorts: string[]
  items: Record<string, string[]>
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
    monthShorts: [
      'محرم',
      'صفر',
      'ربيع ١',
      'ربيع ٢',
      'جمادى ١',
      'جمادى ٢',
      'رجب',
      'شعبان',
      'رمضان',
      'شوال',
      'قعدة',
      'حجة',
    ],
    items: {
      '1445-09-29': ['Native planning date', 'Confirm team capacity'],
      '1445-09-30': ['Close Ramadan planning'],
      '1445-10-01': ['Start Shawwal follow-up'],
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
    monthShorts: ['चै', 'वै', 'ज्ये', 'आषा', 'श्रा', 'भा', 'आश्वि', 'का', 'अग्र', 'पौ', 'मा', 'फा'],
    items: {
      '1946-01-19': ['Native planning date', 'Confirm team capacity'],
      '1946-01-21': ['Prepare release notes'],
      '1946-01-23': ['Calendar adapter review'],
    },
  },
]

const calendar = ref<QCalendarAgenda>()
const calendarId = ref<CalendarId>('islamic-civil')
const selectedDate = ref('2024-04-08')

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
const selectedNativeMonthLabel = computed(() => {
  const start = selectedNativeMonthStart.value
  const end = selectedNativeMonthEnd.value
  const startGregorian = getGregorianTimestamp(start)
  const endGregorian = getGregorianTimestamp(end)

  return `${getNativeMonthName(start)} ${start.year}: ${start.date} to ${end.date} (${startGregorian.date} to ${endGregorian.date} Gregorian)`
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

function getNativeDateLabel(timestamp: Timestamp): string {
  return `${timestamp.date} ${getNativeMonthName(timestamp)}`
}

function getNativeMonthName(timestamp: Timestamp): string {
  return activeCalendar.value.months[timestamp.month - 1] ?? `Month ${timestamp.month}`
}

function getNativeMonthShort(timestamp: Timestamp): string {
  return (
    activeCalendar.value.monthShorts[timestamp.month - 1] ??
    getNativeMonthName(timestamp).slice(0, 3)
  )
}

function getNativeItems(timestamp: Timestamp): string[] {
  return activeCalendar.value.items[timestamp.date] ?? []
}

function isOutsideSelectedNativeMonth(timestamp: Timestamp): boolean {
  const selected = selectedNativeTimestamp.value

  return timestamp.year !== selected.year || timestamp.month !== selected.month
}

function getNativeBoundaryLabel(timestamp: Timestamp): string {
  if (timestamp.day === 1) {
    return `Start of ${getNativeMonthName(timestamp)}`
  }

  if (
    timestamp.day === activeCalendar.value.calendar.daysInMonth(timestamp.year, timestamp.month)
  ) {
    return `End of ${getNativeMonthName(timestamp)}`
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

function onClickDay({ scope }: { scope: { timestamp: Timestamp; outside?: boolean } }) {
  if (scope.outside === true) {
    return
  }

  selectedDate.value = scope.timestamp.date
}
</script>

<style scoped lang="scss">
.calendar-adapter-agenda {
  display: grid;
  gap: 18px;
}

.calendar-adapter-agenda__toolbar {
  display: grid;
  gap: 16px;
  grid-template-columns: minmax(240px, 420px) auto;
  align-items: center;
  justify-content: space-between;
}

.calendar-adapter-agenda__selector {
  display: grid;
  gap: 10px;
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.calendar-adapter-agenda__choice {
  background: color-mix(in srgb, currentColor 4%, transparent);
  border: 1px solid color-mix(in srgb, var(--q-primary) 55%, currentColor 18%);
  border-radius: 6px;
  color: inherit;
  cursor: pointer;
  display: grid;
  gap: 2px;
  min-height: 58px;
  padding: 9px 11px;
  text-align: left;
}

.calendar-adapter-agenda__choice:hover,
.calendar-adapter-agenda__choice:focus-visible {
  border-color: var(--q-primary);
  box-shadow: 0 0 0 2px color-mix(in srgb, var(--q-primary) 22%, transparent);
  outline: none;
}

.calendar-adapter-agenda__choice--active {
  background: color-mix(in srgb, var(--q-primary) 18%, transparent);
  border-color: var(--q-primary);
}

.calendar-adapter-agenda__choice-kicker {
  color: var(--q-primary);
  font-size: 0.72rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.calendar-adapter-agenda__banner {
  display: flex;
  flex-wrap: wrap;
  gap: 8px 12px;
}

.calendar-adapter-agenda__calendar {
  display: flex;
  max-width: 920px;
  min-height: 260px;
  width: 100%;
}

.calendar-adapter-agenda__head-label {
  display: grid;
  justify-items: center;
  line-height: 1.05;
}

.calendar-adapter-agenda__head-label small {
  color: color-mix(in srgb, currentColor 68%, transparent);
  font-size: 0.62rem;
}

.calendar-adapter-agenda__day-card {
  display: grid;
  gap: 8px;
  padding: 8px;
}

.calendar-adapter-agenda__day-card--native-outside {
  background: color-mix(in srgb, currentColor 5%, transparent);
}

.calendar-adapter-agenda__day-card span {
  color: color-mix(in srgb, currentColor 62%, transparent);
  display: block;
  font-size: 0.74rem;
}

.calendar-adapter-agenda__badges {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}

.calendar-adapter-agenda__badge {
  border: 1px solid color-mix(in srgb, var(--q-primary) 42%, transparent);
  border-radius: 999px;
  color: color-mix(in srgb, currentColor 76%, transparent);
  font-size: 0.64rem;
  line-height: 1.1;
  padding: 1px 6px;
}

.calendar-adapter-agenda__day-card ul {
  display: grid;
  gap: 4px;
  list-style: none;
  margin: 0;
  padding: 0;
}

.calendar-adapter-agenda__day-card li {
  background: color-mix(in srgb, var(--q-primary) 14%, transparent);
  border-radius: 4px;
  font-size: 0.75rem;
  padding: 4px 6px;
}

@media (max-width: 760px) {
  .calendar-adapter-agenda__toolbar {
    grid-template-columns: 1fr;
  }
}
</style>
