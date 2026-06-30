<template>
  <div class="subcontent calendar-adapter">
    <p class="text-body2 text-center q-mb-md">
      QCalendarMonth uses native adapter dates for its model, month boundaries, outside-day state,
      and labels.
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
          <template #day="{ scope: { timestamp, calendarIdentity, outside } }">
            <div
              class="calendar-adapter__cell"
              :class="{
                'calendar-adapter__cell--native-outside': outside,
              }"
            >
              <div class="calendar-adapter__gregorian">
                Gregorian {{ calendarIdentity.gregorian.month }}/{{
                  calendarIdentity.gregorian.day
                }}
              </div>
              <div class="calendar-adapter__badges">
                <span v-if="outside" class="calendar-adapter__badge">
                  Outside {{ activeCalendar.shortLabel }} month
                </span>
                <span v-if="getBoundaryLabel(timestamp)" class="calendar-adapter__badge">
                  {{ getBoundaryLabel(timestamp) }}
                </span>
              </div>
              <div
                v-for="event in getEvents(timestamp)"
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
  getCalendarEndOfMonth,
  getCalendarStartOfMonth,
  parseCalendarTimestamp,
  type Timestamp,
} from '@timestamp-js/core'
import '@quasar/quasar-ui-qcalendar/index.css'

import CalendarAdapterSelector from '@/components/CalendarAdapterSelector.vue'
import CalendarAdapterTitle from '@/components/CalendarAdapterTitle.vue'
import NavigationBar from '@/components/NavigationBar.vue'
import {
  calendarExamples,
  getCalendarExample,
  getNativeBoundaryLabel,
  getNativeItems,
  getNativeMonthName,
  toGregorianTimestamp,
  type CalendarExample,
  type CalendarExampleId,
} from '@/utils/calendarAdapterExamples'

const calendar = ref<QCalendarMonth>()
const calendarId = ref<CalendarExampleId>('islamic-civil')
const selectedDates = ref<Record<CalendarExampleId, string>>({
  'islamic-civil': '1445-09-15',
  saka: '1946-01-15',
})

const selectedDate = computed({
  get: () => selectedDates.value[calendarId.value],
  set: (value: string) => {
    selectedDates.value[calendarId.value] = value
  },
})

const activeCalendar = computed<CalendarExample>(() => getCalendarExample(calendarId.value))
const selectedNativeTimestamp = computed(() => parseNativeRequired(selectedDate.value))
const selectedNativeMonthStart = computed(() =>
  getCalendarStartOfMonth(selectedNativeTimestamp.value, activeCalendar.value.calendar),
)
const selectedNativeMonthEnd = computed(() =>
  getCalendarEndOfMonth(selectedNativeTimestamp.value, activeCalendar.value.calendar),
)
const selectedNativeMonthTitle = computed(() => {
  const start = selectedNativeMonthStart.value

  return `${getNativeMonthName(start, activeCalendar.value)} ${start.year}`
})
const selectedNativeMonthRange = computed(() => {
  const start = selectedNativeMonthStart.value
  const end = selectedNativeMonthEnd.value
  const startGregorian = toGregorianTimestamp(start, activeCalendar.value)
  const endGregorian = toGregorianTimestamp(end, activeCalendar.value)

  return `${start.date} to ${end.date} (${startGregorian.date} to ${endGregorian.date} Gregorian)`
})

function parseNativeRequired(value: string): Timestamp {
  const timestamp = parseCalendarTimestamp(value, activeCalendar.value.calendar)

  if (timestamp === null) {
    throw new Error(`Invalid ${activeCalendar.value.shortLabel} date: ${value}`)
  }

  return timestamp
}

function getEvents(timestamp: Timestamp): string[] {
  return getNativeItems(timestamp, activeCalendar.value)
}

function getBoundaryLabel(timestamp: Timestamp): string {
  return getNativeBoundaryLabel(timestamp, activeCalendar.value)
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
