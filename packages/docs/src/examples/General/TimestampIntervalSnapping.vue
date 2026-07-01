<template>
  <div class="subcontent timestamp-interval-recipe">
    <section class="timestamp-interval-recipe__panel">
      <div class="timestamp-interval-recipe__copy">
        <div class="text-overline text-primary">Interval snapping</div>
        <h3>Day scheduling</h3>
        <p>
          Use clamped interval clicks for the pointer target, then snap to the closest half hour and
          measure the selected block with Timestamp helpers.
        </p>

        <q-banner rounded class="bg-blue-1 text-blue-10">
          {{ selectedLabel }}
        </q-banner>
      </div>

      <div class="timestamp-interval-recipe__calendar">
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
import { QCalendarDay } from '@quasar/quasar-ui-qcalendar'
import {
  addDuration,
  createDuration,
  createIntervalList,
  durationBetween,
  formatDuration,
  getDateTime,
  getTime,
  parseTimestamp,
  roundToInterval,
} from '@timestamp-js/core'
import '@quasar/quasar-ui-qcalendar/index.css'

type Timestamp = NonNullable<ReturnType<typeof parseTimestamp>>

interface DayScope {
  scope: {
    timestamp: Timestamp
    outside: boolean
  }
}

const calendar = ref<QCalendarDay>()
const selectedDate = ref('2036-06-08')
const selectedStart = ref(parseRequired('2036-06-08 09:30'))
const blockDuration = createDuration(90 * 60 * 1000)

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

function onChooseTime({ scope }: DayScope) {
  if (scope === undefined || scope.outside === true) {
    return
  }

  selectedStart.value = roundToInterval(scope.timestamp, 30)
  selectedDate.value = selectedStart.value.date
}
</script>

<style scoped lang="scss">
.timestamp-interval-recipe {
  box-sizing: border-box;
  padding: 18px;
}

.timestamp-interval-recipe__panel {
  display: grid;
  grid-template-columns: minmax(240px, 320px) minmax(360px, 1fr);
  gap: 24px;
  align-items: start;
}

.timestamp-interval-recipe__copy {
  display: grid;
  gap: 12px;
}

.timestamp-interval-recipe__copy h3 {
  margin: 0;
  font-size: 1.35rem;
}

.timestamp-interval-recipe__copy p {
  margin: 0;
}

.timestamp-interval-recipe__calendar {
  height: 360px;
  min-width: 0;
}

@media (max-width: 900px) {
  .timestamp-interval-recipe__panel {
    grid-template-columns: 1fr;
  }
}
</style>
