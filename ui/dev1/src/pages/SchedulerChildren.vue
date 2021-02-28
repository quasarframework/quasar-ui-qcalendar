<template>
  <div class="subcontent">
    <navigation-bar
      @today="onToday"
      @prev="onPrev"
      @next="onNext"
    />

    <div style="display: flex; justify-content: center">
      <QCalendarScheduler
        ref="calendar"
        v-model="selectedDate"
        v-model:modelResources="resources"
        view="week"
        resource-key="id"
        resource-label="name"
        animated
        bordered
        style="max-width: 800px; width: 100%; max-height: 400px;"
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
</template>

<script>
import { QCalendarScheduler } from '@quasar/quasar-ui-qcalendar/QCalendarScheduler.js'
import { today } from '@quasar/quasar-ui-qcalendar/Timestamp.js'
import '@quasar/quasar-ui-qcalendar/QCalendarVariables.sass'
import '@quasar/quasar-ui-qcalendar/QCalendarTransitions.sass'
import '@quasar/quasar-ui-qcalendar/QCalendarScheduler.sass'

import { defineComponent } from 'vue'
import NavigationBar from '../components/NavigationBar.vue'

export default defineComponent({
  name: 'SchedulerBasic',
  components: {
    NavigationBar,
    QCalendarScheduler
  },
  data () {
    return {
      selectedDate: today(),
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
                { id: '2.2.2', name: 'Partition-C' }
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
