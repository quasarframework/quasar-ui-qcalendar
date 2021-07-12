<template>
  <div class="subcontent">
    <navigation-bar
      @today="onToday"
      @prev="onPrev"
      @next="onNext"
    />

    <div class="q-ma-sm row justify-center">
      <q-radio
        v-model="dateType"
        val="round"
        label="round"
        dense
        style="min-width: 100px;"
      />
      <q-radio
        v-model="dateType"
        val="rounded"
        label="rounded"
        dense
        style="min-width: 100px;"
      />
      <q-radio
        v-model="dateType"
        val="square"
        label="square"
        dense
        style="min-width: 100px;"
      />
    </div>

    <div class="row justify-center">
      <div style="display: flex; max-width: 800px; width: 100%; height: 400px;">
        <q-calendar-scheduler
          ref="calendar"
          v-model="selectedDate"
          v-model:model-resources="resources"
          view="week"
          :date-type="dateType"
          animated
          bordered
          @change="onChange"
          @moved="onMoved"
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
import { QCalendarScheduler, today } from '@quasar/quasar-ui-qcalendar/src/index.js'
import '@quasar/quasar-ui-qcalendar/src/QCalendarVariables.sass'
import '@quasar/quasar-ui-qcalendar/src/QCalendarTransitions.sass'
import '@quasar/quasar-ui-qcalendar/src/QCalendarScheduler.sass'

import { defineComponent } from 'vue'
import NavigationBar from '../components/NavigationBar.vue'

export default defineComponent({
  name: 'SchedulerDateType',
  components: {
    NavigationBar,
    QCalendarScheduler
  },
  data () {
    return {
      selectedDate: today(),
      dateType: 'square',
      resources: [
        { id: 1, label: 'John' },
        { id: 2, label: 'Mary' },
        { id: 3, label: 'Susan' },
        { id: 4, label: 'Olivia' },
        { id: 5, label: 'Board Room' },
        { id: 6, label: 'Room-1' },
        { id: 7, label: 'Room-2' }
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
