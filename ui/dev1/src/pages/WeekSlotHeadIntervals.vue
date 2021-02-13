<template>
  <QCalendarDay
    ref="calendar"
    v-model="selectedDate"
    view="week"
    style="max-width: 800px; width: 100%; height: 400px; display: inline-flex;"
    @change="onChange"
    @moved="onMoved"
    @click-date="onClickDate"
    @click-time="onClickTime"
    @click-interval="onClickInterval"
    @click-head-intervals="onClickHeadIntervals"
    @click-head-day="onClickHeadDay"
  >
    <template #head-intervals="{ scope }">
      <div style="display: flex; justify-content: center; flex-direction: column; width: 100%; font-size: 10px; font-weight: 700;">
        <span>Showing: {{ scope.days.length }} days</span>
      </div>
    </template>
  </QCalendarDay>
</template>

<script>
import { QCalendarDay } from '@quasar/quasar-ui-qcalendar/QCalendarDay.js'
import { today } from '@quasar/quasar-ui-qcalendar/Timestamp.js'
import '@quasar/quasar-ui-qcalendar/QCalendarVariables.sass'
import '@quasar/quasar-ui-qcalendar/QCalendarTransitions.sass'
import '@quasar/quasar-ui-qcalendar/QCalendarDay.sass'

import { defineComponent } from 'vue'

export default defineComponent({
  name: 'WeekSlotHeadIntervals',
  components: {
    QCalendarDay
  },
  data () {
    return {
      selectedDate: today()
    }
  },
  methods: {
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
