<template>
  <div style="max-width: 800px; width: 100%; overflow: auto; ">
    <q-calendar
      v-model="selectedDate"
      view="month"
      :disabled-before="disabledBefore"
      :disabled-after="disabledAfter"
      :day-style="modifiedStyle"
      locale="en-us"
    />
  </div>
</template>

<script>
// normally you would not import "all" of QCalendar, but is needed for this example to work with UMD (codepen)
import QCalendar from 'ui' // ui is aliased from '@quasar/quasar-ui-qcalendar'

const CURRENT_DAY = new Date()

function getCurrentDay (day) {
  const newDay = new Date(CURRENT_DAY)
  newDay.setDate(day)
  const tm = QCalendar.parseDate(newDay)
  return tm.date
}

export default {
  data () {
    return {
      selectedDate: '2019-04-01'
    }
  },
  beforeMount () {
    // set to today's date
    this.selectedDate = getCurrentDay(CURRENT_DAY.getDate())
  },
  computed: {
    disabledBefore () {
      // find the last day of the previous month
      if (this.selectedDate) {
        let ts = QCalendar.parseTimestamp(this.selectedDate)
        ts = QCalendar.addToDate(ts, { day: -ts.day })
        return ts.date
      }
      return undefined
    },

    disabledAfter () {
      // find the 1st day of the next month
      if (this.selectedDate) {
        let ts = QCalendar.parseTimestamp(this.selectedDate)
        // get days in month
        const days = QCalendar.daysInMonth(ts.year, ts.month)
        ts = QCalendar.addToDate(ts, { day: (days - ts.day) })
        return ts.date
      }
      return undefined
    }
  },
  methods: {
    modifiedStyle (scope) {
      if (scope.disabled === true) {
        return {
          backgroundColor: '#ffcb9c!important',
          cursor: 'not-allowed'
        }
      }
      return {}
    }
  }
}
</script>
