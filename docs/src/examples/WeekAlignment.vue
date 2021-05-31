<template>
  <div class="subcontent">
    <navigation-bar
      @today="onToday"
      @prev="onPrev"
      @next="onNext"
    />

    <div class="line">You can use the properties <code class="example-token">date-header</code>, <code class="example-token">date-align</code> and <code class="example-token">weekday-align</code> to manipulate how the header area looks.</div>

    <div class="q-ma-sm row justify-center">
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

    <div class="row justify-center">
      <div style="display: flex; max-width: 800px; width: 100%; height: 400px;">
        <q-calendar-day
          ref="calendar"
          v-model="selectedDate"
          view="week"
          short-weekday-label
          :date-header="dateHeader"
          :weekday-align="weekdayAlign"
          :date-align="dateAlign"
          animated
          bordered
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
  </div>
</template>

<script>
import { QCalendarDay, today } from '@quasar/quasar-ui-qcalendar'
import '@quasar/quasar-ui-qcalendar/src/QCalendarVariables.sass'
import '@quasar/quasar-ui-qcalendar/src/QCalendarTransitions.sass'
import '@quasar/quasar-ui-qcalendar/src/QCalendarDay.sass'

import { defineComponent } from 'vue'
import NavigationBar from '../components/NavigationBar.vue'

export default defineComponent({
  name: 'WeekAlignment',
  components: {
    NavigationBar,
    QCalendarDay
  },
  data () {
    return {
      selectedDate: today(),
      dateAlign: 'center',
      weekdayAlign: 'center',
      dateHeader: 'stacked'
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
