<template>
  <div class="subcontent">
    <navigation-bar
      @today="onToday"
      @prev="onPrev"
      @next="onNext"
    />

    <div class="row justify-center">
      <div style="display: flex; max-width: 800px; width: 100%; height: 400px;">
        <q-calendar-month
          ref="calendar"
          v-model="selectedDate"
          :selected-dates="selectedDates"
          animated
          bordered
          @click-day="onToggleDay"
          @click-date="onToggleDate"
          @change="onChange"
          @moved="onMoved"
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
  name: 'MonthSelectedDates',
  components: {
    NavigationBar,
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
