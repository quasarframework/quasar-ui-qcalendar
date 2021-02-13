<template>
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

  <QCalendarDay
    ref="calendar"
    v-model="selectedDate"
    view="week"
    style="max-width: 800px; width: 100%; height: 400px; display: inline-flex;"
    :interval-minutes="15"
    :interval-count="96"
    :interval-height="15"
    time-clicks-clamped
    :selected-dates="selectedDates"
    @click-time="onToggleTime"
    @change="onChange"
    @moved="onMoved"
    @click-date="onClickDate"
    @click-interval="onClickInterval"
    @click-head-intervals="onClickHeadIntervals"
    @click-head-day="onClickHeadDay"
  />
</template>

<script>
import { QCalendarDay } from '@quasar/quasar-ui-qcalendar/QCalendarDay.js'
import {
  today,
  copyTimestamp,
  getDateTime
} from '@quasar/quasar-ui-qcalendar/Timestamp.js'
import '@quasar/quasar-ui-qcalendar/QCalendarVariables.sass'
import '@quasar/quasar-ui-qcalendar/QCalendarTransitions.sass'
import '@quasar/quasar-ui-qcalendar/QCalendarDay.sass'

import { defineComponent } from 'vue'

export default defineComponent({
  name: 'WeekSelectedIntervals',
  components: {
    QCalendarDay
  },
  data () {
    return {
      selectedDate: today(),
      selectedDates: []
    }
  },
  methods: {
    onToggleTime ({ scope }) {
      console.log('click-time (scope)', scope)
      if (scope === undefined) {
        return
      }

      // make a copy of the timestamp
      const ts = copyTimestamp(scope.timestamp)

      // get date with time
      const t = getDateTime(ts)

      // toggle to/from array
      if (this.selectedDates.includes(t)) {
        // remove the date
        for (let i = 0; i < this.selectedDates.length; ++i) {
          if (t === this.selectedDates[ i ]) {
            this.selectedDates.splice(i, 1)
            break
          }
        }
      }
      else {
        // add the date if not outside
        if (scope.outside !== true) {
          this.selectedDates.push(t)
        }
      }
    },

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
    // onClickTime (data) {
    //   console.log('onClickTime', data)
    // },
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
