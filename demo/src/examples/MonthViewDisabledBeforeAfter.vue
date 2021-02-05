<template>
  <div style="max-width: 800px; width: 100%;">
    <div class="row justify-center items-center">
      <q-btn
        flat
        dense
        label="Prev"
        @click="calendarPrev"
      />
      <q-separator vertical />
      <q-btn
        flat
        dense
        label="Next"
        @click="calendarNext"
      />
    </div>
    <q-separator />
    <q-calendar
      ref="calendar"
      v-model="selectedDate"
      view="month"
      :disabled-before="disabledBefore"
      :disabled-after="disabledAfter"
      locale="en-us"
      animated
      transition-prev="slide-right"
      transition-next="slide-left"
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
      // set to today's date
      selectedDate: getCurrentDay(CURRENT_DAY.getDate()),
      today: getCurrentDay(CURRENT_DAY.getDate())
    }
  },
  computed: {
    disabledBefore () {
      // find the last day of the previous month
      if (this.today) {
        let ts = QCalendar.parseTimestamp(this.today)
        ts = QCalendar.addToDate(ts, { day: -ts.day })
        return ts.date
      }
      return void 0
    },

    disabledAfter () {
      // find the 1st day of the next month
      if (this.today) {
        let ts = QCalendar.parseTimestamp(this.today)
        // get days in month
        const days = QCalendar.daysInMonth(ts.year, ts.month)
        ts = QCalendar.addToDate(ts, { day: (days - ts.day + 1) })
        return ts.date
      }
      return void 0
    }
  },
  methods: {
    calendarNext () {
      this.$refs.calendar.next()
    },
    calendarPrev () {
      this.$refs.calendar.prev()
    }
  }
}
</script>
