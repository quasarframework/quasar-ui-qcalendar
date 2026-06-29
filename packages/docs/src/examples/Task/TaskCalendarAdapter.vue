<template>
  <div class="subcontent calendar-adapter-task">
    <p class="text-body2 text-center q-mb-md">
      Task views can keep their task rows stable while native date labels and native-keyed work
      notes are rendered in each day cell.
    </p>

    <div class="calendar-adapter-task__toolbar">
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
      <div class="calendar-adapter-task__calendar">
        <q-calendar-task
          ref="calendar"
          v-model="selectedDate"
          v-model:model-tasks="tasks"
          view="week"
          animated
          bordered
          no-active-date
          :task-width="220"
          :cell-width="96"
          :min-weekday-label="2"
          :calendar-system="activeCalendar.calendar"
          :locale="activeCalendar.locale"
          :weekdays="activeCalendar.weekdays"
          :dir="activeCalendar.direction"
        >
          <template #head-tasks>
            <div class="calendar-adapter-task__task-header">Work stream</div>
          </template>

          <template #task="{ scope }">
            <div class="calendar-adapter-task__task">
              <q-icon :name="scope.task.icon" size="16px" color="primary" />
              <span>{{ scope.task.title }}</span>
            </div>
          </template>

          <template #day="{ scope }">
            <div
              v-for="item in getTaskItems(scope.calendarTimestamp, scope.task.id)"
              :key="item"
              class="calendar-adapter-task__item"
            >
              {{ item }}
            </div>
          </template>
        </q-calendar-task>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { QCalendarTask } from '@quasar/quasar-ui-qcalendar'
import { type Timestamp } from '@timestamp-js/core'
import '@quasar/quasar-ui-qcalendar/index.css'

import CalendarAdapterSelector from '@/components/CalendarAdapterSelector.vue'
import CalendarAdapterTitle from '@/components/CalendarAdapterTitle.vue'
import NavigationBar from '@/components/NavigationBar.vue'
import {
  calendarExamples,
  getCalendarExample,
  getNativeTaskItems,
  getNativeMonthRangeLabel,
  getNativeMonthTitleLabel,
  parseGregorianDate,
  type CalendarExampleId,
} from '@/utils/calendarAdapterExamples'

interface Task {
  id: string
  title: string
  icon: string
}

const calendar = ref<QCalendarTask>()
const calendarId = ref<CalendarExampleId>('islamic-civil')
const selectedDate = ref('2024-04-08')
const tasks = ref<Task[]>([
  { id: 'planning', title: 'Planning', icon: 'event_note' },
  { id: 'review', title: 'Review', icon: 'rate_review' },
  { id: 'release', title: 'Release', icon: 'rocket_launch' },
])

const activeCalendar = computed(() => getCalendarExample(calendarId.value))
const selectedTimestamp = computed(() => parseGregorianDate(selectedDate.value))
const nativeMonthTitle = computed(() =>
  getNativeMonthTitleLabel(selectedTimestamp.value, activeCalendar.value),
)
const nativeMonthRange = computed(() =>
  getNativeMonthRangeLabel(selectedTimestamp.value, activeCalendar.value),
)

function getTaskItems(timestamp: Timestamp, taskId: string): string[] {
  if (taskId === 'review') {
    return []
  }

  return getNativeTaskItems(timestamp, activeCalendar.value)
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
.calendar-adapter-task {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: 16px;
  width: 100%;
  min-width: 0;
  max-width: 100%;
  overflow: hidden;
}

.calendar-adapter-task > * {
  min-width: 0;
  max-width: 100%;
}

.calendar-adapter-task__toolbar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  width: 100%;
}

.calendar-adapter-task__calendar {
  display: flex;
  width: 100%;
  max-width: 920px;
  min-width: 0;
  overflow-x: auto;
  overflow-y: hidden;
}

.calendar-adapter-task__task-header,
.calendar-adapter-task__task {
  display: flex;
  align-items: center;
  gap: 8px;
  height: 100%;
  padding: 0 8px;
  font-weight: 600;
}

.calendar-adapter-task__item {
  margin: 4px;
  padding: 3px 6px;
  border-radius: 4px;
  background: color-mix(in srgb, var(--q-primary), transparent 82%);
  color: var(--q-primary);
  font-size: 0.68rem;
}

.calendar-adapter-task__calendar :deep(.q-calendar-task) {
  min-width: 900px;
}
</style>
