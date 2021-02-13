<template>
  <div style="margin: 12px; display: inline-flex;">
    <div style="width: 200px;">
      <label
        for="date-header"
        style="margin-right: 2px;"
      >date-header:</label>
      <select
        id="date-header"
        v-model="dateHeader"
      >
        <option>stacked</option>
        <option>inline</option>
        <option>inverted</option>
      </select>
    </div>

    <div style="width: 200px;">
      <label
        for="date-align"
        style="margin-right: 2px;"
      >date-align:</label>
      <select
        id="date-align"
        v-model="dateAlign"
      >
        <option>center</option>
        <option>left</option>
        <option>right</option>
      </select>
    </div>

    <div style="width: 200px;">
      <label
        for="weekday-align"
        style="margin-right: 2px;"
      >weekday-align:</label>
      <select
        id="weekday-align"
        v-model="weekdayAlign"
      >
        <option>center</option>
        <option>left</option>
        <option>right</option>
      </select>
    </div>
  </div>

  <div style="margin: 12px;">
    <button
      class="button"
      style="margin: 2px;"
      @click="onToday"
    >
      Today
    </button>
    <button
      class="button"
      style="margin: 2px;"
      @click="onPrev"
    >
      &lt; Prev
    </button>
    <button
      class="button"
      style="margin: 2px;"
      @click="onNext"
    >
      Next &gt;
    </button>
  </div>

  <div style="margin: 10px;">
    <QCalendarScheduler
      ref="calendar"
      v-model="selectedDate"
      v-model:modelResources="resources"
      view="week"
      short-weekday-label
      :date-header="dateHeader"
      :weekday-align="weekdayAlign"
      :date-align="dateAlign"
      bordered
      style="max-width: 800px; width: 100%; display: inline-flex;"
      @change="onChange"
      @moved="onMoved"
      @click-date="onClickDate"
      @click-day-resource="onClickDayResource"
      @click-resource="onClickResource"
      @click-head-resources="onClickHeadResources"
      @click-head-day="onClickHeadDay"
    />
  </div>
</template>

<script>
import { QCalendarScheduler } from '@quasar/quasar-ui-qcalendar/QCalendarScheduler.js'
import { today } from '@quasar/quasar-ui-qcalendar/Timestamp.js'
import '@quasar/quasar-ui-qcalendar/QCalendarVariables.sass'
import '@quasar/quasar-ui-qcalendar/QCalendarTransitions.sass'
import '@quasar/quasar-ui-qcalendar/QCalendarScheduler.sass'

import { defineComponent } from 'vue'

export default defineComponent({
  name: 'SchedulerAlignment',
  components: {
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
