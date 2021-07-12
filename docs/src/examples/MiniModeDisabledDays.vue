<template>
  <div class="subcontent">

    <navigation-bar
      @today="onToday"
      @prev="onPrev"
      @next="onNext"
    />

    <div class="row justify-center">
      <div class="q-gutter-md" style="display: flex; flex-direction: column; max-width: 280px; width: 100%;">
        <q-calendar-month
          ref="calendar"
          v-model="selectedDate"
          mini-mode
          :disabled-days="disabledDays"
          no-outside-days
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
          no-outside-days
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
  QCalendarMonth,
  addToDate,
  parseTimestamp,
  today
} from '@quasar/quasar-ui-qcalendar/src/index.js'
import '@quasar/quasar-ui-qcalendar/src/QCalendarVariables.sass'
import '@quasar/quasar-ui-qcalendar/src/QCalendarTransitions.sass'
import '@quasar/quasar-ui-qcalendar/src/QCalendarMonth.sass'

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
