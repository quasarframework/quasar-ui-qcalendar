<template>
  <div class="subcontent">
    <div class="line">The example below uses the <code class="token">selected-dates</code> property in conjunction with mouse events to toggle selected intervals.</div>

    <navigation-bar
      @today="onToday"
      @prev="onPrev"
      @next="onNext"
    />

    <div style="display: flex; justify-content: center; align-items: center; flex-wrap: nowrap;">
      <div style="display: flex; max-width: 800px; width: 100%; height: 400px;">
        <QCalendarDay
          ref="calendar"
          v-model="selectedDate"
          :interval-minutes="15"
          :interval-count="96"
          :interval-height="15"
          time-clicks-clamped
          :selected-dates="selectedDates"
          animated
          bordered
          @click-time="onToggleTime"
          @change="onChange"
          @moved="onMoved"
          @click-date="onClickDate"
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
  today,
  copyTimestamp,
  getDateTime
} from '@quasar/quasar-ui-qcalendar/Timestamp.js'
import { QCalendarDay } from '@quasar/quasar-ui-qcalendar/QCalendarDay.js'
import '@quasar/quasar-ui-qcalendar/QCalendarVariables.sass'
import '@quasar/quasar-ui-qcalendar/QCalendarTransitions.sass'
import '@quasar/quasar-ui-qcalendar/QCalendarDay.sass'

import { defineComponent } from 'vue'
import NavigationBar from '../components/NavigationBar.vue'

export default defineComponent({
  name: 'DaySelectedIntervals',
  components: {
    NavigationBar,
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
