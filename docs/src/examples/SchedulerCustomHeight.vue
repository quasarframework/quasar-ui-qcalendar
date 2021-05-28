<template>
  <div class="subcontent">
    <navigation-bar
      @today="onToday"
      @prev="onPrev"
      @next="onNext"
    />

    <div class="row justify-center">
      <div style="display: flex; max-width: 800px; width: 100%; max-height: 400px;">
        <q-calendar-scheduler
          ref="calendar"
          v-model="selectedDate"
          v-model:modelResources="resources"
          resource-key="id"
          resource-label="name"
          bordered
          :resource-min-height="0"
          @change="onChange"
          @moved="onMoved"
          @resource-expanded="onResourceExpanded"
          @click-date="onClickDate"
          @click-day-resource="onClickDayResource"
          @click-resource="onClickResource"
          @click-head-resources="onClickHeadResources"
          @click-head-day="onClickHeadDay"
        />
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
  name: 'SchedulerCustomHeight',
  components: {
    NavigationBar,
    QCalendarScheduler
  },
  data () {
    return {
      selectedDate: today(),
      resources: [
        { id: '1', name: 'John', height: 20 },
        {
          id: '2',
          name: 'Board Room',
          height: 40,
          expanded: false,
          children: [
            { id: '2.1', name: 'Room-1', height: 20 },
            {
              id: '2.2',
              name: 'Room-2',
              height: 40,
              expanded: false,
              children: [
                { id: '2.2.1', name: 'Partition-A', height: 20 },
                { id: '2.2.2', name: 'Partition-B', height: 20 },
                { id: '2.2.2', name: 'Partition-C', height: 20 }
              ]
            }
          ]
        },
        { id: '3', name: 'Mary' },
        { id: '4', name: 'Susan' },
        { id: '5', name: 'Olivia' }
      ]
    }
  },
  methods: {
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
    onResourceExpanded (data) {
      console.log('onResourceExpanded', data)
    },
    onClickResource (data) {
      console.log('onClickResource', data)
      if (data.scope.resource.expanded !== undefined) {
        // data.scope.resource.expanded = !data.scope.resource.expanded
      }
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
