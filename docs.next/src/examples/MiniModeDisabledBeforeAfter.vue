<template>
  <div class="subcontent">
    <div class="line">The example below uses the properties <span class="example-token">disable-before</span> and <span class="example-token">disable-after</span> to disable all days except the current month.</div>

    <navigation-bar
      @today="onToday"
      @prev="onPrev"
      @next="onNext"
    />

    <div style="display: flex; justify-content: center; align-items: center; flex-wrap: nowrap;">
      <div style="display: flex; max-width: 280px; width: 100%;">
        <q-calendar-month
          ref="calendar"
          v-model="selectedDate"
          mini-mode
          :disabled-before="disabledBefore"
          :disabled-after="disabledAfter"
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
import {
  addToDate,
  daysInMonth,
  parseTimestamp,
  today
} from '@quasar/quasar-ui-qcalendar/src/Timestamp.js'
import { QCalendarMonth } from '@quasar/quasar-ui-qcalendar/src/QCalendarMonth.js'
import '@quasar/quasar-ui-qcalendar/src/QCalendarVariables.sass'
import '@quasar/quasar-ui-qcalendar/src/QCalendarTransitions.sass'
import '@quasar/quasar-ui-qcalendar/src/QCalendarMonth.sass'

import { defineComponent, ref, computed } from 'vue'
import NavigationBar from '../components/NavigationBar.vue'

export default defineComponent({
  name: 'MiniModeDisabledBeforeAfter',
  components: {
    NavigationBar,
    QCalendarMonth
  },
  setup () {
    const selectedDate = ref(today()),
      calendar = ref(null),
      today2 = ref(today())

    const disabledBefore = computed(() => {
      // find the last day of the previous month
      if (today2.value) {
        let ts = parseTimestamp(today2.value)
        ts = addToDate(ts, { day: -ts.day })
        return ts.date
      }
      return undefined
    })

    const disabledAfter = computed(() => {
      // find the 1st day of the next month
      if (today2.value) {
        let ts = parseTimestamp(today2.value)
        // get days in month
        const days = daysInMonth(ts.year, ts.month)
        ts = addToDate(ts, { day: (days - ts.day + 1) })
        return ts.date
      }
      return undefined
    })

    function onToday () {
      calendar.value.moveToToday()
    }
    function onPrev () {
      calendar.value.prev()
    }
    function onNext () {
      calendar.value.next()
    }
    function onMoved (data) {
      console.log('onMoved', data)
    }
    function onChange (data) {
      console.log('onChange', data)
    }
    function onClickDate (data) {
      console.log('onClickDate', data)
    }
    function onClickDay (data) {
      console.log('onClickDay', data)
    }
    function onClickWorkweek (data) {
      console.log('onClickWorkweek', data)
    }
    function onClickHeadDay (data) {
      console.log('onClickHeadDay', data)
    }
    function onClickHeadWorkweek (data) {
      console.log('onClickHeadWorkweek', data)
    }

    return {
      selectedDate,
      calendar,
      disabledBefore,
      disabledAfter,
      onToday,
      onPrev,
      onNext,
      onMoved,
      onChange,
      onClickDate,
      onClickDay,
      onClickWorkweek,
      onClickHeadDay,
      onClickHeadWorkweek
    }
  }
})
</script>
