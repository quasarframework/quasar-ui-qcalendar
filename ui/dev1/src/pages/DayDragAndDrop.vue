<template>
  <div class="subcontent">
    <div class="line">
      Drag any items in the list to a calendar interval or the top header.<br>
      Don't use css <code class="token">border</code> to outline a cell. It won't look right.<br>
      Instead use <code class="token">box-shadow</code> to create an inset like this <code class="token">box-shadow: inset 0 0 0 1px rgba(0,140,200,.8)</code>
    </div>

    <navigation-bar
      @today="onToday"
      @prev="onPrev"
      @next="onNext"
    />

    <div style="display: flex; justify-content: center; width: 100%;">
      <div style="margin: 10px;">
        <ul class="list">
          <li
            v-for="item in dragItems"
            :key="item.id"
            class="button list-item"
            draggable="true"
            @dragstart="onDragStart($event, item)"
          >
            {{ item.name }}
          </li>
        </ul>
      </div>

      <div style="display: flex; max-width: 800px; width: 100%; height: 400px;">
        <QCalendarDay
          ref="calendar"
          v-model="selectedDate"
          view="day"
          :drag-enter-func="onDragEnter"
          :drag-over-func="onDragOver"
          :drag-leave-func="onDragLeave"
          :drop-func="onDrop"
          :weekday-class="onWeekdayClass"
          :interval-class="onIntervalClass"
          :interval-start="24"
          :interval-minutes="15"
          :interval-count="56"
          :interval-height="28"
          :weekdays="[1,2,3,4,5]"
          hoverable
          animated
          bordered
          @change="onChange"
          @moved="onMoved"
          @click-date="onClickDate"
          @click-time="onClickTime"
          @click-interval="onClickInterval"
          @click-head-intervals="onClickHeadIntervals"
          @click-head-day="onClickHeadDay"
        >
          <template #head-date="{ scope: { timestamp } }">
            <div
              v-if="allDayEventsMap[timestamp.date] && allDayEventsMap[timestamp.date].length > 0"
              style="display: flex; justify-content: space-evenly; flex-wrap: wrap; align-items: center; font-weight: 400; font-size: 12px; height: auto;"
            >
              <template
                v-for="event in allDayEventsMap[timestamp.date]"
                :key="event.time"
              >
                <div>
                  {{ event.name }}
                </div>
              </template>
            </div>
          </template>

          <template #day-interval="{ scope: { timestamp } }">
            <div
              v-if="hasEvents(timestamp)"
              style="display: flex; justify-content: space-evenly; align-items: center; font-size: 12px;"
            >
              <template
                v-for="event in getEvents(timestamp)"
                :key="event.time"
              >
                <div style="border: 1px solid pink; border-radius: 2px; padding: 2px; margin: 1px;">
                  {{ event.name }}: {{ event.time }}
                </div>
              </template>
            </div>
          </template>
        </QCalendarDay>
      </div>
    </div>
  </div>
</template>

<script>
import { QCalendarDay } from '@quasar/quasar-ui-qcalendar/QCalendarDay.js'
import { today } from '@quasar/quasar-ui-qcalendar/Timestamp.js'
import '@quasar/quasar-ui-qcalendar/QCalendarVariables.sass'
import '@quasar/quasar-ui-qcalendar/QCalendarTransitions.sass'
import '@quasar/quasar-ui-qcalendar/QCalendarDay.sass'

import { defineComponent } from 'vue'
import NavigationBar from '../components/NavigationBar.vue'

export default defineComponent({
  name: 'DayDragAndDrop',
  components: {
    NavigationBar,
    QCalendarDay
  },
  data () {
    return {
      selectedDate: today(),
      dragItems: [
        {
          id: 1,
          name: 'Appointment'
        },
        {
          id: 2,
          name: 'Reminder'
        },
        {
          id: 3,
          name: 'Task'
        }
      ],
      defaultEvent: {
        id: 0,
        type: 0,
        name: '',
        date: '',
        time: '',
        allDay: false
      },
      events: []
    }
  },

  computed: {
    // convert the events into a map of lists keyed by date
    eventsMap () {
      const map = {}
      this.events.forEach(event => event.allDay !== true && ((map[ event.date ] = map[ event.date ] || []).push(event)))
      return map
    },

    allDayEventsMap () {
      const map = {}
      if (this.events.length > 0) {
        this.events.forEach(event => event.allDay === true && ((map[ event.date ] = map[ event.date ] || []).push(event)))
      }
      return map
    }
  },

  methods: {
    onDragStart (event, item) {
      console.log('onDragStart called')
      event.dataTransfer.dropEffect = 'copy'
      event.dataTransfer.effectAllowed = 'move'
      event.dataTransfer.setData('ID', item.id)
    },

    onDragEnter (e, type, scope) {
      console.log('onDragEnter')
      e.preventDefault()
      return true
    },

    onDragOver (e, type, scope) {
      console.log('onDragOver')
      e.preventDefault()
      return true
    },

    onDragLeave (e, type, scope) {
      console.log('onDragLeave')
      return false
    },

    onDrop (e, type, scope) {
      console.log('onDrop', type, scope)
      const itemID = parseInt(e.dataTransfer.getData('ID'), 10)
      const event = { ...this.defaultEvent }
      event.id = this.events.length + 1
      const item = this.dragItems.filter(item => item.id === itemID)
      event.type = item[ 0 ].id
      event.name = item[ 0 ].name
      event.date = scope.timestamp.date
      if (type === 'interval') {
        event.time = scope.timestamp.time
      }
      else { // head-day
        event.allDay = true
      }
      this.events.push(event)
      return false
    },

    getEvents (timestamp) {
      const times = this.eventsMap[ timestamp.date ]
      if (times) {
        return times.filter(item => item.time === timestamp.time)
      }
      return []
    },

    hasEvents (timestamp) {
      return this.getEvents(timestamp).length > 0
    },

    onIntervalClass ({ scope }) {
      return {
        droppable: scope.droppable === true
      }
    },

    onWeekdayClass ({ scope }) {
      return {
        droppable: scope.droppable === true
      }
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
    },
    onClickDate (data) {
      console.log('onClickDate', data)
    },
    onClickTime (data) {
      console.log('onClickTime', data)
    },
    onClickInterval (data) {
      console.log('onClickInterval', data)
    },
    onClickHeadIntervals (data) {
      console.log('onClickHeadIntervals', data)
    },
    onClickHeadDay (data) {
      console.log('onClickHeadDay', data)
    }
  }
})
</script>

<style lang="sass">
.droppable
  box-shadow: inset 0 0 0 1px rgba(0,140,200,.8)
</style>
