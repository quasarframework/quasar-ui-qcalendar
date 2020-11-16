<template>
  <div style="max-width: 800px; width: 100%;">
    <q-calendar
      v-model="selectedDate"
      view="week-scheduler"
      :resources="resources"
      :disabled-before="disabledBefore"
      :disabled-after="disabledAfter"
      locale="en-us"
      style="height: 400px;"
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
      selectedDate: '2019-04-01',
      resources: [
        { label: 'John' },
        { label: 'Mary' },
        { label: 'Susan' },
        { label: 'Olivia' },
        { label: 'Board Room' },
        { label: 'Room-1' },
        { label: 'Room-2' }
      ]
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
        let ts = QCalendar.parseTimestamp(this.selectedDate)
        ts = QCalendar.addToDate(ts, { day: (ts.weekday > monday ? -(ts.weekday - monday) : (monday - ts.weekday)) })
        return ts.date
      }
      return undefined
    },

    disabledAfter () {
      // find the 1st day of the next month
      if (this.selectedDate) {
        const friday = 5 // day of week (ts.weekday)
        let ts = QCalendar.parseTimestamp(this.selectedDate)
        // get days in month
        ts = QCalendar.addToDate(ts, { day: (ts.weekday > friday ? -(ts.weekday - friday) : (friday - ts.weekday)) })
        return ts.date
      }
      return undefined
    }
  }
}
</script>
