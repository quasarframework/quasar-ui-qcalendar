<template>
  <div class="subcontent">
    <navigation-bar @today="onToday" @prev="onPrev" @next="onNext" />

    <div class="q-ma-sm row justify-center q-gutter-sm">
      <q-checkbox v-model="hoverable" label="Hoverable" />

      <q-checkbox v-model="focusable" label="Focusable" />

      <q-select
        v-model="focusType"
        label="Focus Type"
        outlined
        dense
        multiple
        map-options
        emit-value
        options-dense
        :options="options"
        style="min-width: 180px"
      />
    </div>

    <div class="row justify-center">
      <div style="display: flex; max-width: 800px; width: 100%">
        <q-calendar-task
          ref="calendar"
          v-model="selectedDate"
          v-model:model-tasks="parsedTasks"
          v-model:model-footer="footerTasks"
          view="month"
          :task-width="240"
          :min-weekday-length="2"
          :weekday-class="weekdayClass"
          :day-class="dayClass"
          :footer-day-class="footerDayClass"
          :hoverable="hoverable"
          :focusable="focusable"
          :focus-type="focusType"
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
            <div class="header ellipsis" style="font-weight: 600">
              <div class="issue ellipsis">Issue</div>
              <div class="key">Key</div>
              <div class="logged">Logged</div>
            </div>
          </template>

          <!-- Slot for top-level tasks -->
          <template #task="{ scope }">
            <div class="header ellipsis">
              <div class="issue ellipsis">
                <span v-if="scope.task.icon === 'done'" class="done"><Done /></span>
                <span v-else-if="scope.task.icon === 'pending'" class="pending"><Pending /></span>
                <span v-else-if="scope.task.icon === 'blocking'" class="blocking"
                  ><Blocking
                /></span>
                {{ scope.task.title }}
              </div>
              <div class="key">{{ scope.task.key }}</div>
              <div class="logged">{{ sum(scope.start, scope.end, scope.task) }}</div>
            </div>
          </template>

          <!-- Slot for subtasks (child tasks) -->
          <template #subtask="{ scope }">
            <div class="header ellipsis">
              <div class="issue ellipsis">
                <span v-if="scope.task.icon === 'done'" class="done"><Done /></span>
                <span v-else-if="scope.task.icon === 'pending'" class="pending"><Pending /></span>
                <span v-else-if="scope.task.icon === 'blocking'" class="blocking"
                  ><Blocking
                /></span>
                {{ scope.task.title }}
              </div>
              <div class="key">{{ scope.task.key }}</div>
              <div class="logged">{{ sum(scope.start, scope.end, scope.task) }}</div>
            </div>
          </template>

          <template #day="{ scope }">
            <template
              v-for="time in getLogged(scope.timestamp.date, scope.task.logged)"
              :key="time"
            >
              <div class="logged-time">{{ time.logged }}</div>
            </template>
          </template>

          <template #footer-task="{ scope }">
            <div class="summary ellipsis">
              <div class="title ellipsis">{{ scope.footer.title }}</div>
              <div class="total">{{ totals(scope.start, scope.end) }}</div>
            </div>
          </template>

          <template #footer-day="{ scope }">
            <div class="logged-time">{{ getLoggedSummary(scope.timestamp.date) }}</div>
          </template>
        </q-calendar-task>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  QCalendarTask,
  today,
  isBetweenDates,
  parsed,
  padNumber,
  Timestamp,
} from '@quasar/quasar-ui-qcalendar'
import '@quasar/quasar-ui-qcalendar/index.css'

import { ref, computed, onBeforeMount } from 'vue'
import NavigationBar from 'components/NavigationBar.vue'

import Done from '@carbon/icons-vue/es/checkmark--outline/16'
import Pending from '@carbon/icons-vue/es/pending/16'
import Blocking from '@carbon/icons-vue/es/undefined/16'

interface Logged {
  date: string
  logged: number
}
interface Task {
  key: string
  title: string
  icon?: string
  expanded?: boolean
  children?: Task[]
  logged: Logged[]
}
interface FooterTask {
  title: string
}

const calendar = ref<QCalendarTask>(),
  selectedDate = ref(today()),
  startDate = ref(today()),
  endDate = ref(today()),
  tasks = ref<Task[]>([
    {
      title: 'Task 1',
      key: 'TSK-584',
      logged: [
        { date: '2021-03-02', logged: 0.5 },
        { date: '2021-03-05', logged: 2.0 },
      ],
    },
    {
      title: 'Task 2',
      key: 'TSK-592',
      logged: [
        { date: '2021-03-06', logged: 3.5 },
        { date: '2021-03-08', logged: 4.0 },
      ],
    },
    {
      title: 'Task 3',
      key: 'TSK-593',
      logged: [
        { date: '2021-03-10', logged: 9 },
        { date: '2021-03-11', logged: 4.8 },
      ],
      expanded: false,
      children: [
        {
          title: 'Subtask 3.1',
          key: 'TSK-593.1',
          logged: [
            { date: '2021-03-10', logged: 4.5 },
            { date: '2021-03-11', logged: 2.4 },
          ],
        },
        {
          title: 'Subtask 3.2',
          key: 'TSK-593.2',
          logged: [
            { date: '2021-03-10', logged: 4.5 },
            { date: '2021-03-11', logged: 2.4 },
          ],
        },
      ],
    },
    {
      title: 'Task 4',
      key: 'TSK-594',
      logged: [
        { date: '2021-03-14', logged: 6.5 },
        { date: '2021-03-15', logged: 2.0 },
      ],
    },
    {
      title: 'Task 5',
      key: 'TSK-595',
      logged: [
        { date: '2021-03-12', logged: 1.5 },
        { date: '2021-03-18', logged: 2.0 },
      ],
    },
    {
      title: 'Task 6',
      key: 'TSK-596',
      logged: [
        { date: '2021-03-13', logged: 1.5 },
        { date: '2021-03-23', logged: 3.5 },
      ],
    },
    {
      title: 'Task 7',
      key: 'TSK-597',
      logged: [
        { date: '2021-03-19', logged: 0.75 },
        { date: '2021-03-26', logged: 2.25 },
      ],
    },
    {
      title: 'Task 8',
      key: 'TSK-598',
      logged: [
        { date: '2021-03-21', logged: 1.5 },
        { date: '2021-03-22', logged: 4.0 },
      ],
    },
    {
      title: 'Task 9',
      key: 'TSK-599',
      logged: [
        { date: '2021-03-26', logged: 6.5 },
        { date: '2021-03-27', logged: 3.5 },
      ],
    },
    {
      title: 'Task 10',
      key: 'TSK-600',
      logged: [
        { date: '2021-03-12', logged: 0.5 },
        { date: '2021-03-14', logged: 2.0 },
        { date: '2021-03-28', logged: 4.5 },
        { date: '2021-03-30', logged: 1.0 },
      ],
    },
  ]),
  footerTasks = ref<FooterTask[]>([{ title: 'TOTALS' }]),
  hoverable = ref(true),
  focusable = ref(true),
  focusType = ref([]),
  options = ref(['weekday', 'date', 'task'])

/**
 * Returns tasks between startDate and endDate (captured via onChange event)
 */
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

onBeforeMount(() => {
  // adjust all the dates for the current month
  const date = new Date()
  const year = date.getFullYear()
  const month = padNumber(date.getMonth() + 1, 2)
  tasks.value.forEach((task) => {
    task.logged.forEach((logged) => {
      // get last 2 digits from current date (day)
      const day = logged.date.slice(-2)
      logged.date = [year, padNumber(Number(month), 2), padNumber(Number(day), 2)].join('-')
    })
  })
})

function getLogged(date: string, logged: Logged[]) {
  const log = logged.find((log) => log.date === date)
  return log ? [{ logged: log.logged }] : []
}

function getLoggedSummary(date: string): number {
  return tasks.value.reduce((total, task) => {
    return (
      total +
      task.logged.reduce((accumulator, log) => {
        return date === log.date ? accumulator + log.logged : accumulator
      }, 0)
    )
  }, 0)
}

/**
 * Sums up the amount of time spent on a task
 * This only sums it up if the logged date falls
 * between the start and end times
 */
function sum(start: Timestamp, end: Timestamp, task: Task) {
  return task.logged.reduce((accumulator, currentValue) => {
    const loggedTimestamp = parsed(currentValue.date)
    return loggedTimestamp && isBetweenDates(loggedTimestamp, start, end)
      ? accumulator + currentValue.logged
      : accumulator
  }, 0)
}

function weekdayClass(/*data*/) {
  return {
    'task__weekday--style': true,
  }
}

function dayClass(/*data*/) {
  return {
    'task__day--style': true,
  }
}

function footerDayClass(/*data*/) {
  return {
    'task__footer--day__style': true,
  }
}

/**
 * Sums up the amount of time spent for all tasks
 * between the start and end dates
 */
function totals(start: Timestamp, end: Timestamp) {
  const reducer = (accumulator: number, currentValue: { date: string; logged: number }) => {
    const loggedTimestamp = parsed(currentValue.date)
    return loggedTimestamp !== null && isBetweenDates(loggedTimestamp, start, end)
      ? accumulator + currentValue.logged
      : accumulator
  }

  return tasks.value.reduce((total, task) => total + task.logged.reduce(reducer, 0), 0)
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
function onMoved(data: Timestamp) {
  console.info('onMoved', data)
}
function onChange(data: { start: string; end: string; days: Timestamp[] }) {
  console.info('onChange', data)
  startDate.value = data.start
  endDate.value = data.end
}
function onClickDate(data: Timestamp) {
  console.info('onClickDate', data)
}
function onClickDay(data: Timestamp) {
  console.info('onClickDay', data)
}
function onClickHeadDay(data: Timestamp) {
  console.info('onClickHeadDay', data)
}
</script>

<style lang="scss" scoped>
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 2px;
  font-size: 0.9em;

  .issue {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    width: 80%;
  }

  .key {
    display: flex;
    justify-content: center;
    width: 80px;
  }

  .logged {
    display: flex;
    justify-content: flex-end;
    width: 80px;
  }
}

.summary {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 2px;
  font-size: 0.9em;
  font-weight: 700;
  width: 100%;

  .title {
    display: flex;
    justify-content: flex-start;
  }

  .total {
    display: flex;
    justify-content: flex-end;
  }
}

.done {
  color: blue;
}

.pending {
  color: green;
}

.blocking {
  color: red;
}

.logged-time {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0;
  margin: 0;
  height: 100%;
}
</style>

<style lang="scss">
.task__weekday--style {
  font-size: 0.8em;
  font-weight: 600;
}

.task__day--style {
  font-size: 0.8em;
}

.task__footer--day__style {
  font-size: 0.8em;
  font-weight: 600;
}
</style>
