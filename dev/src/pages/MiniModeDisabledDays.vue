<template>
  <div class="subcontent">
    <div class="line">
      The first example uses an array of dates to disable the next 4 days after today.<br>
      The second example uses a range (which is an array within an array) to disable the next 4 days after today.<br>
      Don't be confused with disabled "outside" days which are not part of the current month.
    </div>

    <navigation-bar
      @today="onToday"
      @prev="onPrev"
      @next="onNext"
    />

    <div style="display: flex; justify-content: center; width: 100%;">
      <div style="display: flex; flex-direction: column; max-width: 280px; width: 100%;">
        <q-calendar-month
          ref="calendar"
          v-model="selectedDate"
          mini-mode
          :disabled-days="disabledDays"
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
        <q-calendar-month
          ref="calendar2"
          v-model="selectedDate"
          mini-mode
          :disabled-days="disabledDaysRange"
          animated
          bordered
          style="max-width: 280px; width: 100%;"
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
import {
  addToDate,
  parseTimestamp,
  today
} from '@quasar/quasar-ui-qcalendar/Timestamp.js'
import { QCalendarMonth } from '@quasar/quasar-ui-qcalendar/QCalendarMonth.js'
import '@quasar/quasar-ui-qcalendar/QCalendarVariables.sass'
import '@quasar/quasar-ui-qcalendar/QCalendarTransitions.sass'
import '@quasar/quasar-ui-qcalendar/QCalendarMonth.sass'

import { defineComponent } from 'vue'
import NavigationBar from '../components/NavigationBar.vue'

export default defineComponent({
  name: 'MiniModeDisabledDays',
  components: {
    NavigationBar,
    QCalendarMonth
  },
  data () {
    return {
      selectedDate: today(),
      disabledDays: [],
      disabledDaysRange: []
    }
  },
  beforeMount () {
    // calculate the disabled days - next 4 days from today
    let firstDisabledDate, lastDisabledDate, tm = parseTimestamp(this.selectedDate)
    for (let index = 0; index < 4; ++index) {
      tm = addToDate(tm, { day: 1 })
      // push into disabledDays
      this.disabledDays.push(tm.date)
      // is this first disabled date?
      if (index === 0) {
        firstDisabledDate = tm.date
      }
      // is this last disabled date?
      else if (index === 3) {
        lastDisabledDate = tm.date
      }
    }
    // add the range
    this.disabledDaysRange.push([ firstDisabledDate, lastDisabledDate ])
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
