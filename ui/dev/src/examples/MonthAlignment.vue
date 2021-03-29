<template>
  <div class="subcontent">
    <navigation-bar
      @today="onToday"
      @prev="onPrev"
      @next="onNext"
    />

    <div style="display: flex; justify-content: center">
      <div class="button-bar" style="margin: 12px;">
        <div style="display: flex; align-items: center">
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

        <div style="display: flex; align-items: center">
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
    </div>

    <div style="display: flex; justify-content: center; align-items: center; flex-wrap: nowrap;">
      <div style="display: flex; max-width: 800px; width: 100%; height: 200px;">
        <q-calendar-month
          v-model="selectedDate"
          :weekday-align="weekdayAlign"
          :date-align="dateAlign"
          show-day-of-year-label
          animated
          bordered
          @change="onChange"
          @moved="onMoved"
          @click-date="onClickDate"
          @click-day="onClickDay"
          @click-workweek="onClickWorkweek"
          @click-head-workweek="onClickHeadWorkweek"
          @click-head-day="onClickHeadDay"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { QCalendarMonth } from '@quasar/quasar-ui-qcalendar/QCalendarMonth.js'
import { today } from '@quasar/quasar-ui-qcalendar/Timestamp.js'
import '@quasar/quasar-ui-qcalendar/QCalendarVariables.sass'
import '@quasar/quasar-ui-qcalendar/QCalendarTransitions.sass'
import '@quasar/quasar-ui-qcalendar/QCalendarMonth.sass'

import { defineComponent } from 'vue'
import NavigationBar from '../components/NavigationBar.vue'

export default defineComponent({
  name: 'MonthAlignment',
  components: {
    NavigationBar,
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
