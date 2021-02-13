<template>
  <div style="margin: 12px;">
    <div style="width: 100%">
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
    <div style="font-size: 12px;">The example below uses the properties 'disable-before' and 'disable-after' to disable all days except the current month.</div>
  </div>

  <div style="width: 100%; display: flex; justify-content: center">
    <QCalendarMonth
      ref="calendar"
      v-model="selectedDate"
      mini-mode
      :disabled-before="disabledBefore"
      :disabled-after="disabledAfter"
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
</template>

<script>
import { QCalendarMonth } from '@quasar/quasar-ui-qcalendar/QCalendarMonth.js'
import {
  addToDate,
  daysInMonth,
  parseTimestamp,
  today
} from '@quasar/quasar-ui-qcalendar/Timestamp.js'
import '@quasar/quasar-ui-qcalendar/QCalendarVariables.sass'
import '@quasar/quasar-ui-qcalendar/QCalendarTransitions.sass'
import '@quasar/quasar-ui-qcalendar/QCalendarMonth.sass'

import { defineComponent, ref, computed } from 'vue'

export default defineComponent({
  name: 'MiniModeDisabledBeforeAfter',
  components: {
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
