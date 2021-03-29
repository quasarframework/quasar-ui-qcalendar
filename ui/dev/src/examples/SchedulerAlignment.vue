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
      <div style="display: flex; justify-content: center; align-items: center; flex-wrap: nowrap;">
        <label
          for="date-header"
          style="margin-right: 2px;"
        >date-header:</label>
        <select
          id="date-header"
          v-model="dateHeader"
          class="button select"
        >
          <option>stacked</option>
          <option>inline</option>
          <option>inverted</option>
        </select>
      </div>

      <div style="display: flex; justify-content: center; align-items: center; flex-wrap: nowrap;">
        <label
          for="date-align"
          style="margin-right: 2px;"
        >date-align:</label>
        <select
          id="date-align"
          v-model="dateAlign"
          class="button select"
        >
          <option>center</option>
          <option>left</option>
          <option>right</option>
        </select>
      </div>

      <div style="display: flex; justify-content: center; align-items: center; flex-wrap: nowrap;">
        <label
          for="weekday-align"
          style="margin-right: 2px;"
        >weekday-align:</label>
        <select
          id="weekday-align"
          v-model="weekdayAlign"
          class="button select"
        >
          <option>center</option>
          <option>left</option>
          <option>right</option>
        </select>
      </div>
    </div>

    <div style="display: flex; justify-content: center; align-items: center; flex-wrap: nowrap;">
      <div style="display: flex; max-width: 800px; width: 100%; height: 400px;">
        <q-calendar-scheduler
          ref="calendar"
          v-model="selectedDate"
          v-model:modelResources="resources"
          view="week"
          short-weekday-label
          :date-header="dateHeader"
          :weekday-align="weekdayAlign"
          :date-align="dateAlign"
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
import { QCalendarScheduler } from '@quasar/quasar-ui-qcalendar/QCalendarScheduler.js'
import { today } from '@quasar/quasar-ui-qcalendar/Timestamp.js'
import '@quasar/quasar-ui-qcalendar/QCalendarVariables.sass'
import '@quasar/quasar-ui-qcalendar/QCalendarTransitions.sass'
import '@quasar/quasar-ui-qcalendar/QCalendarScheduler.sass'

import { defineComponent } from 'vue'
import NavigationBar from '../components/NavigationBar.vue'

export default defineComponent({
  name: 'SchedulerAlignment',
  components: {
    NavigationBar,
    QCalendarScheduler
  },
  data () {
    return {
      selectedDate: today(),
      dateAlign: 'center',
      weekdayAlign: 'center',
      dateHeader: 'stacked',
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
