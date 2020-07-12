<template>
  <div style="max-width: 800px; width: 100%;">
    <q-calendar
      v-model="selectedDate"
      view="week"
      locale="en-us"
      :now="now"
      style="height: 400px;"
    />
  </div>
</template>

<script>
import {
  parseTimestamp,
  prevDay,
  today,
  getDate
} from 'ui' // ui is aliased from '@quasar/quasar-ui-qcalendar'

export default {
  data () {
    return {
      selectedDate: '',
      now: ''
    }
  },

  beforeMount () {
    // set "now" to previous day
    this.selectedDate = today()
    const now = parseTimestamp(this.selectedDate)
    this.now = getDate(prevDay(now))
  }
}
</script>
