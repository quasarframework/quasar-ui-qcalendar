<template>
  <div class="subcontent timesheet-recipe">
    <div class="timesheet-toolbar">
      <div class="timesheet-toolbar__identity">
        <q-avatar size="36px" color="primary" text-color="white" icon="person" />
        <div>
          <div class="timesheet-toolbar__name">Team Member</div>
          <div class="timesheet-toolbar__period">{{ periodLabel }}</div>
        </div>
      </div>

      <div class="timesheet-toolbar__actions">
        <q-btn size="sm" color="primary" label="Submit Period" unelevated />
        <q-btn size="sm" outline color="primary" label="Log Time" />
      </div>
    </div>

    <div class="timesheet-controls">
      <navigation-bar @today="onToday" @prev="onPrev" @next="onNext" />
      <q-btn-dropdown size="sm" outline label="Show Work Items List">
        <q-list dense>
          <q-item v-for="item in tasks" :key="item.key">
            <q-item-section>{{ item.title }}</q-item-section>
          </q-item>
        </q-list>
      </q-btn-dropdown>
      <q-space />
      <q-chip square color="primary" text-color="white">
        Total Hours {{ formatHours(periodTotal) }} of {{ targetHours }}
      </q-chip>
    </div>

    <div class="row justify-center">
      <div style="display: flex; max-width: 100%; width: 100%; height: 560px">
        <q-calendar-task
          ref="calendar"
          v-model="selectedDate"
          v-model:model-tasks="parsedTasks"
          v-model:model-footer="footerRows"
          view="month"
          :task-width="430"
          :cell-width="42"
          :min-weekday-length="3"
          :weekday-class="weekdayClass"
          :day-class="dayClass"
          :footer-day-class="footerDayClass"
          no-active-date
          animated
          bordered
          @change="onChange"
          @moved="onMoved"
          @click-date="onClickDate"
          @click-day="onClickDay"
          @click-head-day="onClickHeadDay"
        >
          <template
            #head-tasks="{
              /* scope */
            }"
          >
            <div class="timesheet-work-header">
              <div class="timesheet-work-header__item">Work Item</div>
              <div class="timesheet-work-header__key">Key</div>
              <div class="timesheet-work-header__logged">Logged</div>
            </div>
          </template>

          <template #task="{ scope }">
            <div class="timesheet-work-row">
              <div class="timesheet-work-row__item q-calendar__ellipsis">
                <q-icon :name="scope.task.icon" :class="scope.task.iconClass" size="16px" />
                <span>{{ scope.task.title }}</span>
              </div>
              <div class="timesheet-work-row__key">{{ scope.task.key }}</div>
              <div class="timesheet-work-row__logged">
                {{ formatHours(taskTotal(scope.start, scope.end, scope.task)) }}
              </div>
            </div>
          </template>

          <template #day="{ scope }">
            <div class="timesheet-hour-cell">
              {{ formatHours(getLoggedHours(scope.timestamp.date, scope.task.logged)) }}
            </div>
          </template>

          <template #footer-task="{ scope }">
            <div class="timesheet-total-row">
              <div>{{ scope.footer.label }}</div>
              <div>{{ formatHours(footerTotal(scope.start, scope.end)) }}</div>
            </div>
          </template>

          <template #footer-day="{ scope }">
            <div class="timesheet-hour-cell timesheet-hour-cell--total">
              {{ formatHours(dayTotal(scope.timestamp.date)) }}
            </div>
          </template>
        </q-calendar-task>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { QCalendarTask } from '@quasar/quasar-ui-qcalendar'
import { isBetweenDates, padNumber, parsed, today } from '@timestamp-js/core'
import '@quasar/quasar-ui-qcalendar/index.css'

import { computed, onBeforeMount, ref, watch } from 'vue'
import NavigationBar from '@/components/NavigationBar.vue'

type CalendarTimestamp = NonNullable<ReturnType<typeof parsed>>

interface Logged {
  day: number
  date: string
  logged: number
}

interface TimesheetTask {
  title: string
  key: string
  icon: string
  iconClass: string
  logged: Logged[]
}

interface FooterRow {
  label: string
}

interface ClassData {
  scope: {
    timestamp: CalendarTimestamp
  }
}

interface CalendarMouseEvent {
  scope: {
    timestamp: CalendarTimestamp
  }
}

const targetHours = 160

const calendar = ref<QCalendarTask>()
const selectedDate = ref(today())
const startDate = ref(today())
const endDate = ref(today())
const footerRows = ref<FooterRow[]>([{ label: 'Total' }])
const tasks = ref<TimesheetTask[]>([
  {
    title: 'Vacation',
    key: 'ADM-01',
    icon: 'check_box',
    iconClass: 'timesheet-icon--admin',
    logged: [
      { day: 2, date: '', logged: 8 },
      { day: 3, date: '', logged: 8 },
      { day: 4, date: '', logged: 8 },
    ],
  },
  {
    title: 'Planning meetings',
    key: 'ADM-24',
    icon: 'check_box',
    iconClass: 'timesheet-icon--admin',
    logged: [
      { day: 3, date: '', logged: 0.5 },
      { day: 9, date: '', logged: 1.5 },
      { day: 10, date: '', logged: 1 },
      { day: 15, date: '', logged: 0.5 },
    ],
  },
  {
    title: 'Weekly team sync',
    key: 'ADM-25',
    icon: 'check_box',
    iconClass: 'timesheet-icon--admin',
    logged: [
      { day: 5, date: '', logged: 1.25 },
      { day: 11, date: '', logged: 1 },
      { day: 15, date: '', logged: 0.5 },
    ],
  },
  {
    title: 'Investigate import failure',
    key: 'OPS-2516',
    icon: 'bug_report',
    iconClass: 'timesheet-icon--bug',
    logged: [{ day: 10, date: '', logged: 0.25 }],
  },
  {
    title: 'Stabilize file upload flow',
    key: 'OPS-2517',
    icon: 'bug_report',
    iconClass: 'timesheet-icon--bug',
    logged: [
      { day: 1, date: '', logged: 2.75 },
      { day: 10, date: '', logged: 0.5 },
    ],
  },
  {
    title: 'Cloud time tracking tasks',
    key: 'OPS-2649',
    icon: 'check_box',
    iconClass: 'timesheet-icon--admin',
    logged: [{ day: 3, date: '', logged: 0.5 }],
  },
  {
    title: 'Workspace privacy settings',
    key: 'OPS-2840',
    icon: 'arrow_upward',
    iconClass: 'timesheet-icon--story',
    logged: [
      { day: 10, date: '', logged: 7 },
      { day: 12, date: '', logged: 5.5 },
    ],
  },
  {
    title: 'Safety timeout follow-up',
    key: 'OPS-2882',
    icon: 'bug_report',
    iconClass: 'timesheet-icon--bug',
    logged: [
      { day: 5, date: '', logged: 1.75 },
      { day: 10, date: '', logged: 0.5 },
    ],
  },
  {
    title: 'Export weekly reports',
    key: 'OPS-2948',
    icon: 'bug_report',
    iconClass: 'timesheet-icon--bug',
    logged: [{ day: 10, date: '', logged: 1.5 }],
  },
  {
    title: 'Streaming resilience work',
    key: 'OPS-2955',
    icon: 'arrow_upward',
    iconClass: 'timesheet-icon--story',
    logged: [{ day: 12, date: '', logged: 0.25 }],
  },
  {
    title: 'Offline job alerts',
    key: 'OPS-2961',
    icon: 'bug_report',
    iconClass: 'timesheet-icon--bug',
    logged: [
      { day: 1, date: '', logged: 2.5 },
      { day: 5, date: '', logged: 1.25 },
    ],
  },
  {
    title: 'Device discovery checks',
    key: 'OPS-2962',
    icon: 'bug_report',
    iconClass: 'timesheet-icon--bug',
    logged: [
      { day: 5, date: '', logged: 3.75 },
      { day: 8, date: '', logged: 11.25 },
      { day: 9, date: '', logged: 8.5 },
      { day: 10, date: '', logged: 3.75 },
      { day: 12, date: '', logged: 0.5 },
    ],
  },
  {
    title: 'Container packaging',
    key: 'OPS-2966',
    icon: 'arrow_upward',
    iconClass: 'timesheet-icon--story',
    logged: [{ day: 12, date: '', logged: 1.75 }],
  },
  {
    title: 'Upgrade app shell tooling',
    key: 'OPS-2967',
    icon: 'arrow_upward',
    iconClass: 'timesheet-icon--story',
    logged: [
      { day: 11, date: '', logged: 1 },
      { day: 15, date: '', logged: 7.75 },
    ],
  },
])

const parsedTasks = computed(() => {
  const start = parsed(startDate.value)
  const end = parsed(endDate.value)
  return tasks.value.filter((task) =>
    task.logged.some((log) => {
      const parsedDate = parsed(log.date)
      return parsedDate && start && end && isBetweenDates(parsedDate, start, end)
    }),
  )
})

const periodTotal = computed(() => {
  const start = parsed(startDate.value)
  const end = parsed(endDate.value)

  if (!start || !end) {
    return 0
  }

  return footerTotal(start, end)
})

const periodLabel = computed(() => {
  return `${formatDisplayDate(startDate.value)} - ${formatDisplayDate(endDate.value)}`
})

onBeforeMount(() => {
  moveLogsToSelectedMonth()
})

watch(selectedDate, () => {
  moveLogsToSelectedMonth()
})

function moveLogsToSelectedMonth() {
  const [year, month] = selectedDate.value.split('-')

  if (!year || !month) {
    return
  }

  tasks.value.forEach((task) => {
    task.logged.forEach((logged) => {
      logged.date = [year, month, padNumber(logged.day, 2)].join('-')
    })
  })
}

function getLoggedHours(date: string, logged: Logged[]): number {
  return logged.find((log) => log.date === date)?.logged || 0
}

function taskTotal(start: CalendarTimestamp, end: CalendarTimestamp, task: TimesheetTask): number {
  return task.logged.reduce((total, log) => {
    const loggedTimestamp = parsed(log.date)
    return loggedTimestamp && isBetweenDates(loggedTimestamp, start, end)
      ? total + log.logged
      : total
  }, 0)
}

function dayTotal(date: string): number {
  return tasks.value.reduce((total, task) => {
    return total + getLoggedHours(date, task.logged)
  }, 0)
}

function footerTotal(start: CalendarTimestamp, end: CalendarTimestamp): number {
  return tasks.value.reduce((total, task) => total + taskTotal(start, end, task), 0)
}

function formatHours(hours: number): string {
  if (hours === 0) {
    return ''
  }

  return Number.isInteger(hours)
    ? String(hours)
    : String(hours).replace(/0+$/, '').replace(/\.$/, '')
}

function formatDisplayDate(date: string): string {
  const [, month, day] = date.split('-')
  return `${day}/${month}`
}

function isSelectedDay(timestamp: CalendarTimestamp): boolean {
  return timestamp.date === selectedDate.value
}

function isWeekend(timestamp: CalendarTimestamp): boolean {
  return timestamp.weekday === 0 || timestamp.weekday === 6
}

function weekdayClass(data: ClassData) {
  return {
    'timesheet-weekend': isWeekend(data.scope.timestamp),
    'timesheet-selected-day': isSelectedDay(data.scope.timestamp),
  }
}

function dayClass(data: ClassData) {
  return {
    'timesheet-weekend': isWeekend(data.scope.timestamp),
    'timesheet-selected-day': isSelectedDay(data.scope.timestamp),
  }
}

function footerDayClass(data: ClassData) {
  return {
    'timesheet-weekend': isWeekend(data.scope.timestamp),
    'timesheet-selected-day': isSelectedDay(data.scope.timestamp),
  }
}

function onToday() {
  if (calendar.value) {
    calendar.value.moveToToday()
  }
}
function onPrev() {
  if (calendar.value) {
    calendar.value.prev()
  }
}
function onNext() {
  if (calendar.value) {
    calendar.value.next()
  }
}
function onMoved(data: CalendarTimestamp) {
  selectedDate.value = data.date
  console.info('onMoved', data)
}
function onChange(data: { start: string; end: string; days: CalendarTimestamp[] }) {
  startDate.value = data.start
  endDate.value = data.end
  console.info('onChange', data)
}
function onClickDate(data: CalendarMouseEvent) {
  console.info('onClickDate', data)
}
function onClickDay(data: CalendarMouseEvent) {
  console.info('onClickDay', data)
}
function onClickHeadDay(data: CalendarMouseEvent) {
  selectedDate.value = data.scope.timestamp.date
  console.info('onClickHeadDay', data)
}
</script>

<style lang="scss" scoped>
.timesheet-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  padding: 12px;
  border: 1px solid #d8dee9;
  border-radius: 4px 4px 0 0;
  background: #ffffff;
}

.timesheet-toolbar__identity,
.timesheet-toolbar__actions,
.timesheet-controls {
  display: flex;
  align-items: center;
  gap: 12px;
}

.timesheet-toolbar__name {
  font-size: 18px;
  font-weight: 600;
  color: #0f2b46;
}

.timesheet-toolbar__period {
  font-size: 12px;
  color: #5c6f82;
}

.timesheet-controls {
  flex-wrap: wrap;
  padding: 8px 12px;
  border-right: 1px solid #d8dee9;
  border-left: 1px solid #d8dee9;
  background: #f7f9fc;
}

.timesheet-work-header,
.timesheet-work-row {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 90px 70px;
  align-items: center;
  width: 100%;
  height: 100%;
  font-size: 12px;
}

.timesheet-work-header {
  font-weight: 700;
  color: #172b4d;
  background: #f4f5f7;
}

.timesheet-work-header__item,
.timesheet-work-row__item {
  padding: 0 12px;
}

.timesheet-work-row__item {
  display: flex;
  align-items: center;
  gap: 6px;
}

.timesheet-work-header__key,
.timesheet-work-header__logged,
.timesheet-work-row__key,
.timesheet-work-row__logged {
  padding: 0 8px;
  text-align: right;
}

.timesheet-work-row__key {
  color: #0065bd;
}

.timesheet-hour-cell {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  font-size: 12px;
}

.timesheet-hour-cell--total {
  font-weight: 700;
}

.timesheet-total-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 100%;
  padding: 0 12px;
  font-size: 12px;
  font-weight: 700;
  background: #f4f5f7;
}

.timesheet-icon--admin {
  color: #0c66e4;
}

.timesheet-icon--bug {
  color: #de350b;
}

.timesheet-icon--story {
  color: #00875a;
}
</style>

<style lang="scss">
.timesheet-recipe {
  .q-calendar-task__head--weekday,
  .q-calendar-task__head--day,
  .q-calendar-task__day,
  .q-calendar-task__footer--day {
    font-size: 12px;
  }

  .timesheet-weekend {
    background: #eef1f8;
  }

  .timesheet-selected-day {
    box-shadow: inset 0 0 0 1px #0c66e4;
  }
}

body.body--dark {
  .timesheet-recipe {
    .timesheet-toolbar,
    .timesheet-controls,
    .timesheet-total-row,
    .timesheet-work-header {
      color: #dce6f1;
      border-color: #3d4c5f;
      background: #152233;
    }

    .timesheet-weekend {
      background: #1e293b;
    }
  }
}
</style>
