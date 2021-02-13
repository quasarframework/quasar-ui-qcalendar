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
    :disabled-before="disabledBefore"
    :disabled-after="disabledAfter"
    no-active-date
    animated
    transition-next="slide-left"
    transition-prev="slide-right"
    style="max-width: 800px; width: 100%; height: 400px; display: inline-flex;"
    @change="onChange"
    @moved="onMoved"
    @click-date="onClickDate"
    @click-time="onClickTime"
    @click-interval="onClickInterval"
    @click-head-intervals="onClickHeadIntervals"
    @click-head-day="onClickHeadDay"
  />
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

export default defineComponent({
  name: 'WeekDisabledBeforeAfter',
  components: {
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

<style lang="sass" scoped>
.button
  margin: 5px 2px 10px 5px
</style>
