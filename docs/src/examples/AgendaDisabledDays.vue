<template>
  <div class="subcontent">

    <navigation-bar
      @today="onToday"
      @prev="onPrev"
      @next="onNext"
    />

    <div class="row justify-center">
      <div class="q-gutter-md" style="display: flex; flex-direction: column; max-width: 800px; width: 90%;">
        <q-calendar-agenda
          ref="calendar"
          v-model="selectedDate"
          view="week"
          :disabled-days="disabledDays"
          :left-column-options="leftColumnOptions"
          :right-column-options="rightColumnOptions"
          column-options-id="id"
          column-options-label="label"
          :day-min-height="200"
          animated
          bordered
          @change="onChange"
          @moved="onMoved"
          @click-date="onClickDate"
          @click-time="onClickTime"
          @click-interval="onClickInterval"
          @click-head-intervals="onClickHeadIntervals"
          @click-head-day="onClickHeadDay"
          style="max-height: 200px;"
        />
        <q-calendar-agenda
          ref="calendar2"
          v-model="selectedDate"
          view="week"
          :disabled-days="disabledDaysRange"
          :left-column-options="leftColumnOptions"
          :right-column-options="rightColumnOptions"
          column-options-id="id"
          column-options-label="label"
          :day-min-height="200"
          animated
          bordered
          @change="onChange"
          @moved="onMoved"
          @click-date="onClickDate"
          @click-time="onClickTime"
          @click-interval="onClickInterval"
          @click-head-intervals="onClickHeadIntervals"
          @click-head-day="onClickHeadDay"
          style="max-height: 200px;"
        />
      </div>
    </div>
  </div>
</template>

<script>
import {
  QCalendarAgenda,
  addToDate,
  parseTimestamp,
  today
} from '@quasar/quasar-ui-qcalendar/src/index.js'
import '@quasar/quasar-ui-qcalendar/src/QCalendarVariables.sass'
import '@quasar/quasar-ui-qcalendar/src/QCalendarTransitions.sass'
import '@quasar/quasar-ui-qcalendar/src/QCalendarAgenda.sass'

import { defineComponent } from 'vue'
import NavigationBar from '../components/NavigationBar.vue'

export default defineComponent({
  name: 'AgendaDisabledDays',
  components: {
    NavigationBar,
    QCalendarAgenda
  },
  data () {
    return {
      selectedDate: today(),
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
