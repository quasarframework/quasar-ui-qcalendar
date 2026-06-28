<template>
  <div class="subcontent calendar-adapter-resource">
    <p class="text-body2 text-center q-mb-md">
      Resource timelines stay interval-based. Convert the selected day and interval timestamps when
      labels or bookings need native calendar context.
    </p>

    <div class="calendar-adapter-resource__toolbar">
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

    <q-banner rounded class="calendar-adapter-resource__banner">
      <div class="calendar-adapter-resource__banner-content">
        <strong>{{ activeCalendar.label }}</strong>
        <span>{{ selectedNativeDate }}</span>
      </div>
    </q-banner>

    <div class="row justify-center">
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
          @click-date="onClickDate"
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

import NavigationBar from '@/components/NavigationBar.vue'
import {
  calendarToggleOptions,
  getCalendarExample,
  getNativeDateLabel,
  getNativeHeaderLabel,
  parseGregorianDate,
  toNativeTimestamp,
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
const selectedNativeDate = computed(() =>
  getNativeDateLabel(
    toNativeTimestamp(parseGregorianDate(selectedDate.value), activeCalendar.value),
    activeCalendar.value,
  ),
)

const bookingItems: Record<CalendarExampleId, Record<string, string[]>> = {
  'islamic-civil': {
    'planning:1445-09-29 09:00': ['Planning'],
    'design:1445-09-29 11:00': ['Design review'],
    'release:1445-09-29 14:00': ['Release prep'],
  },
  saka: {
    'planning:1946-01-20 09:00': ['Planning'],
    'design:1946-01-20 11:00': ['Design review'],
    'release:1946-01-20 14:00': ['Release prep'],
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

function onClickDate(data: { scope: { timestamp: Timestamp } }) {
  selectedDate.value = data.scope.timestamp.date
}
</script>

<style lang="scss" scoped>
.calendar-adapter-resource {
  display: grid;
  gap: 16px;
}

.calendar-adapter-resource__toolbar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.calendar-adapter-resource__banner {
  padding: 8px 12px;
}

.calendar-adapter-resource__banner-content {
  display: flex;
  flex-wrap: wrap;
  gap: 6px 12px;
  align-items: baseline;
}

.calendar-adapter-resource__calendar {
  display: flex;
  width: 100%;
  max-width: 820px;
  max-height: 430px;
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
  text-overflow: ellipsis;
}
</style>
