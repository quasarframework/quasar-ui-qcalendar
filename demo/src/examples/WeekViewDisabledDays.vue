<template>
  <div style="max-width: 800px; width: 100%;">
    <q-calendar
      v-model="selectedDate"
      view="week"
      :disabled-days="disabledDays"
      :interval-style="modifiedStyle"
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
      selectedDate: getCurrentDay(CURRENT_DAY.getDate())
    }
  },
  computed: {
    disabledDays () {
      const days = []
      // get current day
      const ts = QCalendar.parseTimestamp(this.selectedDate)
      // make next 4 days, after today, disabled
      Array.from(Array(4)).forEach((_, i) => {
        days.push(QCalendar.addToDate(ts, { day: i + 1 }).date)
      })
      return days
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
