<template>
  <div style="max-width: 800px; width: 100%;">
    <q-calendar
      v-model="selectedDate"
      view="week"
      :disabled-before="disabledBefore"
      :disabled-after="disabledAfter"
      :interval-style="modifiedStyle"
      locale="en-us"
      style="height: 400px;"
    />
  </div>
</template>

<script>
import {
  parseDate,
  parseTimestamp,
  addToDate
} from 'ui' // ui is aliased from '@quasar/quasar-ui-qcalendar'
const CURRENT_DAY = new Date()

function getCurrentDay (day) {
  const newDay = new Date(CURRENT_DAY)
  newDay.setDate(day)
  const tm = parseDate(newDay)
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
      // find the monday of this week
      if (this.selectedDate) {
        const monday = 1 // day of week (ts.weekday)
        let ts = parseTimestamp(this.selectedDate)
        ts = addToDate(ts, { day: (ts.weekday > monday ? -(ts.weekday - monday) : (monday - ts.weekday)) })
        return ts.date
      }
      return void 0
    },

    disabledAfter () {
      // find the 1st day of the next month
      if (this.selectedDate) {
        const friday = 5 // day of week (ts.weekday)
        let ts = parseTimestamp(this.selectedDate)
        // get days in month
        ts = addToDate(ts, { day: (ts.weekday > friday ? -(ts.weekday - friday) : (friday - ts.weekday)) })
        return ts.date
      }
      return void 0
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
