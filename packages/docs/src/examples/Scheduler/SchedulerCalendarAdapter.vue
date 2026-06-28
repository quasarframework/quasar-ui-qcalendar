<template>
  <div class="subcontent calendar-adapter-scheduler">
    <p class="text-body2 text-center q-mb-md">
      Scheduler views combine resource rows with adapter-aware labels, letting teams schedule
      Gregorian resources against native calendar dates.
    </p>

    <div class="calendar-adapter-scheduler__toolbar">
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
        >
          <template #head-day-event="{ scope }">
            <div class="calendar-adapter-scheduler__header">
              <strong>{{ getNativeHeaderLabel(scope.calendarTimestamp, activeCalendar) }}</strong>
              <span>{{ scope.timestamp.month }}/{{ scope.timestamp.day }}</span>
            </div>
          </template>

          <template #day="{ scope }">
            <div
              v-for="item in getResourceItems(scope.calendarTimestamp, scope.resource.id)"
              :key="item"
              class="calendar-adapter-scheduler__item"
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
import { computed, ref } from 'vue'
import { QCalendarScheduler } from '@quasar/quasar-ui-qcalendar'
import { type Timestamp } from '@timestamp-js/core'
import '@quasar/quasar-ui-qcalendar/index.css'

import NavigationBar from '@/components/NavigationBar.vue'
import {
  calendarToggleOptions,
  getCalendarExample,
  getNativeHeaderLabel,
  getNativeItems,
  type CalendarExampleId,
} from '@/utils/calendarAdapterExamples'

interface Resource {
  id: string
  name: string
}

const calendar = ref<QCalendarScheduler>()
const calendarId = ref<CalendarExampleId>('islamic-civil')
const selectedDate = ref('2024-04-08')
const resources = ref<Resource[]>([
  { id: 'planning', name: 'Planning' },
  { id: 'content', name: 'Content' },
  { id: 'release', name: 'Release' },
])

const activeCalendar = computed(() => getCalendarExample(calendarId.value))
const calendarStyle = computed(() => ({
  '--calendar-resources-width': '140px',
}))

function getResourceItems(timestamp: Timestamp, resourceId: string): string[] {
  if (resourceId === 'content') {
    return []
  }

  return getNativeItems(timestamp, activeCalendar.value)
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
  gap: 16px;
}

.calendar-adapter-scheduler__toolbar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.calendar-adapter-scheduler__calendar {
  display: flex;
  width: 100%;
  max-width: 920px;
  height: 420px;
}

.calendar-adapter-scheduler__header {
  display: grid;
  justify-items: center;
  gap: 2px;
  line-height: 1.15;
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
}
</style>
