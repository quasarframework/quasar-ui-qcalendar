<template>
  <div class="subcontent">
    <div class="line">
      The next 4 days after the current day have been disabled with the <code class="example-token">disabled-days</code> property.<br>
      The first example uses an array of dates to disable each specific date.<br>
      The second example uses a range, which is an array within an array of start and end dates.<br>
    </div>

    <navigation-bar
      @today="onToday"
      @prev="onPrev"
      @next="onNext"
    />

    <div class="row justify-center">
      <div class="q-gutter-md" style="display: flex; flex-direction: column; max-width: 800px; width: 90%; height: 500px;">
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
        <q-calendar-day
          ref="calendar2"
          v-model="selectedDate"
          :disabled-days="disabledDaysRange"
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
  QCalendarDay,
  addToDate,
  parseTimestamp,
  today
} from '@quasar/quasar-ui-qcalendar'
import '@quasar/quasar-ui-qcalendar/src/QCalendarVariables.sass'
import '@quasar/quasar-ui-qcalendar/src/QCalendarTransitions.sass'
import '@quasar/quasar-ui-qcalendar/src/QCalendarDay.sass'

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
    },

    disabledDaysRange () {
      // create the range for example 2
      // Note: this is an array, within an array
      return [[ this.disabledDays[ 0 ], this.disabledDays[ this.disabledDays.length - 1 ] ]]
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
