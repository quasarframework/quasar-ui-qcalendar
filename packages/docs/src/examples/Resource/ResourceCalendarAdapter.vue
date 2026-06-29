<template>
  <div class="subcontent calendar-adapter-resource">
    <p class="text-body2 text-center q-mb-md">
      Resource timelines stay interval-based. Convert the selected day and interval timestamps when
      labels or bookings need native calendar context.
    </p>

    <div class="calendar-adapter-resource__toolbar">
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
      <div class="calendar-adapter-resource__calendar">
        <q-calendar-resource
          ref="calendar"
          v-model="selectedDate"
          v-model:model-resources="resources"
          resource-key="id"
          resource-label="name"
          animated
          bordered
          :cell-width="90"
          :interval-start="8"
          :interval-count="8"
          :interval-header-height="34"
          :interval-height="54"
          :calendar-system="activeCalendar.calendar"
          :locale="activeCalendar.locale"
          :weekdays="activeCalendar.weekdays"
          :dir="activeCalendar.direction"
        >
          <template #head-resources>
            <div class="calendar-adapter-resource__head">
              <strong>Resources</strong>
            </div>
          </template>

          <template #interval-label="{ scope }">
            <span class="calendar-adapter-resource__interval">
              {{ scope.label }}
              <small>{{ getNativeHeaderLabel(scope.calendarTimestamp, activeCalendar) }}</small>
            </span>
          </template>

          <template #resource-interval="{ scope }">
            <q-badge
              v-for="item in getBookingItems(
                scope.timestamp,
                scope.calendarTimestamp,
                scope.resource.id,
              )"
              :key="`${scope.resource.id}-${item}`"
              class="calendar-adapter-resource__booking"
              color="primary"
              text-color="white"
              :label="item"
            />
          </template>
        </q-calendar-resource>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { QCalendarResource } from '@quasar/quasar-ui-qcalendar'
import { type Timestamp } from '@timestamp-js/core'
import '@quasar/quasar-ui-qcalendar/index.css'

import CalendarAdapterSelector from '@/components/CalendarAdapterSelector.vue'
import CalendarAdapterTitle from '@/components/CalendarAdapterTitle.vue'
import NavigationBar from '@/components/NavigationBar.vue'
import {
  calendarExamples,
  getCalendarExample,
  getNativeHeaderLabel,
  getNativeMonthRangeLabel,
  getNativeMonthTitleLabel,
  parseGregorianDate,
  type CalendarExampleId,
} from '@/utils/calendarAdapterExamples'

interface Resource {
  id: string
  name: string
}

const calendar = ref<QCalendarResource>()
const calendarId = ref<CalendarExampleId>('islamic-civil')
const selectedDate = ref('2024-04-08')
const resources = ref<Resource[]>([
  { id: 'planning', name: 'Planning' },
  { id: 'design', name: 'Design' },
  { id: 'release', name: 'Release' },
])

const activeCalendar = computed(() => getCalendarExample(calendarId.value))
const selectedTimestamp = computed(() => parseGregorianDate(selectedDate.value))
const nativeMonthTitle = computed(() =>
  getNativeMonthTitleLabel(selectedTimestamp.value, activeCalendar.value),
)
const nativeMonthRange = computed(() =>
  getNativeMonthRangeLabel(selectedTimestamp.value, activeCalendar.value),
)

const bookingItems: Record<CalendarExampleId, Record<string, string[]>> = {
  'islamic-civil': {
    'planning:1445-09-29 09:00': ['Planning'],
    'design:1445-09-29 11:00': ['Design'],
    'release:1445-09-29 14:00': ['Release'],
  },
  saka: {
    'planning:1946-01-19 09:00': ['Planning'],
    'design:1946-01-19 11:00': ['Design'],
    'release:1946-01-19 14:00': ['Release'],
  },
}

function getBookingItems(
  timestamp: Timestamp,
  calendarTimestamp: Timestamp,
  resourceId: string,
): string[] {
  const key = `${resourceId}:${calendarTimestamp.date} ${timestamp.time}`

  return bookingItems[calendarId.value][key] ?? []
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
.calendar-adapter-resource {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: 16px;
  width: 100%;
  min-width: 0;
  max-width: 100%;
  overflow: hidden;
}

.calendar-adapter-resource > * {
  min-width: 0;
  max-width: 100%;
}

.calendar-adapter-resource__toolbar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  width: 100%;
}

.calendar-adapter-resource__calendar {
  display: flex;
  width: 100%;
  max-width: 820px;
  min-width: 0;
  max-height: 430px;
  overflow-x: auto;
  overflow-y: hidden;
}

.calendar-adapter-resource__head {
  display: grid;
  place-items: center;
  gap: 2px;
  padding: 8px;
}

.calendar-adapter-resource__head span,
.calendar-adapter-resource__head small {
  opacity: 0.72;
}

.calendar-adapter-resource__interval {
  display: inline-grid;
  justify-items: center;
  line-height: 1.15;
}

.calendar-adapter-resource__interval small {
  margin-top: 2px;
  font-size: 0.62rem;
  opacity: 0.72;
}

.calendar-adapter-resource__booking {
  margin: 2px 4px;
  max-width: calc(100% - 8px);
  overflow: hidden;
  min-width: 0;
  text-overflow: ellipsis;
}

.calendar-adapter-resource__calendar :deep(.q-calendar-resource) {
  min-width: 820px;
}
</style>
