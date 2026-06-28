<template>
  <div class="subcontent calendar-adapter-day">
    <p class="text-body2 text-center q-mb-md">
      Day views keep Gregorian model values while slot scopes expose native timestamps for labels
      and native-keyed data.
    </p>

    <div class="calendar-adapter-day__toolbar">
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

    <q-banner rounded class="calendar-adapter-day__banner">
      <strong>{{ activeCalendar.label }}</strong>
      <span>Selected native month: {{ nativeMonthRange }}</span>
    </q-banner>

    <div class="row justify-center">
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

import NavigationBar from '@/components/NavigationBar.vue'
import {
  calendarToggleOptions,
  getCalendarExample,
  getNativeDateLabel,
  getNativeItems,
  getNativeMonthRangeLabel,
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
  gap: 16px;
}

.calendar-adapter-day__toolbar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.calendar-adapter-day__banner {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.calendar-adapter-day__calendar {
  display: flex;
  width: 100%;
  max-width: 820px;
  height: 420px;
}

.calendar-adapter-day__header {
  display: grid;
  justify-items: center;
  gap: 2px;
  line-height: 1.15;
}

.calendar-adapter-day__header span {
  font-size: 0.72rem;
  opacity: 0.7;
}
</style>
