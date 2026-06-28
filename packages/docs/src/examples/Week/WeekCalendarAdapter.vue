<template>
  <div class="subcontent calendar-adapter-week">
    <p class="text-body2 text-center q-mb-md">
      Week views are useful when the app stores Gregorian dates but users need native calendar
      labels on each visible day.
    </p>

    <div class="calendar-adapter-week__toolbar">
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
              <span>{{ scope.timestamp.month }}/{{ scope.timestamp.day }}</span>
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
import { computed, ref } from 'vue'
import { QCalendarDay } from '@quasar/quasar-ui-qcalendar'
import '@quasar/quasar-ui-qcalendar/index.css'

import NavigationBar from '@/components/NavigationBar.vue'
import {
  calendarToggleOptions,
  getCalendarExample,
  getNativeHeaderLabel,
  type CalendarExampleId,
} from '@/utils/calendarAdapterExamples'
import type { Timestamp } from '@timestamp-js/core'

const calendar = ref<QCalendarDay>()
const calendarId = ref<CalendarExampleId>('islamic-civil')
const selectedDate = ref('2024-04-08')

const activeCalendar = computed(() => getCalendarExample(calendarId.value))

const intervalItems: Record<CalendarExampleId, Record<string, string[]>> = {
  'islamic-civil': {
    '1445-09-29 09:00': ['Hijri planning'],
    '1445-09-30 10:00': ['Ramadan close'],
    '1445-10-01 11:00': ['Shawwal follow-up'],
  },
  saka: {
    '1946-01-20 09:00': ['Saka planning'],
    '1946-01-21 10:00': ['Team review'],
    '1946-01-22 11:00': ['Native date key'],
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
  gap: 16px;
}

.calendar-adapter-week__toolbar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.calendar-adapter-week__calendar {
  display: flex;
  width: 100%;
  max-width: 920px;
  height: 420px;
}

.calendar-adapter-week__header {
  display: grid;
  justify-items: center;
  gap: 2px;
  line-height: 1.15;
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
