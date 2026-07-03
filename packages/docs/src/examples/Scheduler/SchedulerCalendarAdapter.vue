<template>
  <div class="subcontent calendar-adapter-scheduler">
    <p class="text-body2 text-center q-mb-md">
      Scheduler views combine resource rows with adapter-aware labels, letting teams schedule
      resources against native calendar dates.
    </p>

    <div class="calendar-adapter-scheduler__toolbar">
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
      <div class="calendar-adapter-scheduler__calendar">
        <q-calendar-scheduler
          ref="calendar"
          v-model="selectedDate"
          v-model:model-resources="resources"
          view="week"
          resource-key="id"
          resource-label="name"
          animated
          bordered
          :style="calendarStyle"
          :calendar-system="activeCalendar.calendar"
          :locale="activeCalendar.locale"
          :weekdays="activeCalendar.weekdays"
          :dir="activeCalendar.direction"
          :resource-height="78"
        >
          <template #head-resources>
            <span class="calendar-adapter-scheduler__resource-heading" dir="ltr"> Resources </span>
          </template>

          <template #resource-label="{ scope }">
            <span class="calendar-adapter-scheduler__resource-label" dir="ltr">
              {{ scope.label }}
            </span>
          </template>

          <template #head-day-event="{ scope }">
            <div class="calendar-adapter-scheduler__header">
              <strong>{{ getNativeHeaderLabel(scope.calendarTimestamp, activeCalendar) }}</strong>
              <span
                >Gregorian {{ scope.calendarIdentity.gregorian.month }}/{{
                  scope.calendarIdentity.gregorian.day
                }}</span
              >
            </div>
          </template>

          <template #day="{ scope }">
            <div
              v-for="item in getResourceItems(scope.calendarTimestamp, scope.resource.id)"
              :key="item"
              class="calendar-adapter-scheduler__item"
              dir="ltr"
            >
              {{ item }}
            </div>
          </template>
        </q-calendar-scheduler>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { QCalendarScheduler } from '@quasar/quasar-ui-qcalendar'
import { type Timestamp } from '@timestamp-js/core'
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

interface Resource {
  id: string
  name: string
}

const calendar = ref<QCalendarScheduler>()
const calendarId = ref<CalendarExampleId>('islamic-civil')
const selectedDates = ref<Record<CalendarExampleId, string>>({ ...calendarExampleDates })
const selectedDate = computed({
  get: () => selectedDates.value[calendarId.value],
  set: (value: string) => {
    selectedDates.value[calendarId.value] = value
  },
})
const resources = ref<Resource[]>([
  { id: 'planning', name: 'Planning' },
  { id: 'content', name: 'Content' },
  { id: 'release', name: 'Release' },
])

const activeCalendar = computed(() => getCalendarExample(calendarId.value))
const selectedTimestamp = computed(() => parseNativeDate(selectedDate.value, activeCalendar.value))
const nativeMonthTitle = computed(() =>
  getNativeMonthTitleLabel(selectedTimestamp.value, activeCalendar.value),
)
const nativeMonthRange = computed(() =>
  getNativeMonthRangeLabel(selectedTimestamp.value, activeCalendar.value),
)
const calendarStyle = computed(() => ({
  '--calendar-resources-width': '140px',
}))

watch(calendarId, (nextId, previousId) => {
  selectedDates.value[nextId] = getEquivalentNativeDate(
    selectedDates.value[previousId],
    getCalendarExample(previousId),
    getCalendarExample(nextId),
  )
})

const schedulerItems: Record<CalendarExampleId, Record<string, string[]>> = {
  'islamic-civil': {
    '1445-09-29': ['Planning date'],
    '1445-09-30': ['Month close'],
    '1445-10-01': ['Follow-up'],
  },
  saka: {
    '1946-01-19': ['Planning date'],
    '1946-01-20': ['Follow-up'],
    '1946-01-21': ['Native date key'],
  },
  hebrew: {
    '5785-01-14': ['Planning date'],
    '5785-01-15': ['Follow-up'],
    '5785-01-17': ['Native date key'],
  },
  persian: {
    '1403-01-14': ['Planning date'],
    '1403-01-15': ['Follow-up'],
    '1403-01-17': ['Native date key'],
  },
}

function getResourceItems(timestamp: Timestamp, resourceId: string): string[] {
  if (resourceId === 'content') {
    return []
  }

  return schedulerItems[calendarId.value][timestamp.date] ?? []
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
.calendar-adapter-scheduler {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: 16px;
  width: 100%;
  min-width: 0;
  max-width: 100%;
  overflow: hidden;
}

.calendar-adapter-scheduler > * {
  min-width: 0;
  max-width: 100%;
}

.calendar-adapter-scheduler__toolbar {
  display: grid;
  justify-items: center;
  gap: 12px;
  width: 100%;
}

.calendar-adapter-scheduler__calendar {
  display: flex;
  width: 100%;
  max-width: 920px;
  min-width: 0;
  overflow-x: auto;
  overflow-y: hidden;
}

.calendar-adapter-scheduler__header {
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

.calendar-adapter-scheduler__header span {
  font-size: 0.7rem;
  opacity: 0.7;
}

.calendar-adapter-scheduler__item {
  margin: 6px;
  padding: 4px 8px;
  border-radius: 4px;
  background: color-mix(in srgb, var(--q-primary), transparent 82%);
  color: var(--q-primary);
  font-size: 0.72rem;
  line-height: 1.25;
  text-align: center;
  unicode-bidi: isolate;
  overflow-wrap: anywhere;
}

.calendar-adapter-scheduler__resource-heading,
.calendar-adapter-scheduler__resource-label {
  display: block;
  width: 100%;
  text-align: left;
  unicode-bidi: isolate;
}

.calendar-adapter-scheduler__calendar :deep(.q-calendar-scheduler__resource--text) {
  width: 100%;
  direction: ltr;
}

.calendar-adapter-scheduler__calendar :deep(.q-calendar-scheduler) {
  min-width: 900px;
}
</style>
