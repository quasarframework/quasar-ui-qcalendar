<template>
  <div class="subcontent">
    <navigation-bar
      @today="onToday"
      @prev="onPrev"
      @next="onNext"
    />

    <div
      class="button-bar"
      style="margin: 12px;"
    >
      <q-select
        v-model="selectedCalendar"
        v-model:modelResources="resources"
        label="Calendar Mode"
        outlined
        dense
        options-dense
        :options="[
          'day',
          'month',
          'agenda',
          'resource',
          'scheduler',
          'task'
        ]"
        class="button"
        style="min-width: 160px;"
      />
    </div>

    <div style="display: flex; justify-content: center; align-items: center; flex-wrap: nowrap;">
      <div style="display: flex; max-width: 800px; width: 100%; max-height: 400px;">
        <q-calendar
          ref="calendar"
          :mode="selectedCalendar"
          v-model="selectedDate"
          v-model:modelResources="resources"
          resource-key="id"
          resource-label="name"
          view="week"
          animated
          bordered
          :tasks="parsedTasks"
          :task-width="240"
          :min-label-length="2"
          @change="onChange"
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

          <template #day="{ scope: { timestamp } }">
            <template v-if="selectedCalendar === 'task'">
              <template v-for="time in getLogged(timestamp.date, scope.task.logged)" :key="time">
                <div class="logged-time">{{ time.logged }}</div>
              </template>
            </template>
            <template v-if="selectedCalendar === 'agenda'">
              <template
                v-for="agenda in getAgenda(timestamp)"
                :key="timestamp.date + agenda.time"
              >
                <div
                  :label="agenda.time"
                  class="justify-start q-ma-sm shadow-5 bg-grey-6"
                  style="margin-top: 25px;"
                >
                  <div
                    v-if="agenda.avatar"
                    class="row justify-center"
                    style="margin-top: 30px; width: 100%;"
                  >
                    <q-avatar style="margin-top: -50px; margin-bottom: 10px; font-size: 60px;">
                      <img
                        :src="agenda.avatar"
                        style="border: #9e9e9e solid 5px;"
                      >
                    </q-avatar>
                  </div>
                  <div class="col-12 q-px-sm">
                    <strong>{{ agenda.time }}</strong>
                  </div>
                  <div
                    v-if="agenda.desc"
                    class="col-12 q-px-sm"
                    style="font-size: 10px;"
                  >
                    {{ agenda.desc }}
                  </div>
                </div>
              </template>
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

        </q-calendar>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent, ref, computed, reactive, onBeforeMount } from 'vue'
import { QCalendar } from '@quasar/quasar-ui-qcalendar/QCalendar.js'
import '@quasar/quasar-ui-qcalendar/QCalendarVariables.sass'
import '@quasar/quasar-ui-qcalendar/QCalendarTransitions.sass'
import '@quasar/quasar-ui-qcalendar/QCalendar.sass'
import {
  today,
  padNumber,
  isBetweenDates,
  parsed
} from '@quasar/quasar-ui-qcalendar/Timestamp.js'

import NavigationBar from '../components/NavigationBar.vue'

import Done from '@carbon/icons-vue/es/checkmark--outline/16'
import Pending from '@carbon/icons-vue/es/pending/16'
import Blocking from '@carbon/icons-vue/es/undefined/16'

export default defineComponent({
  name: 'AllCalendar',
  components: {
    NavigationBar,
    QCalendar,
    Done,
    Pending,
    Blocking
  },
  setup () {
    const
      selectedCalendar = ref('day'),
      calendar = ref(null),
      selectedDate = ref(today()),
      resources = reactive([
        { id: '1', name: 'John' },
        {
          id: '2',
          name: 'Board Room',
          expanded: false,
          children: [
            { id: '2.1', name: 'Room-1' },
            {
              id: '2.2',
              name: 'Room-2',
              expanded: false,
              children: [
                { id: '2.2.1', name: 'Partition-A' },
                { id: '2.2.2', name: 'Partition-B' },
                { id: '2.2.2', name: 'Partition-C' }
              ]
            }
          ]
        },
        { id: '3', name: 'Mary' },
        { id: '4', name: 'Susan' },
        { id: '5', name: 'Olivia' }
      ]),
      startDate = ref(today()),
      endDate = ref(today()),
      tasks = reactive([
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
      ]),
      agenda = {
        // value represents day of the week
        1: [
          {
            time: '08:00',
            avatar: 'https://cdn.quasar.dev/img/boy-avatar.png',
            desc: 'Meeting with CEO'
          },
          {
            time: '08:30',
            avatar: 'https://cdn.quasar.dev/img/avatar.png',
            desc: 'Meeting with HR'
          },
          {
            time: '10:00',
            avatar: 'https://cdn.quasar.dev/img/avatar1.jpg',
            desc: 'Meeting with Karen'
          }
        ],
        2: [
          {
            time: '11:30',
            avatar: 'https://cdn.quasar.dev/img/avatar2.jpg',
            desc: 'Meeting with Alisha'
          },
          {
            time: '17:00',
            avatar: 'https://cdn.quasar.dev/img/avatar3.jpg',
            desc: 'Meeting with Sarah'
          }
        ],
        3: [
          {
            time: '08:00',
            desc: 'Stand-up SCRUM',
            avatar: 'https://cdn.quasar.dev/img/material.png'
          },
          {
            time: '09:00',
            avatar: 'https://cdn.quasar.dev/img/boy-avatar.png'
          },
          {
            time: '10:00',
            desc: 'Sprint planning',
            avatar: 'https://cdn.quasar.dev/img/material.png'
          },
          {
            time: '13:00',
            avatar: 'https://cdn.quasar.dev/img/avatar1.jpg'
          }
        ],
        4: [
          {
            time: '09:00',
            avatar: 'https://cdn.quasar.dev/img/avatar3.jpg'
          },
          {
            time: '10:00',
            avatar: 'https://cdn.quasar.dev/img/avatar2.jpg'
          },
          {
            time: '13:00',
            avatar: 'https://cdn.quasar.dev/img/material.png'
          }
        ],
        5: [
          {
            time: '08:00',
            avatar: 'https://cdn.quasar.dev/img/boy-avatar.png'
          },
          {
            time: '09:00',
            avatar: 'https://cdn.quasar.dev/img/avatar2.jpg'
          },
          {
            time: '09:30',
            avatar: 'https://cdn.quasar.dev/img/avatar4.jpg'
          },
          {
            time: '10:00',
            avatar: 'https://cdn.quasar.dev/img/avatar5.jpg'
          },
          {
            time: '11:30',
            avatar: 'https://cdn.quasar.dev/img/material.png'
          },
          {
            time: '13:00',
            avatar: 'https://cdn.quasar.dev/img/avatar6.jpg'
          },
          {
            time: '13:30',
            avatar: 'https://cdn.quasar.dev/img/avatar3.jpg'
          },
          {
            time: '14:00',
            avatar: 'https://cdn.quasar.dev/img/linux-avatar.png'
          },
          {
            time: '14:30',
            avatar: 'https://cdn.quasar.dev/img/avatar.png'
          },
          {
            time: '15:00',
            avatar: 'https://cdn.quasar.dev/img/boy-avatar.png'
          },
          {
            time: '15:30',
            avatar: 'https://cdn.quasar.dev/img/avatar2.jpg'
          },
          {
            time: '16:00',
            avatar: 'https://cdn.quasar.dev/img/avatar6.jpg'
          }
        ]
      }

    const parsedTasks = computed(() => {
      const start = parsed(startDate.value)
      const end = parsed(endDate.value)
      const tasks2 = []

      for (let i = 0; i < tasks.length; ++i) {
        const task = tasks[ i ]
        for (let j = 0; j < task.logged.length; ++j) {
          const loggedTimestamp = parsed(task.logged[ j ].date)
          if (isBetweenDates(loggedTimestamp, start, end)) {
            tasks2.push(task)
            break
          }
        }
      }
      return tasks2
    })

    onBeforeMount(() => {
      // adjust all the dates for the current month so examples don't expire
      const date = new Date()
      const year = date.getFullYear()
      const month = padNumber((date.getMonth() + 1), 2)
      tasks.forEach(task => {
        task.logged.forEach(logged => {
          // get last 2 digited from current date (day)
          const day = logged.date.slice(-2)
          logged.date = [ year, padNumber(month, 2), padNumber(day, 2) ].join('-')
        })
      })
    })

    function onChange (data) {
      startDate.value = data.start
      endDate.value = data.end
    }

    function getLogged (date, logged) {
      const val = []
      for (let index = 0; index < logged.length; ++index) {
        if (logged[ index ].date === date) {
          val.push({ logged: logged[ index ].logged })
          break
        }
      }
      return val
    }

    function getLoggedSummary (date, tasks) {
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
    }

    /**
     * Sums up the amount of time spent on a task
     * This only sums it up if the logged date falls
     * between the start and end times
     */
    function sum (start, end, task) {
      const reducer = (accumulator, currentValue) => {
        const loggedTimestamp = parsed(currentValue.date)
        if (isBetweenDates(loggedTimestamp, start, end)) {
          return accumulator + currentValue.logged
        }
        return accumulator
      }
      return task.logged.reduce(reducer, 0)
    }

    /**
     * Determines if the passed in task has logged time
     * between the start and end times
     */
    function getTasks (start, end, task) {
      const tasks = []

      for (let index = 0; index < task.logged.length; ++index) {
        const loggedTimestamp = parsed(task.logged[ index ].date)
        if (isBetweenDates(loggedTimestamp, start, end)) {
          tasks.push(task)
          break
        }
      }
      return tasks
    }

    /**
     * Sums up the amount of time spent for all tasks
     * between the start and end dates
     */
    function totals (start, end, tasks) {
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
    }

    function getAgenda (day) {
      return this.agenda[ parseInt(day.weekday, 10) ]
    }

    function onToday () {
      calendar.value.moveToToday()
    }
    function onPrev () {
      calendar.value.prev()
    }
    function onNext () {
      calendar.value.next()
    }

    return {
      selectedCalendar,
      selectedDate,
      calendar,
      resources,
      onToday,
      onPrev,
      onNext,
      onChange,
      // tasks
      parsedTasks,
      getLogged,
      getLoggedSummary,
      sum,
      getTasks,
      totals,
      // agenda
      agenda,
      getAgenda
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
  font-size: 0.8em !important
  font-weight: 600
.task__day--style
  font-size: 0.8em !important
.task__footer--day__style
  font-size: 0.8em !important
  font-weight: 600
</style>
