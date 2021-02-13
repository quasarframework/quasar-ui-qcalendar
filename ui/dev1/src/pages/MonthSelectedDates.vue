<template>
  <div style="margin: 12px;">
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

  <div style="width: 100%; display: flex; justify-content: center">
    <QCalendarMonth
      ref="calendar"
      v-model="selectedDate"
      :selected-dates="selectedDates"
      bordered
      style="max-width: 800px; width: 100%; height: 400px;"
      @click-day="onToggleDay"
      @click-date="onToggleDate"
      @change="onChange"
      @moved="onMoved"
      @click-workweek="onClickWorkweek"
      @click-head-workweek="onClickHeadWorkweek"
      @click-head-day="onClickHeadDay"
    />
  </div>
</template>

<script>
import { QCalendarMonth } from '@quasar/quasar-ui-qcalendar/QCalendarMonth.js'
import { today } from '@quasar/quasar-ui-qcalendar/Timestamp.js'
import '@quasar/quasar-ui-qcalendar/QCalendarVariables.sass'
import '@quasar/quasar-ui-qcalendar/QCalendarTransitions.sass'
import '@quasar/quasar-ui-qcalendar/QCalendarMonth.sass'

import { defineComponent } from 'vue'

export default defineComponent({
  name: 'MonthSelectedDates',
  components: {
    QCalendarMonth
  },
  data () {
    return {
      selectedDate: today(),
      selectedDates: []
    }
  },
  methods: {
    onToggleDate ({ scope }) {
      console.log('date clicked (scope)', scope)
      if (scope !== undefined) {
        this.toggleDate(scope)
      }
    },

    onToggleDay ({ scope }) {
      console.log('day clicked (scope)', scope)
      if (scope !== undefined) {
        this.toggleDate(scope)
      }
    },

    toggleDate (scope) {
      const date = scope.timestamp.date
      if (this.selectedDates.includes(date)) {
        // remove the date
        for (let i = 0; i < this.selectedDates.length; ++i) {
          if (date === this.selectedDates[ i ]) {
            this.selectedDates.splice(i, 1)
            break
          }
        }
      }
      else {
        // add the date if not outside
        if (scope.outside !== true) {
          this.selectedDates.push(date)
        }
      }
    },

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
    // onClickDate (data) {
    //   console.log('onClickDate', data)
    // },
    // onClickDay (data) {
    //   console.log('onClickDay', data)
    // },
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
