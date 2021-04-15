<template>
  <div class="subcontent">
    <div class="line">You can use the properties <code class="example-token">date-header</code>, <code class="example-token">date-align</code> and <code class="example-token">weekday-align</code> to manipulate how the header area looks.</div>

    <navigation-bar
      @today="onToday"
      @prev="onPrev"
      @next="onNext"
    />

    <div
      class="button-bar"
      style="margin: 12px;"
    >
      <q-select
        v-model="dateHeader"
        label="date-header"
        outlined
        dense
        options-dense
        :options="[
          'stacked',
          'inline',
          'inverted'
        ]"
        class="button"
        style="min-width: 160px;"
      />

      <q-select
        v-model="dateAlign"
        label="date-align"
        outlined
        dense
        options-dense
        :options="[
          'center',
          'left',
          'right'
        ]"
        class="button"
        style="min-width: 160px;"
      />

      <q-select
        v-model="weekdayAlign"
        label="weekday-align"
        outlined
        dense
        options-dense
        :options="[
          'center',
          'left',
          'right'
        ]"
        class="button"
        style="min-width: 160px;"
      />

    </div>

    <div style="display: flex; max-width: 800px; width: 100%; height: 200px;">
      <q-calendar-agenda
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
import { QCalendarAgenda } from '@quasar/quasar-ui-qcalendar/src/QCalendarAgenda.js'
import { today } from '@quasar/quasar-ui-qcalendar/src/Timestamp.js'
import '@quasar/quasar-ui-qcalendar/src/QCalendarVariables.sass'
import '@quasar/quasar-ui-qcalendar/src/QCalendarTransitions.sass'
import '@quasar/quasar-ui-qcalendar/src/QCalendarAgenda.sass'

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
          id: 'overdue',
          label: 'Overdue'
        }
      ],
      rightColumnOptions: [
        {
          id: 'summary',
          label: 'Summary'
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
