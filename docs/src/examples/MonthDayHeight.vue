<template>
  <div class="subcontent">
    <navigation-bar
      @today="onToday"
      @prev="onPrev"
      @next="onNext"
    />

    <div class="row no-wrap" style="width: 600px;">
      <span class="col-shrink no-wrap" style="min-width: 142px;">Day Height:</span>
      <q-slider
        v-model="dayHeight"
        :min="0"
        :max="200"
        label
        label-always
        :label-value="dayHeight + 'px'"
        class="col"
      />
    </div>

    <div class="row no-wrap" style="width: 600px;">
      <span class="col-shrink no-wrap" style="min-width: 142px;">Day Min. Height:</span>
      <q-slider
        v-model="dayMinHeight"
        :min="0"
        :max="200"
        label
        label-always
        :label-value="dayMinHeight + 'px'"
        class="col"
      />
    </div>

    <div class="row justify-center">
      <div style="display: flex; max-width: 800px; width: 100%;">
        <q-calendar-month
          ref="calendar"
          v-model="selectedDate"
          :day-height="dayHeight"
          :day-min-height="dayMinHeight"
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
  name: 'MonthDayHeight',
  components: {
    NavigationBar,
    QCalendarMonth
  },
  data () {
    return {
      selectedDate: today(),
      dayHeight: 50,
      dayMinHeight: 50
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
