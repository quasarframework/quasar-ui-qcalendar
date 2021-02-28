<template>
  <div class="subcontent">
    <div class="line">You can use the properties <code class="token">date-header</code>, <code class="token">date-align</code> and <code class="token">weekday-align</code> to manipulate how the header area looks.</div>

    <div
      class="button-bar"
      style="margin: 12px;"
    >
      <div style="display: flex; justify-content: center; align-items: center; flex-wrap: nowrap;">
        <label
          for="date-header"
          style="margin-right: 2px;"
        >date-header:</label>
        <select
          id="date-header"
          v-model="dateHeader"
          class="button select"
        >
          <option>stacked</option>
          <option>inline</option>
          <option>inverted</option>
        </select>
      </div>

      <div style="display: flex; justify-content: center; align-items: center; flex-wrap: nowrap;">
        <label
          for="date-align"
          style="margin-right: 2px;"
        >date-align:</label>
        <select
          id="date-align"
          v-model="dateAlign"
          class="button select"
        >
          <option>center</option>
          <option>left</option>
          <option>right</option>
        </select>
      </div>

      <div style="display: flex; justify-content: center; align-items: center; flex-wrap: nowrap;">
        <label
          for="weekday-align"
          style="margin-right: 2px;"
        >weekday-align:</label>
        <select
          id="weekday-align"
          v-model="weekdayAlign"
          class="button select"
        >
          <option>center</option>
          <option>left</option>
          <option>right</option>
        </select>
      </div>
    </div>

    <navigation-bar
      @today="onToday"
      @prev="onPrev"
      @next="onNext"
    />

    <div style="display: flex; justify-content: center">
      <QCalendarAgenda
        ref="calendar"
        v-model="selectedDate"
        view="week"
        short-weekday-label
        :date-header="dateHeader"
        :weekday-align="weekdayAlign"
        :date-align="dateAlign"
        :left-column-options="leftColumnOptions"
        :right-column-options="rightColumnOptions"
        column-options-id="id"
        column-options-label="label"
        :day-min-height="200"
        bordered
        animated
        style="max-width: 800px; width: 100%; height: 200px;"
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
import { QCalendarAgenda } from '@quasar/quasar-ui-qcalendar/QCalendarAgenda.js'
import { today } from '@quasar/quasar-ui-qcalendar/Timestamp.js'
import '@quasar/quasar-ui-qcalendar/QCalendarVariables.sass'
import '@quasar/quasar-ui-qcalendar/QCalendarTransitions.sass'
import '@quasar/quasar-ui-qcalendar/QCalendarAgenda.sass'

import { defineComponent } from 'vue'
import NavigationBar from '../components/NavigationBar.vue'

export default defineComponent({
  name: 'DayAlignment',
  components: {
    NavigationBar,
    QCalendarAgenda
  },
  data () {
    return {
      selectedDate: today(),
      dateAlign: 'center',
      weekdayAlign: 'center',
      dateHeader: 'stacked',
      leftColumnOptions: [
        {
          id: 1,
          label: 'Left 1'
        },
        {
          id: 2,
          label: 'Left 2'
        }
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
