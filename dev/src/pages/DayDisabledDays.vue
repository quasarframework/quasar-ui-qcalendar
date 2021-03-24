<template>
  <div class="subcontent">
    <div class="line">The next 4 days after the current day have been disabled with the <code class="token">disabled-days</code> property.</div>

    <navigation-bar
      @today="onToday"
      @prev="onPrev"
      @next="onNext"
    />

    <div style="display: flex; justify-content: center; align-items: center; flex-wrap: nowrap;">
      <div style="display: flex; max-width: 800px; width: 100%; height: 400px;">
        <q-calendar-day
          ref="calendar"
          v-model="selectedDate"
          :disabled-days="disabledDays"
          no-active-date
          animated
          bordered
          transition-next="slide-left"
          transition-prev="slide-right"
          @change="onChange"
          @moved="onMoved"
          @click-date="onClickDate"
          @click-time="onClickTime"
          @click-interval="onClickInterval"
          @click-head-intervals="onClickHeadIntervals"
          @click-head-day="onClickHeadDay"
        />
      </div>
    </div>
  </div>
</template>

<script>
import {
  addToDate,
  parseTimestamp,
  today
} from '@quasar/quasar-ui-qcalendar/Timestamp.js'
import { QCalendarDay } from '@quasar/quasar-ui-qcalendar/QCalendarDay.js'
import '@quasar/quasar-ui-qcalendar/QCalendarVariables.sass'
import '@quasar/quasar-ui-qcalendar/QCalendarTransitions.sass'
import '@quasar/quasar-ui-qcalendar/QCalendarDay.sass'

import { defineComponent } from 'vue'
import NavigationBar from '../components/NavigationBar.vue'

export default defineComponent({
  name: 'DayDisabledDays',
  components: {
    NavigationBar,
    QCalendarDay
  },
  data () {
    return {
      selectedDate: today()
    }
  },
  computed: {
    disabledDays () {
      const days = []
      const ts = parseTimestamp(today())
      // make next 4 days, after today, disabled
      Array.from(Array(4)).forEach((_, i) => {
        days.push(addToDate(ts, { day: i + 1 }).date)
      })
      return days
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
    onClickTime (data) {
      console.log('onClickTime', data)
    },
    onClickInterval (data) {
      console.log('onClickInterval', data)
    },
    onClickHeadIntervals (data) {
      console.log('onClickHeadIntervals', data)
    },
    onClickHeadDay (data) {
      console.log('onClickHeadDay', data)
    }
  }
})
</script>
