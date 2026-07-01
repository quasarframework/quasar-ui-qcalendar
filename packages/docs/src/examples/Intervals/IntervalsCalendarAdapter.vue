<template>
  <div class="subcontent calendar-adapter-intervals">
    <p class="text-body2 text-center q-mb-md">
      Interval labels can include native calendar context without changing the time-of-day structure
      of the day view.
    </p>

    <div class="calendar-adapter-intervals__toolbar">
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
      <div class="calendar-adapter-intervals__calendar">
        <q-calendar-day
          ref="calendar"
          v-model="selectedDate"
          view="day"
          animated
          bordered
          hoverable
          :interval-start="7"
          :interval-count="10"
          :interval-height="42"
          :calendar-system="activeCalendar.calendar"
          :locale="activeCalendar.locale"
          :weekdays="activeCalendar.weekdays"
          :dir="activeCalendar.direction"
        >
          <template #interval-label="{ scope }">
            <span class="calendar-adapter-intervals__interval">
              {{ scope.label }}
              <small>{{ getNativeHeaderLabel(scope.calendarTimestamp, activeCalendar) }}</small>
            </span>
          </template>

          <template #head-day-event="{ scope }">
            <div class="calendar-adapter-intervals__header">
              <strong>{{ getNativeDateLabel(scope.calendarTimestamp, activeCalendar) }}</strong>
              <span>Gregorian {{ scope.calendarIdentity.gregorianDate }}</span>
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
  getNativeDateLabel,
  getNativeHeaderLabel,
  getNativeMonthRangeLabel,
  getNativeMonthTitleLabel,
  parseNativeDate,
  type CalendarExampleId,
} from '@/utils/calendarAdapterExamples'

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
.calendar-adapter-intervals {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: 16px;
  width: 100%;
  min-width: 0;
  max-width: 100%;
  overflow: hidden;
}

.calendar-adapter-intervals > * {
  min-width: 0;
  max-width: 100%;
}

.calendar-adapter-intervals__toolbar {
  display: grid;
  justify-items: center;
  gap: 12px;
  width: 100%;
}

.calendar-adapter-intervals__calendar {
  display: flex;
  width: 100%;
  max-width: 820px;
  min-width: 0;
  height: 420px;
}

.calendar-adapter-intervals__header {
  display: grid;
  place-items: center;
  justify-items: center;
  width: 100%;
  min-width: 0;
  line-height: 1.12;
  text-align: center;
  unicode-bidi: isolate;
}

.calendar-adapter-intervals__interval {
  display: inline-grid;
  justify-items: center;
  line-height: 1.12;
}

.calendar-adapter-intervals__header span,
.calendar-adapter-intervals__interval small {
  margin-top: 2px;
  font-size: 0.68rem;
  opacity: 0.72;
}
</style>
