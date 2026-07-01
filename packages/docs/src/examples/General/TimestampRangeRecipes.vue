<template>
  <div class="subcontent timestamp-range-recipe">
    <section class="timestamp-range-recipe__panel">
      <div class="timestamp-range-recipe__copy">
        <div class="text-overline text-primary">Range windows</div>
        <h3>Month availability</h3>
        <p>
          Timestamp range helpers can turn booking windows and reserved periods into disabled days,
          selected ranges, and day classes.
        </p>

        <q-list dense bordered separator class="rounded-borders">
          <q-item>
            <q-item-section>
              <q-item-label caption>Booking range</q-item-label>
              <q-item-label>{{ bookingWindowLabel }}</q-item-label>
            </q-item-section>
          </q-item>
          <q-item>
            <q-item-section>
              <q-item-label caption>Open gaps</q-item-label>
              <q-item-label>{{ availableLabels }}</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </div>

      <div class="timestamp-range-recipe__calendar">
        <q-calendar-month
          v-model="selectedDate"
          :disabled-days="disabledDays"
          :selected-start-end-dates="selectedRange"
          :day-class="getDayClass"
          :day-min-height="56"
          animated
          bordered
          @click-day="onSelectDay"
          @click-date="onSelectDay"
        />
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { QCalendarMonth } from '@quasar/quasar-ui-qcalendar'
import {
  createTimestampRange,
  findRangeGaps,
  getDate,
  isTimestampInRange,
  mergeRanges,
  parseTimestamp,
} from '@timestamp-js/core'
import '@quasar/quasar-ui-qcalendar/index.css'

type Timestamp = NonNullable<ReturnType<typeof parseTimestamp>>
type TimestampRange = ReturnType<typeof createTimestampRange>

interface DayScope {
  scope: {
    timestamp: Timestamp
    outside: boolean
  }
}

const selectedDate = ref('2036-06-08')
const selectedRange = ref(['2036-06-08', '2036-06-12'])

const bookingWindow = createRange('2036-06-01', '2036-06-30')
const reservedRanges = mergeRanges([
  createRange('2036-06-03', '2036-06-05'),
  createRange('2036-06-14', '2036-06-18'),
  createRange('2036-06-22', '2036-06-23'),
])
const availableRanges = findRangeGaps(bookingWindow, reservedRanges)

const bookingWindowLabel = formatRange(bookingWindow)
const availableLabels = availableRanges.map(formatRange).join(', ')
const disabledDays = reservedRanges.map((range) => ({
  from: getDate(range.start),
  to: getDate(range.end),
  color: '#a24a43',
  textColor: '#ffffff',
  label: 'Reserved',
}))
const selectedTimestampRange = computed(() =>
  createRange(
    selectedRange.value[0] ?? selectedDate.value,
    selectedRange.value[1] ?? selectedDate.value,
  ),
)

function createRange(start: string, end: string): TimestampRange {
  const startTimestamp = parseTimestamp(start)
  const endTimestamp = parseTimestamp(end)

  if (startTimestamp === null || endTimestamp === null) {
    throw new Error(`Invalid Timestamp range: ${start} to ${end}`)
  }

  return createTimestampRange(startTimestamp, endTimestamp)
}

function formatRange(range: TimestampRange): string {
  return `${getDate(range.start)} to ${getDate(range.end)}`
}

function getDayClass(timestamp: Timestamp): Record<string, boolean> {
  return {
    'timestamp-reserved': reservedRanges.some((range) => isTimestampInRange(timestamp, range)),
    'timestamp-available': availableRanges.some((range) => isTimestampInRange(timestamp, range)),
    'timestamp-selected-range': isTimestampInRange(timestamp, selectedTimestampRange.value),
  }
}

function onSelectDay({ scope }: DayScope) {
  if (scope === undefined || scope.outside === true) {
    return
  }

  selectedDate.value = getDate(scope.timestamp)
}
</script>

<style scoped lang="scss">
.timestamp-range-recipe {
  box-sizing: border-box;
  padding: 18px;
}

.timestamp-range-recipe__panel {
  display: grid;
  grid-template-columns: minmax(240px, 320px) minmax(360px, 1fr);
  gap: 24px;
  align-items: start;
}

.timestamp-range-recipe__copy {
  display: grid;
  gap: 12px;
}

.timestamp-range-recipe__copy h3 {
  margin: 0;
  font-size: 1.35rem;
}

.timestamp-range-recipe__copy p {
  margin: 0;
}

.timestamp-range-recipe__calendar {
  min-width: 0;
}

:deep(.timestamp-available) {
  background: rgba(76, 175, 80, 0.12);
}

:deep(.timestamp-reserved) {
  background: rgba(162, 74, 67, 0.22);
  color: #7d2d28;
  text-decoration: line-through;
}

:deep(.timestamp-selected-range) {
  box-shadow: inset 0 0 0 2px rgba(33, 150, 243, 0.8);
}

@media (max-width: 900px) {
  .timestamp-range-recipe__panel {
    grid-template-columns: 1fr;
  }
}
</style>
