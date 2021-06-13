<template>
  <div class="subcontent">

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
      <div style="display: flex; justify-content: center; max-width: 800px; width: 100%; height: 400px;">
        <q-calendar-scheduler
          ref="calendar"
          v-model="selectedDate"
          v-model:model-resources="resources"
          view="week"
          :drag-enter-func="onDragEnter"
          :drag-over-func="onDragOver"
          :drag-leave-func="onDragLeave"
          :drop-func="onDrop"
          :weekday-class="onWeekdayClass"
          :day-class="onDayClass"
          :weekdays="[1,2,3,4,5]"
          hoverable
          animated
          bordered
          :day-min-height="50"
          :day-height="0"
          style="max-width: 800px; width: 100%;"
          @change="onChange"
          @moved="onMoved"
          @click-date="onClickDate"
          @click-day-resource="onClickDayResource"
          @click-resource="onClickResource"
          @click-head-resources="onClickHeadResources"
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
                <div
                  style="display: flex; flex: 1 0 auto; flex-wrap: wrap; justify-content: space-evenly; align-items: center; font-size: 12px;"
                >
                  {{ event.name }}
                </div>
              </template>
            </div>
          </template>

          <template #day="{ scope: { timestamp, resource } }">
            <div
              v-if="hasEvents(timestamp, resource)"
              style="display: flex; flex: 1 0 auto; flex-wrap: wrap; justify-content: space-evenly; align-items: center; font-size: 12px;"
            >
              <template
                v-for="event in getEvents(timestamp, resource)"
                :key="event.id"
              >
                <span
                  v-if="event.resource"
                  style="border: 1px solid pink; border-radius: 2px; padding: 2px; margin: 1px; user-select: none;">
                  {{ event.name }}
                </span>
              </template>
            </div>
          </template>
        </q-calendar-scheduler>
      </div>
    </div>
  </div>
</template>

<script>
import { QCalendarScheduler, today } from '@quasar/quasar-ui-qcalendar'
import '@quasar/quasar-ui-qcalendar/src/QCalendarVariables.sass'
import '@quasar/quasar-ui-qcalendar/src/QCalendarTransitions.sass'
import '@quasar/quasar-ui-qcalendar/src/QCalendarScheduler.sass'

import { defineComponent } from 'vue'
import NavigationBar from '../components/NavigationBar.vue'

export default defineComponent({
  name: 'SchedulerDragAndDrop',
  components: {
    NavigationBar,
    QCalendarScheduler
  },
  data () {
    return {
      selectedDate: today(),
      resources: [
        { id: 1, label: 'John' },
        { id: 2, label: 'Mary' },
        { id: 3, label: 'Susan' },
        { id: 4, label: 'Olivia' },
        { id: 5, label: 'Board Room' },
        { id: 6, label: 'Room-1' },
        { id: 7, label: 'Room-2' }
      ],
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
        allDay: false,
        resource: {}
      },
      events: []
    }
  },
  computed: {
    // convert the events into a map of lists keyed by date
    eventsMap () {
      const map = {}
      if (this.events.length > 0) {
        this.events.forEach(event => (map[ event.date ] = map[ event.date ] || []).push(event))
      }
      console.log('eventsMap', map)
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
    onDragStart (e, item) {
      console.log('onDragStart called')
      e.dataTransfer.dropEffect = 'copy'
      e.dataTransfer.effectAllowed = 'move'
      e.dataTransfer.setData('ID', item.id)
    },

    onDragEnter (e, type, scope) {
      console.log('onDragEnter')
      if (type === 'day' || type === 'head-day') {
        e.preventDefault()
        return true
      }
    },

    onDragOver (e, type, scope) {
      console.log('onDragOver')
      if (type === 'day' || type === 'head-day') {
        e.preventDefault()
        return true
      }
    },

    onDragLeave (e, type, scope) {
      console.log('onDragLeave')
      if (type === 'day' || type === 'head-day') {
        return false
      }
    },

    onDrop (e, type, scope) {
      console.log('onDrop', scope)
      if (type === 'day' || type === 'head-day') {
        const itemID = parseInt(e.dataTransfer.getData('ID'), 10)
        const event = { ...this.defaultEvent }
        event.id = this.events.length + 1
        const item = this.dragItems.filter(item => item.id === itemID)
        event.type = item[ 0 ].id
        event.name = item[ 0 ].name
        event.date = scope.timestamp.date
        event.resource = scope.resource
        if (type === 'head-day') {
          event.allDay = true
        }
        this.events.push(event)
        return false
      }
    },

    getEvents (timestamp, resource) {
      if (resource) {
        const events = this.eventsMap[ timestamp.date ]
        if (events) {
          return events.filter(item => {
            if (item.resource) {
              return item.date === timestamp.date && item.resource.id === resource.id
            }
            return item.date === timestamp.date
          })
        }
      }
      return []
    },

    hasEvents (timestamp, resource) {
      return this.getEvents(timestamp, resource).length > 0
    },

    onDayClass ({ scope }) {
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
    onClickDayResource (data) {
      console.log('onClickDayResource', data)
    },
    onClickResource (data) {
      console.log('onClickResource', data)
    },
    onClickHeadResources (data) {
      console.log('onClickHeadResources', data)
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
