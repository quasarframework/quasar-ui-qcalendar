<template>
  <div class="subcontent">
    <navigation-bar
      @today="onToday"
      @prev="onPrev"
      @next="onNext"
    />

    <div class="row justify-center">
      <div style="display: flex; max-width: 800px; width: 100%; height: 400px;">
        <q-calendar-resource
          ref="calendar"
          v-model="selectedDate"
          v-model:modelResources="resources"
          resource-key="id"
          resource-label="name"
          :interval-start="6"
          :interval-count="12"
          animated
          bordered
          @change="onChange"
          @moved="onMoved"
          @resource-expanded="onResourceExpanded"
          @click-date="onClickDate"
          @click-time="onClickTime"
          @click-resource="onClickResource"
          @click-head-resources="onClickHeadResources"
          @click-interval="onClickInterval"
        >
          <template #resource-intervals="{ scope }">
            <template v-for="(event, index) in getEvents(scope)" :key="index">
              <q-badge outline color="primary" :label="event.title" :style="getStyle(event)" />
            </template>
          </template>

        </q-calendar-resource>
      </div>
    </div>
  </div>
</template>

<script>
import { QCalendarResource } from '@quasar/quasar-ui-qcalendar/src/QCalendarResource.js'
import { today } from '@quasar/quasar-ui-qcalendar/src/Timestamp.js'
import '@quasar/quasar-ui-qcalendar/src/QCalendarVariables.sass'
import '@quasar/quasar-ui-qcalendar/src/QCalendarTransitions.sass'
import '@quasar/quasar-ui-qcalendar/src/QCalendarResource.sass'

import { defineComponent } from 'vue'
import NavigationBar from '../components/NavigationBar.vue'

export default defineComponent({
  name: 'ResourceSlotResourceIntervals',
  components: {
    NavigationBar,
    QCalendarResource
  },
  data () {
    return {
      selectedDate: today(),
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
          { start: '06:00', title: 'Gym', duration: 90 },
          { start: '08:00', title: 'Corporate Training - Partition A (Train new hires)', duration: 240 },
          { start: '12:00', title: 'Lunch', duration: 60 }
        ],
        '2': [ // Board room

        ],
        '2.1': [ // Room-1
          { start: '08:00', title: 'Board Meeting', duration: 120 }
        ],
        '2.2': [ // Room-2

        ],
        '2.2.1': [ // Partition-A
          { start: '08:00', title: 'Corporate Training', duration: 240 },
        ],
        '2.2.2': [ // Partition-B

        ],
        '2.2.3': [ // Partition-C

        ],
        '3': [ // Mary
          { start: '08:00', title: 'Corporate Training - Partition A', duration: 240 },
          { start: '12:00', title: 'Lunch', duration: 60 }
        ],
        '4': [ // Susan
          { start: '08:00', title: 'Corporate Training - Partition A', duration: 240 },
          { start: '12:00', title: 'Lunch', duration: 60 }
        ],
        '5': [ // Olivia
          { start: '08:00', title: 'Corporate Training - Partition A', duration: 240 },
          { start: '12:00', title: 'Lunch', duration: 60 }
        ]
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
          // for each events figure out start position and width
          for (let x = 0; x < resourceEvents.length; ++x) {
            events.push({
              left: scope.timeStartPosX(resourceEvents[ x ].start),
              width: scope.timeDurationWidth(resourceEvents[ x ].duration),
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
        left: event.left + 'px',
        width: event.width + 'px'
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
    onResourceExpanded (data) {
      console.log('onResourceExpanded', data)
    },
    onClickDate (data) {
      console.log('onClickDate', data)
    },
    onClickTime (data) {
      console.log('onClickTime', data)
    },
    onClickResource (data) {
      console.log('onClickResource', data)
    },
    onClickHeadResources (data) {
      console.log('onClickHeadResources', data)
    },
    onClickInterval (data) {
      console.log('onClickInterval', data)
    }
  }
})
</script>
