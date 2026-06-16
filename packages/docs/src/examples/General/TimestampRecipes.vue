<template>
  <div class="subcontent timestamp-recipes">
    <section class="timestamp-recipes__panel">
      <div class="timestamp-recipes__copy">
        <div class="text-overline text-primary">Range windows</div>
        <h3>Month availability</h3>
        <p>
          Timestamp range helpers can turn booking windows and reserved periods into disabled days,
          selected ranges, and day classes.
        </p>

        <q-list dense bordered separator class="rounded-borders">
          <q-item>
            <q-item-section>
              <q-item-label caption>Booking window</q-item-label>
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

      <div class="timestamp-recipes__calendar">
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

    <section class="timestamp-recipes__panel">
      <div class="timestamp-recipes__copy">
        <div class="text-overline text-primary">Interval snapping</div>
        <h3>Day scheduling</h3>
        <p>
          Use clamped interval clicks for the pointer target, then snap and measure the selected
          block with Timestamp helpers.
        </p>

        <q-banner rounded class="bg-blue-1 text-blue-10">
          {{ selectedLabel }}
        </q-banner>
      </div>

      <div class="timestamp-recipes__calendar timestamp-recipes__calendar--day">
        <q-calendar-day
          ref="calendar"
          v-model="selectedDate"
          :interval-minutes="15"
          :interval-count="48"
          :interval-start="28"
          :interval-height="22"
          :selected-dates="selectedDates"
          time-clicks-clamped
          animated
          bordered
          @click-time="onChooseTime"
        />
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { QCalendarDay, QCalendarMonth } from '@quasar/quasar-ui-qcalendar'
import {
  addDuration,
  createDuration,
  createIntervalList,
  createTimestampRange,
  durationBetween,
  findRangeGaps,
  formatDuration,
  getDate,
  getDateTime,
  getTime,
  isTimestampInRange,
  mergeRanges,
  parseTimestamp,
  roundToInterval,
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

const calendar = ref<QCalendarDay>()
const selectedDate = ref('2036-06-08')
const selectedRange = ref(['2036-06-08', '2036-06-12'])
const selectedStart = ref(parseRequired('2036-06-08 09:30'))
const blockDuration = createDuration(90 * 60 * 1000)

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
const selectedEnd = computed(() => addDuration(selectedStart.value, blockDuration))
const selectedDates = computed(() =>
  createIntervalList(
    selectedStart.value,
    selectedStart.value.hour * 4 + selectedStart.value.minute / 15,
    15,
    6,
    selectedStart.value,
  ).map(getDateTime),
)
const selectedLabel = computed(() => {
  const duration = durationBetween(selectedStart.value, selectedEnd.value)
  return `${selectedDate.value} ${getTime(selectedStart.value)}-${getTime(selectedEnd.value)} (${formatDuration(duration)})`
})

function parseRequired(value: string): Timestamp {
  const timestamp = parseTimestamp(value)

  if (timestamp === null) {
    throw new Error(`Invalid Timestamp value: ${value}`)
  }

  return timestamp
}

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
    'timestamp-selected-window': isTimestampInRange(timestamp, selectedTimestampRange.value),
  }
}

function onSelectDay({ scope }: DayScope) {
  if (scope === undefined || scope.outside === true) {
    return
  }

  selectedDate.value = getDate(scope.timestamp)
}

function onChooseTime({ scope }: DayScope) {
  if (scope === undefined || scope.outside === true) {
    return
  }

  selectedStart.value = roundToInterval(scope.timestamp, 30)
  selectedDate.value = selectedStart.value.date
}
</script>

<style scoped lang="scss">
.timestamp-recipes {
  display: grid;
  gap: 32px;
}

.timestamp-recipes__panel {
  display: grid;
  grid-template-columns: minmax(240px, 320px) minmax(360px, 1fr);
  gap: 24px;
  align-items: start;
}

.timestamp-recipes__copy {
  display: grid;
  gap: 12px;
}

.timestamp-recipes__copy h3 {
  margin: 0;
  font-size: 1.35rem;
}

.timestamp-recipes__copy p {
  margin: 0;
}

.timestamp-recipes__calendar {
  min-width: 0;
}

.timestamp-recipes__calendar--day {
  height: 420px;
}

:deep(.timestamp-available) {
  background: rgba(76, 175, 80, 0.12);
}

:deep(.timestamp-reserved) {
  background: rgba(162, 74, 67, 0.22);
  color: #7d2d28;
  text-decoration: line-through;
}

:deep(.timestamp-selected-window) {
  box-shadow: inset 0 0 0 2px rgba(33, 150, 243, 0.8);
}

@media (max-width: 900px) {
  .timestamp-recipes__panel {
    grid-template-columns: 1fr;
  }
}
</style>
