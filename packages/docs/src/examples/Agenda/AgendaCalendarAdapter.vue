<template>
  <div class="subcontent calendar-adapter-agenda">
    <p class="text-body2 text-center q-mb-md">
      Agenda views can use adapter labels in headers and body cells while QCalendar renders the
      visible week, even when that week crosses a native month boundary.
    </p>

    <div class="calendar-adapter-agenda__toolbar">
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
        >
          <template #head-day-event="{ scope }">
            <span class="calendar-adapter-agenda__head-label">
              <small>{{ getNativeMonthShort(scope.calendarTimestamp) }}</small>
            </span>
          </template>

          <template #day="{ scope: { calendarTimestamp, calendarIdentity, outside } }">
            <article class="calendar-adapter-agenda__day-card">
              <div>
                <strong>{{ getNativeDateLabel(calendarTimestamp) }}</strong>
                <span>Gregorian {{ calendarIdentity.gregorianDate }}</span>
              </div>
              <div class="calendar-adapter-agenda__badges">
                <span v-if="outside" class="calendar-adapter-agenda__badge">
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
import { computed, ref, watch } from 'vue'
import { QCalendarAgenda } from '@quasar/quasar-ui-qcalendar'
import { getCalendarEndOfMonth, getCalendarStartOfMonth, type Timestamp } from '@timestamp-js/core'
import '@quasar/quasar-ui-qcalendar/index.css'

import CalendarAdapterSelector from '@/components/CalendarAdapterSelector.vue'
import CalendarAdapterTitle from '@/components/CalendarAdapterTitle.vue'
import NavigationBar from '@/components/NavigationBar.vue'
import {
  calendarExampleDates,
  calendarExamples,
  getCalendarExample,
  getEquivalentNativeDate,
  getNativeBoundaryLabel as getCalendarNativeBoundaryLabel,
  getNativeDateLabel as getCalendarNativeDateLabel,
  getNativeItems as getCalendarNativeItems,
  getNativeMonthName as getCalendarNativeMonthName,
  getNativeMonthShort as getCalendarNativeMonthShort,
  parseNativeDate,
  toGregorianTimestamp,
  type CalendarExample,
  type CalendarExampleId,
} from '@/utils/calendarAdapterExamples'

const calendar = ref<QCalendarAgenda>()
const calendarId = ref<CalendarExampleId>('islamic-civil')
const selectedDates = ref<Record<CalendarExampleId, string>>({ ...calendarExampleDates })

const selectedDate = computed({
  get: () => selectedDates.value[calendarId.value],
  set: (value: string) => {
    selectedDates.value[calendarId.value] = value
  },
})

const activeCalendar = computed<CalendarExample>(() => getCalendarExample(calendarId.value))
const selectedNativeTimestamp = computed(() => parseRequired(selectedDate.value))
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

watch(calendarId, (nextId, previousId) => {
  selectedDates.value[nextId] = getEquivalentNativeDate(
    selectedDates.value[previousId],
    getCalendarExample(previousId),
    getCalendarExample(nextId),
  )
})

function parseRequired(value: string): Timestamp {
  return parseNativeDate(value, activeCalendar.value)
}

function getGregorianTimestamp(nativeTimestamp: Timestamp): Timestamp {
  return toGregorianTimestamp(nativeTimestamp, activeCalendar.value)
}

function getNativeDateLabel(timestamp: Timestamp): string {
  return getCalendarNativeDateLabel(timestamp, activeCalendar.value)
}

function getNativeMonthName(timestamp: Timestamp): string {
  return getCalendarNativeMonthName(timestamp, activeCalendar.value)
}

function getNativeMonthShort(timestamp: Timestamp): string {
  return getCalendarNativeMonthShort(timestamp, activeCalendar.value)
}

function getNativeItems(timestamp: Timestamp): string[] {
  return getCalendarNativeItems(timestamp, activeCalendar.value)
}

function getNativeBoundaryLabel(timestamp: Timestamp): string {
  return getCalendarNativeBoundaryLabel(timestamp, activeCalendar.value)
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
  grid-template-columns: minmax(0, 1fr);
  gap: 18px;
  width: 100%;
  min-width: 0;
  max-width: 100%;
  overflow: hidden;
}

.calendar-adapter-agenda > * {
  min-width: 0;
  max-width: 100%;
}

.calendar-adapter-agenda__toolbar {
  display: grid;
  gap: 12px;
  justify-items: center;
  width: 100%;
}

.calendar-adapter-agenda__calendar {
  display: flex;
  max-width: 920px;
  min-width: 0;
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
</style>
