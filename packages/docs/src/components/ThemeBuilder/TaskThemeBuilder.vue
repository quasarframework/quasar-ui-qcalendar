<template>
  <div class="subcontent">
    <div style="display: flex; width: 100%; height: auto">
      <q-calendar-task
        ref="calendar"
        v-model="selectedDate"
        v-model:model-tasks="parsedTasks"
        v-model:model-title="titleTasks"
        v-model:model-footer="footerTasks"
        view="month"
        :task-width="240"
        :min-weekday-length="2"
        :focus-type="['weekday', 'date', 'task']"
        focusable
        hoverable
        animated
        bordered
        :style="styles"
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
          <div class="header ellipsis">
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
              <span v-else-if="scope.task.icon === 'blocking'" class="blocking"><Blocking /></span>
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
              <span v-else-if="scope.task.icon === 'blocking'" class="blocking"><Blocking /></span>
              {{ scope.task.title }}
            </div>
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
import { ref, computed, watch, onBeforeMount } from 'vue'
import {
  today,
  isBetweenDates,
  parsed,
  padNumber,
  QCalendarTask,
  Timestamp,
} from '@quasar/quasar-ui-qcalendar'
import '@quasar/quasar-ui-qcalendar/index.css'

import Done from '@carbon/icons-vue/es/checkmark--outline/16'
import Pending from '@carbon/icons-vue/es/pending/16'
import Blocking from '@carbon/icons-vue/es/undefined/16'

interface Props {
  modelValue: string
  styles: Record<string, any>
}
interface Task {
  key: string
  title: string
  icon?: string
  expanded?: boolean
  children?: Task[]
  logged: { date: string; logged: number }[]
}
interface TitleTask {
  label: string
}
interface FooterTask {
  title: string
}

const props = defineProps<Props>()

const calendar = ref<QCalendarTask>()
const selectedDate = ref(today())
const startDate = ref(today())
const endDate = ref(today())
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

const parsedTasks = computed(() => {
  const start = parsed(startDate.value)
  const end = parsed(endDate.value)
  const taskList = []

  if (start && end) {
    for (let i = 0; i < tasks.value.length; ++i) {
      const task = tasks.value[i]
      if (task) {
        for (let j = 0; j < task.logged.length; ++j) {
          const logged = task.logged[j]
          if (logged) {
            const loggedTimestamp = parsed(logged.date)
            if (loggedTimestamp && isBetweenDates(loggedTimestamp, start, end)) {
              taskList.push(task)
              break
            }
          }
        }
      }
    }
  }
  return taskList
})

watch(
  () => props.modelValue,
  (val) => {
    selectedDate.value = val
  },
)

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

function getLogged(date: string, logged: { date: string; logged: number }[]) {
  const val = []
  for (let index = 0; index < logged.length; ++index) {
    const log = logged[index]

    if (log && log.date === date) {
      val.push({ logged: log.logged })
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
    if (task) {
      total += task.logged.reduce(reducer, 0)
    }
  }

  return total
}

/**
 * Sums up the amount of time spent on a task
 * This only sums it up if the logged date falls
 * between the start and end times
 */
function sum(
  start: Timestamp,
  end: Timestamp,
  task: { logged: { date: string; logged: number }[] },
) {
  const reducer = (accumulator: number, currentValue: { date: string; logged: number }) => {
    const loggedTimestamp = parsed(currentValue.date)
    if (loggedTimestamp && isBetweenDates(loggedTimestamp, start, end)) {
      return accumulator + currentValue.logged
    }
    return accumulator
  }
  return task.logged.reduce(reducer, 0)
}

/**
 * Sums up the amount of time spent for all tasks
 * between the start and end dates
 */
function totals(start: Timestamp, end: Timestamp) {
  let total = 0
  const reducer = (accumulator: number, currentValue: { date: string; logged: number }) => {
    const loggedTimestamp = parsed(currentValue.date)
    if (loggedTimestamp && start && end && isBetweenDates(loggedTimestamp, start, end)) {
      return accumulator + currentValue.logged
    }
    return accumulator
  }

  for (const task in tasks.value) {
    if (tasks.value[task]) {
      total += tasks.value[task].logged.reduce(reducer, 0)
    }
  }

  return total
}

// function onToday() {
//   if (calendar.value) {
//     calendar.value.moveToToday()
//   }
// }
// function onPrev() {
//   if (calendar.value) {
//     calendar.value.prev()
//   }
// }
// function onNext() {
//   if (calendar.value) {
//     calendar.value.next()
//   }
// }
function onMoved(data: any) {
  console.info('onMoved', data)
}
function onChange(data: { start: string; end: string }) {
  console.info('onChange', data)
  startDate.value = data.start
  endDate.value = data.end
}
function onClickDate(data: any) {
  console.info('onClickDate', data)
}
function onClickDay(data: any) {
  console.info('onClickDay', data)
}
function onClickHeadDay(data: any) {
  console.info('onClickHeadDay', data)
}
</script>

<style lang="sass" scoped>
.header
  display: flex
  justify-content: space-between
  align-items: center
  width: 100%
  padding: 2px
  font-size: .9em
  .issue
    display: flex
    justify-content: flex-start
    align-items: center
    width: 80%
  .key
    display: flex
    justify-content: center
    width: 80px
  .logged
    display: flex
    justify-content: flex-end
    width: 80px
.summary
  display: flex
  justify-content: space-between
  align-items: center
  padding: 2px
  font-size: .9em
  // font-weight: 700
  width: 100%
  .title
    display: flex
    justify-content: flex-start
  .total
    display: flex
    justify-content: flex-end
.done
  color: blue
.pending
  color: green
.blocking
  color: red
.logged-time
  display: flex
  justify-content: center
  align-items: center
  padding: 0
  margin: 0
  height: 100%
</style>
