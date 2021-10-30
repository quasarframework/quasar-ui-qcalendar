<template>
  <div class="subcontent">
    <navigation-bar
      @today="onToday"
      @prev="onPrev"
      @next="onNext"
    />

    <div class="row justify-center">
      <div style="display: flex; max-width: 800px; width: 100%; height: 400px;">
        <q-calendar-scheduler
          ref="calendar"
          v-model="selectedDate"
          v-model:model-resources="resources"
          view="week"
          resource-key="id"
          resource-label="name"
          animated
          bordered
          :style="styles"
          @change="onChange"
          @moved="onMoved"
          @resource-expanded="onResourceExpanded"
          @click-date="onClickDate"
          @click-day-resource="onClickDayResource"
          @click-resource="onClickResource"
          @click-head-resources="onClickHeadResources"
          @click-head-day="onClickHeadDay"
        >
          <template #resource-days="{ scope }">
            <template
              v-for="(event, index) in getEvents(scope)"
              :key="index"
            >
              <q-badge
                outline
                color="primary"
                :label="event.title"
                :style="getStyle(event)"
              />
            </template>
          </template>
        </q-calendar-scheduler>
      </div>
    </div>
  </div>
</template>

<script>
import { QCalendarScheduler } from '@quasar/quasar-ui-qcalendar/src/QCalendarScheduler.js'
import { today } from '@quasar/quasar-ui-qcalendar/src/Timestamp.js'
import '@quasar/quasar-ui-qcalendar/src/QCalendarVariables.sass'
import '@quasar/quasar-ui-qcalendar/src/QCalendarTransitions.sass'
import '@quasar/quasar-ui-qcalendar/src/QCalendarScheduler.sass'

import { defineComponent } from 'vue'
import NavigationBar from '../components/NavigationBar.vue'

export default defineComponent({
  name: 'SchedulerSlotResourceDays',
  components: {
    NavigationBar,
    QCalendarScheduler
  },
  data () {
    return {
      selectedDate: today(),
      resourceWidth: 100,
      resourceHeight: 70,
      resourceMinHeight: 20,
      locale: 'en-US',
      resources: [
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
                { id: '2.2.3', name: 'Partition-C' }
              ]
            }
          ]
        },
        { id: '3', name: 'Mary' },
        { id: '4', name: 'Susan' },
        { id: '5', name: 'Olivia' }
      ],
      events: {
        '1': [ // John
          { dow: 1, title: 'Gym' },
          { dow: 3, title: 'Meeting: Olivia' },
          { dow: 4, title: 'Training', range: 2 }
        ],
        '2': [ // Board room

        ],
        '2.1': [ // Room-1
          { dow: 2, title: 'Board Meeting', range: 2 }
        ],
        '2.2': [ // Room-2

        ],
        '2.2.1': [ // Partition-A
          { dow: 4, title: 'Corporate Training', range: 2 }
        ],
        '2.2.2': [ // Partition-B

        ],
        '2.2.3': [ // Partition-C

        ],
        '3': [ // Mary
          { dow: 4, title: 'Corporate Training', range: 2 },
          // { start: '12:00', title: 'Lunch', duration: 60 }
        ],
        '4': [ // Susan
          { dow: 4, title: 'Corporate Training', range: 2 },
          // { start: '12:00', title: 'Lunch', duration: 60 }
        ],
        '5': [ // Olivia
          { dow: 4, title: 'Corporate Training', range: 2 },
          { dow: 3, title: 'Meeting: John' },
        ]
      }
    }
  },
  computed: {
    styles () {
      return {
        '--calendar-resources-width': 150 + 'px'
      }
    }
  },
  methods: {
    getEvents (scope) {
      const events = []
      if (this.events[ scope.resource.id ]) {
        // get events for the specified resource
        const resourceEvents = this.events[ scope.resource.id ]
        // make sure we have events
        if (resourceEvents && resourceEvents.length > 0) {
          // for each event figure out start position and width
          for (let x = 0; x < resourceEvents.length; ++x) {
            events.push({
              left: this.getLeft(scope, resourceEvents[ x ]),
              width: this.getWidth(scope, resourceEvents[ x ]),
              title: resourceEvents[ x ].title
            })
          }
        }
      }
      return events
    },

    getStyle (event) {
      return {
        position: 'absolute',
        background: 'white',
        left: event.left,
        width: event.width
      }
    },
    getLeft (scope, event) {
      const left = event.dow * parseFloat(scope.cellWidth)
      const val = left + (scope.cellWidth.endsWith('%') ? '%' : 'px')
      return val
    },
    getWidth (scope, event) {
      const width = (event.range ? event.range : 1) * parseFloat(scope.cellWidth)
      const val = width + (scope.cellWidth.endsWith('%') ? '%' : 'px')
      return val
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
    onResourceExpanded (data) {
      console.log('onResourceExpanded', data)
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

<style lang="sass" scoped>
.my-resource-header
  display: flex
  flex-direction: column
  flex: 1
  justify-content: center
  align-items: center
  position: relative
  font-size: 14px
  font-weight: 700
</style>