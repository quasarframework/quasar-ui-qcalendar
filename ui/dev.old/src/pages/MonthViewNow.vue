<template>
  <div style="max-width: 800px; width: 100%;">
    <q-calendar
      v-model="selectedDate"
      view="month"
      :now="now"
      locale="en-us"
    />
  </div>
</template>

<script>
// normally you would not import "all" of QCalendar, but is needed for this example to work with UMD (codepen)
import QCalendar from 'ui' // ui is aliased from '@quasar/quasar-ui-qcalendar'

export default {
  data () {
    return {
      selectedDate: '',
      now: ''
    }
  },

  beforeMount () {
    // set "now" to previous day
    this.selectedDate = QCalendar.today()
    const now = QCalendar.parseTimestamp(this.selectedDate)
    this.now = QCalendar.getDate(QCalendar.prevDay(now))
  }
}
</script>
