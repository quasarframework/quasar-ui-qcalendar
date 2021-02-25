<template>
  <div class="subcontent">
    <navigation-bar
      @today="onToday"
      @prev="onPrev"
      @next="onNext"
    />

    <div style="display: flex; justify-content: center; align-items: center;">
      <div class="button">
        <input
          id="1char"
          v-model="dateType"
          value="round"
          type="radio"
        >
        <label for="1char">round</label>
      </div>
      <div class="button">
        <input
          id="2char"
          v-model="dateType"
          value="square"
          type="radio"
        >
        <label for="2char">square</label>
      </div>
    </div>

    <div style="display: flex; justify-content: center">
      <QCalendarScheduler
        ref="calendar"
        v-model="selectedDate"
        v-model:modelResources="resources"
        view="week"
        :date-type="dateType"
        animated
        bordered
        style="max-width: 800px; width: 100%; display: inline-flex;"
        @change="onChange"
        @moved="onMoved"
        @click-date="onClickDate"
        @click-day-resource="onClickDayResource"
        @click-resource="onClickResource"
        @click-head-resources="onClickHeadResources"
        @click-head-day="onClickHeadDay"
      />
    </div>
  </div>
</template>

<script>
import { QCalendarScheduler } from '@quasar/quasar-ui-qcalendar/QCalendarScheduler.js'
import { today } from '@quasar/quasar-ui-qcalendar/Timestamp.js'
import '@quasar/quasar-ui-qcalendar/QCalendarVariables.sass'
import '@quasar/quasar-ui-qcalendar/QCalendarTransitions.sass'
import '@quasar/quasar-ui-qcalendar/QCalendarScheduler.sass'

import { defineComponent } from 'vue'
import NavigationBar from '../components/NavigationBar.vue'

export default defineComponent({
  name: 'SchedulerDark',
  components: {
    NavigationBar,
    QCalendarScheduler
  },
  data () {
    return {
      selectedDate: today(),
      dateType: 'square',
      resources: [
        { id: 1, label: 'John' },
        { id: 2, label: 'Mary' },
        { id: 3, label: 'Susan' },
        { id: 4, label: 'Olivia' },
        { id: 5, label: 'Board Room' },
        { id: 6, label: 'Room-1' },
        { id: 7, label: 'Room-2' }
      ]
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
    onClickDayResource (data) {
      console.log('onClickDayResource', data)
    },
    onClickResource (data) {
      console.log('onClickResource', data)
    },
    onClickHeadResources (data) {
      console.log('onClickHeadResources', data)
    },
    onClickHeadDay (data) {
      console.log('onClickHeadDay', data)
    }
  }
})
</script>
