<template>
  <div class="subcontent">
    <navigation-bar
      @today="onToday"
      @prev="onPrev"
      @next="onNext"
    />

    <div style="display: flex; justify-content: center">
      <QCalendarDay
        ref="calendar"
        v-model="selectedDate"
        view="week"
        :disabled-before="disabledBefore"
        :disabled-after="disabledAfter"
        no-active-date
        animated
        bordered
        transition-next="slide-left"
        transition-prev="slide-right"
        style="max-width: 800px; width: 100%; height: 400px;"
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
</template>

<script>
import { QCalendarDay } from '@quasar/quasar-ui-qcalendar/QCalendarDay.js'
import {
  addToDate,
  parseTimestamp,
  today
} from '@quasar/quasar-ui-qcalendar/Timestamp.js'
import '@quasar/quasar-ui-qcalendar/QCalendarVariables.sass'
import '@quasar/quasar-ui-qcalendar/QCalendarTransitions.sass'
import '@quasar/quasar-ui-qcalendar/QCalendarDay.sass'

import { defineComponent } from 'vue'
import NavigationBar from '../components/NavigationBar.vue'

export default defineComponent({
  name: 'WeekDisabledBeforeAfter',
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
    disabledBefore () {
      // find the monday of this week
      const monday = 1 // day of week (ts.weekday)
      let ts = parseTimestamp(today())
      ts = addToDate(ts, { day: (ts.weekday > monday ? -(ts.weekday - monday) : (monday - ts.weekday)) })
      return ts.date
    },

    disabledAfter () {
      // find the 1st day of the next month
      const friday = 5 // day of week (ts.weekday)
      let ts = parseTimestamp(today())
      // get days in month
      ts = addToDate(ts, { day: (ts.weekday > friday ? -(ts.weekday - friday) : (friday - ts.weekday)) })
      return ts.date
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
