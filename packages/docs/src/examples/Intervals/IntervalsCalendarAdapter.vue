<template>
  <div class="subcontent calendar-adapter-intervals">
    <p class="text-body2 text-center q-mb-md">
      Interval labels can include native calendar context without changing the time-of-day structure
      of the day view.
    </p>

    <div class="calendar-adapter-intervals__toolbar">
      <q-btn-toggle
        v-model="calendarId"
        :options="calendarToggleOptions"
        dense
        unelevated
        toggle-color="primary"
        color="grey-3"
        text-color="dark"
      />
      <navigation-bar @today="onToday" @prev="onPrev" @next="onNext" />
    </div>

    <div class="row justify-center">
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
              <span>Gregorian {{ scope.timestamp.date }}</span>
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

import NavigationBar from '@/components/NavigationBar.vue'
import {
  calendarToggleOptions,
  getCalendarExample,
  getNativeDateLabel,
  getNativeHeaderLabel,
  type CalendarExampleId,
} from '@/utils/calendarAdapterExamples'

const calendar = ref<QCalendarDay>()
const calendarId = ref<CalendarExampleId>('islamic-civil')
const selectedDate = ref('2024-04-08')

const activeCalendar = computed(() => getCalendarExample(calendarId.value))

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
  gap: 16px;
}

.calendar-adapter-intervals__toolbar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.calendar-adapter-intervals__calendar {
  display: flex;
  width: 100%;
  max-width: 820px;
  height: 420px;
}

.calendar-adapter-intervals__header,
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
