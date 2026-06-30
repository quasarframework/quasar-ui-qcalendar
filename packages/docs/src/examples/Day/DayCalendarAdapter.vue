<template>
  <div class="subcontent calendar-adapter-day">
    <p class="text-body2 text-center q-mb-md">
      Day views use adapter-aware date scopes for native labels and native-keyed data while keeping
      Gregorian interop available for integrations.
    </p>

    <div class="calendar-adapter-day__toolbar">
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
      <div class="calendar-adapter-day__calendar">
        <q-calendar-day
          ref="calendar"
          v-model="selectedDate"
          view="day"
          animated
          bordered
          hoverable
          :interval-start="7"
          :interval-count="12"
          :interval-height="34"
          :calendar-system="activeCalendar.calendar"
          :locale="activeCalendar.locale"
          :weekdays="activeCalendar.weekdays"
          :dir="activeCalendar.direction"
        >
          <template #head-day-event="{ scope }">
            <div class="calendar-adapter-day__header">
              <strong>{{ getNativeDateLabel(scope.calendarTimestamp, activeCalendar) }}</strong>
              <span>Gregorian {{ scope.timestamp.date }}</span>
              <q-chip
                v-for="item in getNativeItems(scope.calendarTimestamp, activeCalendar)"
                :key="item"
                dense
                square
                color="primary"
                text-color="white"
              >
                {{ item }}
              </q-chip>
            </div>
          </template>
        </q-calendar-day>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { QCalendarDay } from '@quasar/quasar-ui-qcalendar'
import '@quasar/quasar-ui-qcalendar/index.css'

import CalendarAdapterSelector from '@/components/CalendarAdapterSelector.vue'
import CalendarAdapterTitle from '@/components/CalendarAdapterTitle.vue'
import NavigationBar from '@/components/NavigationBar.vue'
import {
  calendarExamples,
  getCalendarExample,
  getNativeDateLabel,
  getNativeItems,
  getNativeMonthRangeLabel,
  getNativeMonthTitleLabel,
  parseGregorianDate,
  type CalendarExampleId,
} from '@/utils/calendarAdapterExamples'

const calendar = ref<QCalendarDay>()
const calendarId = ref<CalendarExampleId>('islamic-civil')
const selectedDate = ref('2024-04-08')

const activeCalendar = computed(() => getCalendarExample(calendarId.value))
const selectedTimestamp = computed(() => parseGregorianDate(selectedDate.value))
const nativeMonthRange = computed(() =>
  getNativeMonthRangeLabel(selectedTimestamp.value, activeCalendar.value),
)
const nativeMonthTitle = computed(() =>
  getNativeMonthTitleLabel(selectedTimestamp.value, activeCalendar.value),
)

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
.calendar-adapter-day {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: 16px;
  width: 100%;
  min-width: 0;
  max-width: 100%;
  overflow: hidden;
}

.calendar-adapter-day > * {
  min-width: 0;
  max-width: 100%;
}

.calendar-adapter-day__toolbar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  width: 100%;
}

.calendar-adapter-day__calendar {
  display: flex;
  width: 100%;
  max-width: 820px;
  min-width: 0;
  height: 420px;
}

.calendar-adapter-day__header {
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

.calendar-adapter-day__header span {
  font-size: 0.72rem;
  opacity: 0.7;
}
</style>
