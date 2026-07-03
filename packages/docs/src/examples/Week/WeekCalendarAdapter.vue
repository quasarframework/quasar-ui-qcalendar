<template>
  <div class="subcontent calendar-adapter-week">
    <p class="text-body2 text-center q-mb-md">
      Week views can render native calendar labels and native-keyed data on each visible day while
      preserving Gregorian interop metadata.
    </p>

    <div class="calendar-adapter-week__toolbar">
      <calendar-adapter-selector v-model="calendarId" :calendars="calendarExamples" />
      <navigation-bar @today="onToday" @prev="onPrev" @next="onNext" />
    </div>

    <calendar-adapter-title
      :calendar-label="activeCalendar.label"
      :month-title="nativeMonthTitle"
      :range-label="nativeMonthRange"
      :direction="activeCalendar.direction"
    />

    <div class="row justify-center full-width">
      <div class="calendar-adapter-week__calendar">
        <q-calendar-day
          ref="calendar"
          v-model="selectedDate"
          view="week"
          animated
          bordered
          hoverable
          :interval-start="8"
          :interval-count="10"
          :interval-height="34"
          :calendar-system="activeCalendar.calendar"
          :locale="activeCalendar.locale"
          :weekdays="activeCalendar.weekdays"
          :dir="activeCalendar.direction"
        >
          <template #head-day-event="{ scope }">
            <div class="calendar-adapter-week__header">
              <strong>{{ getNativeHeaderLabel(scope.calendarTimestamp, activeCalendar) }}</strong>
              <span
                >Gregorian {{ scope.calendarIdentity.gregorian.month }}/{{
                  scope.calendarIdentity.gregorian.day
                }}</span
              >
            </div>
          </template>

          <template #day-interval="{ scope }">
            <div
              v-for="item in getIntervalItems(scope.timestamp, scope.calendarTimestamp)"
              :key="item"
              class="calendar-adapter-week__item"
              :title="item"
            >
              {{ item }}
            </div>
          </template>
        </q-calendar-day>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { QCalendarDay } from '@quasar/quasar-ui-qcalendar'
import '@quasar/quasar-ui-qcalendar/index.css'

import CalendarAdapterSelector from '@/components/CalendarAdapterSelector.vue'
import CalendarAdapterTitle from '@/components/CalendarAdapterTitle.vue'
import NavigationBar from '@/components/NavigationBar.vue'
import {
  calendarExampleDates,
  calendarExamples,
  getCalendarExample,
  getEquivalentNativeDate,
  getNativeHeaderLabel,
  getNativeMonthRangeLabel,
  getNativeMonthTitleLabel,
  parseNativeDate,
  type CalendarExampleId,
} from '@/utils/calendarAdapterExamples'
import type { Timestamp } from '@timestamp-js/core'

const calendar = ref<QCalendarDay>()
const calendarId = ref<CalendarExampleId>('islamic-civil')
const selectedDates = ref<Record<CalendarExampleId, string>>({ ...calendarExampleDates })
const selectedDate = computed({
  get: () => selectedDates.value[calendarId.value],
  set: (value: string) => {
    selectedDates.value[calendarId.value] = value
  },
})

const activeCalendar = computed(() => getCalendarExample(calendarId.value))
const selectedTimestamp = computed(() => parseNativeDate(selectedDate.value, activeCalendar.value))
const nativeMonthTitle = computed(() =>
  getNativeMonthTitleLabel(selectedTimestamp.value, activeCalendar.value),
)
const nativeMonthRange = computed(() =>
  getNativeMonthRangeLabel(selectedTimestamp.value, activeCalendar.value),
)

watch(calendarId, (nextId, previousId) => {
  selectedDates.value[nextId] = getEquivalentNativeDate(
    selectedDates.value[previousId],
    getCalendarExample(previousId),
    getCalendarExample(nextId),
  )
})

const intervalItems: Record<CalendarExampleId, Record<string, string[]>> = {
  'islamic-civil': {
    '1445-09-29 09:00': ['Hijri planning'],
    '1445-09-30 10:00': ['Ramadan close'],
    '1445-10-01 11:00': ['Follow-up'],
  },
  saka: {
    '1946-01-20 09:00': ['Saka planning'],
    '1946-01-21 10:00': ['Team review'],
    '1946-01-22 11:00': ['Native date key'],
  },
  hebrew: {
    '5785-01-14 09:00': ['Hebrew planning'],
    '5785-01-15 10:00': ['Team review'],
    '5785-01-16 11:00': ['Native date key'],
  },
  persian: {
    '1403-01-14 09:00': ['Persian planning'],
    '1403-01-15 10:00': ['Team review'],
    '1403-01-16 11:00': ['Native date key'],
  },
}

function getIntervalItems(timestamp: Timestamp, calendarTimestamp: Timestamp): string[] {
  const key = `${calendarTimestamp.date} ${timestamp.time}`

  return intervalItems[calendarId.value][key] ?? []
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
</script>

<style lang="scss" scoped>
.calendar-adapter-week {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: 16px;
  width: 100%;
  min-width: 0;
  max-width: 100%;
  overflow: hidden;
}

.calendar-adapter-week > * {
  min-width: 0;
  max-width: 100%;
}

.calendar-adapter-week__toolbar {
  display: grid;
  justify-items: center;
  gap: 12px;
  width: 100%;
}

.calendar-adapter-week__calendar {
  display: flex;
  width: 100%;
  max-width: 920px;
  min-width: 0;
  height: 420px;
}

.calendar-adapter-week__header {
  display: grid;
  place-items: center;
  justify-items: center;
  gap: 2px;
  width: 100%;
  min-width: 0;
  line-height: 1.15;
  text-align: center;
  unicode-bidi: isolate;
}

.calendar-adapter-week__header span {
  font-size: 0.7rem;
  opacity: 0.7;
}

.calendar-adapter-week__item {
  box-sizing: border-box;
  width: calc(100% - 8px);
  max-width: calc(100% - 8px);
  margin: 2px 4px;
  padding: 2px 6px;
  border-radius: 4px;
  background: color-mix(in srgb, var(--q-primary), transparent 82%);
  color: var(--q-primary);
  font-size: 0.68rem;
  line-height: 1.2;
  overflow: hidden;
  text-align: center;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
