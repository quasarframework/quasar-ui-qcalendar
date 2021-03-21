<template>
  <div class="subcontent">
    <navigation-bar
      @today="onToday"
      @prev="onPrev"
      @next="onNext"
    />

    <div style="display: flex; justify-content: center; align-items: center; flex-wrap: nowrap;">
      <div style="display: flex; max-width: 800px; width: 100%; height: 220px;">
        <QCalendarTask
          ref="calendar"
          v-model="selectedDate"
          :tasks="parsedTasks"
          :disabled-weekdays="[0,6]"
          :task-width="240"
          :min-label-length="2"
          :weekday-class="weekdayClass"
          :day-class="dayClass"
          :footer-day-class="footerDayClass"
          :focus-type="['day', 'date', 'task']"
          focusable
          hoverable
          animated
          bordered
          @change="onChange"
          @moved="onMoved"
          @click-date="onClickDate"
          @click-day="onClickDay"
          @click-head-day="onClickHeadDay"
        >
          <template #head-task="{ /* scope */ }">
            <div class="header ellipsis" style="font-weight: 600">
              <div class="issue ellipsis">Issue</div>
              <div class="key">Key</div>
              <div class="logged">Logged</div>
            </div>
          </template>

          <template #task="{ scope }">
            <template v-for="task in getTasks(scope.start, scope.end, scope.task)" :key="task.key">
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
          </template>

          <template #day="{ scope }">
            <template v-for="time in getLogged(scope.timestamp.date, scope.task.logged)" :key="time">
              <div class="logged-time">{{ time.logged }}</div>
            </template>
          </template>

          <template #footer-task="{ scope }">
            <div class="summary ellipsis">
              <div class="title ellipsis">TOTAL</div>
              <div class="total">{{ totals(scope.start, scope.end, scope.tasks) }}</div>
            </div>
          </template>

          <template #footer-day="{ scope }">
            <div class="logged-time">{{ getLoggedSummary(scope.timestamp.date, scope.tasks) }}</div>
          </template>
        </QCalendarTask>
      </div>
    </div>
  </div>
</template>

<script>
import {
  today,
  isBetweenDates,
  parsed
} from '@quasar/quasar-ui-qcalendar/Timestamp.js'
import { QCalendarTask } from '@quasar/quasar-ui-qcalendar/QCalendarTask.js'
import '@quasar/quasar-ui-qcalendar/QCalendarVariables.sass'
import '@quasar/quasar-ui-qcalendar/QCalendarTransitions.sass'
import '@quasar/quasar-ui-qcalendar/QCalendarTask.sass'

import { defineComponent } from 'vue'
import NavigationBar from '../components/NavigationBar.vue'

import Done from '@carbon/icons-vue/es/checkmark--outline/16'
import Pending from '@carbon/icons-vue/es/pending/16'
import Blocking from '@carbon/icons-vue/es/undefined/16'

export default defineComponent({
  name: 'TaskBasic',
  components: {
    NavigationBar,
    QCalendarTask,
    Done,
    Pending,
    Blocking
  },
  data () {
    return {
      selectedDate: today(),
      startDate: today(),
      endDate: today(),
      tasks: [
        {
          icon: 'done',
          title: 'Task 1',
          key: 'TSK-584',
          logged: [
            { date: '2021-03-02', logged: 0.5 },
            { date: '2021-03-05', logged: 2.0 }
          ]
        },
        {
          icon: 'pending',
          title: 'Task 2',
          key: 'TSK-592',
          logged: [
            { date: '2021-03-06', logged: 3.5 },
            { date: '2021-03-08', logged: 4.0 }
          ]
        },
        {
          icon: 'pending',
          title: 'Task 3',
          key: 'TSK-593',
          logged: [
            { date: '2021-03-10', logged: 4.5 },
            { date: '2021-03-11', logged: 2.4 }
          ]
        },
        {
          icon: 'done',
          title: 'Task 4',
          key: 'TSK-594',
          logged: [
            { date: '2021-03-14', logged: 6.5 },
            { date: '2021-03-15', logged: 2.0 }
          ]
        },
        {
          icon: 'pending',
          title: 'Task 5',
          key: 'TSK-595',
          logged: [
            { date: '2021-03-12', logged: 1.5 },
            { date: '2021-03-18', logged: 2.0 }
          ]
        },
        {
          icon: 'blocking',
          title: 'Task 6',
          key: 'TSK-596',
          logged: [
            { date: '2021-03-13', logged: 1.5 },
            { date: '2021-03-23', logged: 3.5 }
          ]
        },
        {
          icon: 'pending',
          title: 'Task 7',
          key: 'TSK-597',
          logged: [
            { date: '2021-03-19', logged: 0.75 },
            { date: '2021-03-26', logged: 2.25 }
          ]
        },
        {
          icon: 'done',
          title: 'Task 8',
          key: 'TSK-598',
          logged: [
            { date: '2021-03-21', logged: 1.5 },
            { date: '2021-03-22', logged: 4.0 }
          ]
        },
        {
          icon: 'pending',
          title: 'Task 9',
          key: 'TSK-599',
          logged: [
            { date: '2021-03-26', logged: 6.5 },
            { date: '2021-03-27', logged: 3.5 }
          ]
        },
        {
          icon: 'blocking',
          title: 'Task 10',
          key: 'TSK-600',
          logged: [
            { date: '2021-03-12', logged: 0.5 },
            { date: '2021-03-14', logged: 2.0 },
            { date: '2021-03-28', logged: 4.5 },
            { date: '2021-03-30', logged: 1.0 }
          ]
        }
      ]
    }
  },
  computed: {
    /**
     * Returns tasks between startDate and endDate (captured via onChange event)
     */
    parsedTasks () {
      const start = parsed(this.startDate)
      const end = parsed(this.endDate)
      const tasks = []

      for (let i = 0; i < this.tasks.length; ++i) {
        const task = this.tasks[ i ]
        for (let j = 0; j < task.logged.length; ++j) {
          const loggedTimestamp = parsed(task.logged[ j ].date)
          if (isBetweenDates(loggedTimestamp, start, end)) {
            tasks.push(task)
            break
          }
        }
      }
      return tasks
    }
  },
  methods: {
    getLogged (date, logged) {
      const val = []
      for (let index = 0; index < logged.length; ++index) {
        if (logged[ index ].date === date) {
          val.push({ logged: logged[ index ].logged })
          break
        }
      }
      return val
    },

    getLoggedSummary (date, tasks) {
      let total = 0

      const reducer = (accumulator, currentValue) => {
        if (date === currentValue.date) {
          return accumulator + currentValue.logged
        }
        return accumulator
      }

      for (const index in tasks) {
        const task = tasks[ index ]
        total += task.logged.reduce(reducer, 0)
      }

      return total
    },

    /**
     * Sums up the amount of time spent on a task
     * This only sums it up if the logged date falls
     * between the start and end times
     */
    sum (start, end, task) {
      const reducer = (accumulator, currentValue) => {
        const loggedTimestamp = parsed(currentValue.date)
        if (isBetweenDates(loggedTimestamp, start, end)) {
          return accumulator + currentValue.logged
        }
        return accumulator
      }
      return task.logged.reduce(reducer, 0)
    },

    /**
     * Determines if the passed in task has logged time
     * between the start and end times
     */
    getTasks (start, end, task) {
      const tasks = []

      for (let index = 0; index < task.logged.length; ++index) {
        const loggedTimestamp = parsed(task.logged[ index ].date)
        if (isBetweenDates(loggedTimestamp, start, end)) {
          tasks.push(task)
          break
        }
      }
      return tasks
    },

    weekdayClass (data) {
      return {
        'task__weekday--style': true
      }
    },

    dayClass (data) {
      return {
        'task__day--style': true
      }
    },

    footerDayClass (data) {
      return {
        'task__footer--day__style': true
      }
    },

    /**
     * Sums up the amount of time spent for all tasks
     * between the start and end dates
     */
    totals (start, end, tasks) {
      let total = 0
      const reducer = (accumulator, currentValue) => {
        const loggedTimestamp = parsed(currentValue.date)
        if (isBetweenDates(loggedTimestamp, start, end)) {
          return accumulator + currentValue.logged
        }
        return accumulator
      }

      for (const task in tasks) {
        total += tasks[ task ].logged.reduce(reducer, 0)
      }

      return total
    },

    onToday () {
      this.$refs.calendar.moveToToday()
    },
    onPrev () {
      this.$refs.calendar.prev()
    },
    onNext () {
      this.$refs.calendar.next()
    },
    onMoved (data) {
      console.log('onMoved', data)
    },
    onChange (data) {
      console.log('onChange', data)
      this.startDate = data.start
      this.endDate = data.end
    },
    onClickDate (data) {
      console.log('onClickDate', data)
    },
    onClickDay (data) {
      console.log('onClickDay', data)
    },
    onClickHeadDay (data) {
      console.log('onClickHeadDay', data)
    }
  }
})
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
  font-weight: 700
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
</style>

<style lang="sass">
.task__weekday--style
  font-size: 0.8em
  font-weight: 600
.task__day--style
  font-size: 0.8em
.task__footer--day__style
  font-size: 0.8em
  font-weight: 600
</style>
