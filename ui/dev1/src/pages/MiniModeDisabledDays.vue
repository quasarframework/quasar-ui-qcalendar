<template>
  <div style="margin: 12px;">
    <div style="width: 100%">
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
    <div style="font-size: 12px;">The first example uses an array of dates to disable the next 4 days after today.<br>The second example uses a range (which is an array within an array) to disable the next 4 days after today.</div>
  </div>

  <div style="width: 100%; display: flex; justify-content: center; margin: 12px;">
    <QCalendarMonth
      ref="calendar"
      v-model="selectedDate"
      mini-mode
      :disabled-days="disabledDays"
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
  <div style="width: 100%; display: flex; justify-content: center; margin: 12px;">
    <QCalendarMonth
      ref="calendar"
      v-model="selectedDate"
      mini-mode
      :disabled-days="disabledDaysRange"
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
</template>

<script>
import { QCalendarMonth } from '@quasar/quasar-ui-qcalendar/QCalendarMonth.js'
import {
  addToDate,
  parseTimestamp,
  today
} from '@quasar/quasar-ui-qcalendar/Timestamp.js'
import '@quasar/quasar-ui-qcalendar/QCalendarVariables.sass'
import '@quasar/quasar-ui-qcalendar/QCalendarTransitions.sass'
import '@quasar/quasar-ui-qcalendar/QCalendarMonth.sass'

import { defineComponent } from 'vue'

export default defineComponent({
  name: 'MiniModeDisabledDays',
  components: {
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
