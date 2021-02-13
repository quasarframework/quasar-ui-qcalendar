<template>
  <div style="margin: 12px; display: inline-flex;">
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

  <div style="margin: 10px;">
    <QCalendarMonth
      v-model="selectedDate"
      :weekday-align="weekdayAlign"
      :date-align="dateAlign"
      show-day-of-year-label
      bordered
      style="max-width: 800px; width: 100%; height: 200px; display: inline-flex;"
      @change="onChange"
      @moved="onMoved"
      @click-date="onClickDate"
      @click-day="onClickDay"
      @click-workweek="onClickWorkweek"
      @click-head-workweek="onClickHeadWorkweek"
      @click-head-day="onClickHeadDay"
    />
  </div>
</template>

<script>
import { QCalendarMonth } from '@quasar/quasar-ui-qcalendar/QCalendarMonth.js'
import { today } from '@quasar/quasar-ui-qcalendar/Timestamp.js'
import '@quasar/quasar-ui-qcalendar/QCalendarVariables.sass'
import '@quasar/quasar-ui-qcalendar/QCalendarTransitions.sass'
import '@quasar/quasar-ui-qcalendar/QCalendarMonth.sass'

import { defineComponent } from 'vue'

export default defineComponent({
  name: 'MonthAlignment',
  components: {
    QCalendarMonth
  },
  data () {
    return {
      selectedDate: today(),
      dateAlign: 'center',
      weekdayAlign: 'center'
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
    onClickDay (data) {
      console.log('onClickDay', data)
    },
    onClickWorkweek (data) {
      console.log('onClickWorkweek', data)
    },
    onClickHeadDay (data) {
      console.log('onClickHeadDay', data)
    },
    onClickHeadWorkweek (data) {
      console.log('onClickHeadWorkweek', data)
    }
  }
})
</script>
