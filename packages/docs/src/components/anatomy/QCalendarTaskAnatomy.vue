<template>
  <div
    class="row full-width q-pa-xs rounded-borders relative-position anatomy"
    style="border: 2px solid rgba(25, 118, 210, 0.65)"
  >
    <q-scroll-area
      class="col"
      style="max-width: 180px; width: 100%; max-height: 300px; height: 300px"
    >
      <q-list dense>
        <q-item
          v-for="type in types"
          :key="type.name"
          clickable
          v-ripple
          :active="selected.name === type.name"
          @click="updateSelection(type)"
        >
          <q-item-section>
            {{ type.name }}
          </q-item-section>
        </q-item>
      </q-list>
    </q-scroll-area>

    <div class="col">
      <q-calendar-task
        id="calendar-task"
        ref="calendar"
        v-model:model-tasks="parsedTasks"
        v-model:model-title="titleTasks"
        v-model:model-footer="footerTasks"
        view="month"
        :task-width="240"
        :weekday-class="weekdayClass"
        :day-class="dayClass"
        :footer-day-class="footerDayClass"
        bordered
        style="height: 300px"
        @change="onChange"
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
            <div class="issue ellipsis">{{ scope.task.title }}</div>
            <div class="key">{{ scope.task.key }}</div>
            <div class="logged">{{ sum(scope.start, scope.end, scope.task) }}</div>
          </div>
        </template>

        <!-- Slot for subtasks (child tasks) -->
        <template #subtask="{ scope }">
          <div class="header ellipsis">
            <div class="issue ellipsis">{{ scope.task.title }}</div>
            <div class="key">{{ scope.task.key }}</div>
            <div class="logged">{{ sum(scope.start, scope.end, scope.task) }}</div>
          </div>
        </template>

        <template #day="{ scope }">
          <template v-for="time in getLogged(scope.timestamp.date, scope.task.logged)" :key="time">
            <div class="logged-time">{{ time.logged }}</div>
          </template>
        </template>

        <template #title-task="{ scope }">
          <div class="summary ellipsis">
            <div class="title ellipsis">{{ scope.title.label }}</div>
          </div>
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
</template>

<script setup lang="ts">
import { ref, reactive, watch, onMounted, onBeforeMount, computed } from 'vue'
import {
  today,
  isBetweenDates,
  parsed,
  padNumber,
  QCalendarTask,
  type Timestamp,
} from '@quasar/quasar-ui-qcalendar'
import '@quasar/quasar-ui-qcalendar/index.css'

interface Type {
  name: string
  class: string
}

interface Task {
  icon: string
  title: string
  key: string
  logged: { date: string; logged: number }[]
}

interface TitleTask {
  label: string
}

interface FooterTask {
  title: string
}

const calendar = ref<HTMLElement | null>(null)
const types = reactive<Type[]>([
  { name: 'Head', class: 'q-calendar-task__head' },
  { name: 'Head Weekdays', class: 'q-calendar-task__head--days' },
  { name: 'Head Day', class: 'q-calendar-task__head--day' },
  { name: 'Head Weekday', class: 'q-calendar-task__head--weekday' },
  { name: 'Head Date', class: 'q-calendar-task__head--date' },
  { name: 'Head Day Button', class: 'q-calendar-task__head--day__label' },
  { name: 'Body', class: 'q-calendar-task__body' },
  { name: 'Container', class: 'q-calendar-task__container' },
  { name: 'Task Container', class: 'q-calendar-task__task--container' },
  { name: 'Head Tasks', class: 'q-calendar-task__head--tasks' },
  { name: 'Title', class: 'q-calendar-task__title' },
  { name: 'Title Task', class: 'q-calendar-task__title--task' },
  { name: 'Title Days', class: 'q-calendar-task__title--days' },
  { name: 'Title Day', class: 'q-calendar-task__title--day' },
  { name: 'Task', class: 'q-calendar-task__task' },
  { name: 'Task Item', class: 'q-calendar-task__task--item' },
  { name: 'Task Days', class: 'q-calendar-task__task--days-row' },
  { name: 'Task Day', class: 'q-calendar-task__task--day' },
  { name: 'Footer', class: 'q-calendar-task__footer' },
  { name: 'Footer Task', class: 'q-calendar-task__footer--task' },
  { name: 'Footer Task Days', class: 'q-calendar-task__footer--day-wrapper' },
  { name: 'Footer Task Day', class: 'q-calendar-task__footer--day' },
])
const selected = ref<Type>(types[0] as Type)
const el = ref<HTMLElement | null>(null)
const tasks = ref<Task[]>([
  {
    icon: 'done',
    title: 'Task 1',
    key: 'TSK-584',
    logged: [
      { date: '2021-03-02', logged: 0.5 },
      { date: '2021-03-05', logged: 2.0 },
    ],
  },
  {
    icon: 'pending',
    title: 'Task 2',
    key: 'TSK-592',
    logged: [
      { date: '2021-03-06', logged: 3.5 },
      { date: '2021-03-08', logged: 4.0 },
    ],
  },
  {
    icon: 'pending',
    title: 'Task 3',
    key: 'TSK-593',
    logged: [
      { date: '2021-03-10', logged: 4.5 },
      { date: '2021-03-11', logged: 2.4 },
    ],
  },
  {
    icon: 'done',
    title: 'Task 4',
    key: 'TSK-594',
    logged: [
      { date: '2021-03-14', logged: 6.5 },
      { date: '2021-03-15', logged: 2.0 },
    ],
  },
  {
    icon: 'pending',
    title: 'Task 5',
    key: 'TSK-595',
    logged: [
      { date: '2021-03-12', logged: 1.5 },
      { date: '2021-03-18', logged: 2.0 },
    ],
  },
  {
    icon: 'blocking',
    title: 'Task 6',
    key: 'TSK-596',
    logged: [
      { date: '2021-03-13', logged: 1.5 },
      { date: '2021-03-23', logged: 3.5 },
    ],
  },
  {
    icon: 'pending',
    title: 'Task 7',
    key: 'TSK-597',
    logged: [
      { date: '2021-03-19', logged: 0.75 },
      { date: '2021-03-26', logged: 2.25 },
    ],
  },
  {
    icon: 'done',
    title: 'Task 8',
    key: 'TSK-598',
    logged: [
      { date: '2021-03-21', logged: 1.5 },
      { date: '2021-03-22', logged: 4.0 },
    ],
  },
  {
    icon: 'pending',
    title: 'Task 9',
    key: 'TSK-599',
    logged: [
      { date: '2021-03-26', logged: 6.5 },
      { date: '2021-03-27', logged: 3.5 },
    ],
  },
  {
    icon: 'blocking',
    title: 'Task 10',
    key: 'TSK-600',
    logged: [
      { date: '2021-03-12', logged: 0.5 },
      { date: '2021-03-14', logged: 2.0 },
      { date: '2021-03-28', logged: 4.5 },
      { date: '2021-03-30', logged: 1.0 },
    ],
  },
])
const titleTasks = ref<TitleTask[]>([{ label: 'TITLE' }, { label: 'SUBTITLE' }])
const footerTasks = ref<FooterTask[]>([{ title: 'TOTALS' }])
const startDate = ref(today())
const endDate = ref(today())

const parsedTasks = computed(() => {
  const start = parsed(startDate.value)
  const end = parsed(endDate.value)

  if (!start || !end) {
    return [] as Task[]
  }

  return tasks.value.filter((task) =>
    task.logged.some((logged) => {
      const loggedTimestamp = parsed(logged.date)
      return loggedTimestamp && isBetweenDates(loggedTimestamp, start, end)
    }),
  ) as Task[]
})

watch(
  () => selected.value,
  (current: Type) => {
    removeClass()
    addClass(current)
  },
)

onBeforeMount(() => {
  // adjust all the dates to match the current month
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

onMounted(() => {
  el.value = document.getElementById('calendar-task')
  setTimeout(() => {
    addClass(selected.value)
  }, 350)
})

function updateSelection(type: Type) {
  selected.value = type
}

function addClass(type: Type) {
  if (type.class !== undefined) {
    const els = el.value?.querySelectorAll('.' + type.class)
    if (els && els.length > 0) {
      els.forEach((el) => {
        el.classList.add('highlight')
      })
    }
  }
}

function removeClass() {
  const els = el.value?.querySelectorAll('.highlight')
  if (els && els.length > 0) {
    els.forEach((el) => {
      el.classList.remove('highlight')
    })
  }
}

function getLogged(date: string, logged: { date: string; logged: number }[]) {
  const val: { logged: number }[] = []
  for (let index = 0; index < logged.length; ++index) {
    if (logged[index]!.date === date) {
      val.push({ logged: logged[index]!.logged })
      break
    }
  }
  return val
}

function getLoggedSummary(date: string) {
  let total = 0

  const reducer = (accumulator: number, currentValue: { date: string; logged: number }) => {
    if (date === currentValue.date) {
      return accumulator + currentValue.logged
    }
    return accumulator
  }

  for (const index in tasks.value) {
    const task = tasks.value[index]
    total += task!.logged.reduce(reducer, 0)
  }

  return total
}

/**
 * Sums up the amount of time spent on a task
 * This only sums it up if the logged date falls
 * between the start and end times
 */
function sum(start: Timestamp, end: Timestamp, task: Task) {
  const reducer = (accumulator: number, currentValue: { date: string; logged: number }) => {
    const loggedTimestamp = parsed(currentValue.date)
    if (loggedTimestamp && isBetweenDates(loggedTimestamp, start, end)) {
      return accumulator + currentValue.logged
    }
    return accumulator
  }
  return task.logged.reduce(reducer, 0)
}

function weekdayClass() {
  return {
    'task__weekday--style': true,
  }
}

function dayClass() {
  return {
    'task__day--style': true,
  }
}

function footerDayClass() {
  return {
    'task__footer--day__style': true,
  }
}

/**
 * Sums up the amount of time spent for all tasks
 * between the start and end dates
 */
function totals(start: Timestamp, end: Timestamp) {
  let total = 0
  const reducer = (accumulator: number, currentValue: { date: string; logged: number }) => {
    const loggedTimestamp = parsed(currentValue.date)
    if (loggedTimestamp && isBetweenDates(loggedTimestamp, start, end)) {
      return accumulator + currentValue.logged
    }
    return accumulator
  }

  for (const task in tasks.value) {
    total += tasks.value[task]!.logged.reduce(reducer, 0)
  }

  return total
}

function onChange(data: { start: string; end: string }) {
  startDate.value = data.start
  endDate.value = data.end
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
