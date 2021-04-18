<template>
  <div class="subcontent">
    <navigation-bar
      @today="onToday"
      @prev="onPrev"
      @next="onNext"
    />

    <div class="q-ma-sm row justify-center">
      <q-radio
        v-model="dateType"
        val="round"
        label="round"
        dense
        style="min-width: 100px;"
      />
      <q-radio
        v-model="dateType"
        val="square"
        label="square"
        dense
        style="min-width: 100px;"
      />
    </div>

    <div class="row justify-center">
      <div style="display: flex; max-width: 800px; width: 100%; height: 400px;">
        <q-calendar-month
          ref="calendar"
          v-model="selectedDate"
          :date-type="dateType"
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
import { QCalendarMonth } from '@quasar/quasar-ui-qcalendar/src/QCalendarMonth.js'
import { today } from '@quasar/quasar-ui-qcalendar/src/Timestamp.js'
import '@quasar/quasar-ui-qcalendar/src/QCalendarVariables.sass'
import '@quasar/quasar-ui-qcalendar/src/QCalendarTransitions.sass'
import '@quasar/quasar-ui-qcalendar/src/QCalendarMonth.sass'

import { defineComponent } from 'vue'
import NavigationBar from '../components/NavigationBar.vue'

export default defineComponent({
  name: 'MonthDark',
  components: {
    NavigationBar,
    QCalendarMonth
  },
  data () {
    return {
      selectedDate: today(),
      dateType: 'square'
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
