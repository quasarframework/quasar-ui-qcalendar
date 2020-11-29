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
      v-model="selectedDate"
      view="week"
      locale="en-us"
      animated
      :interval-minutes="15"
      :interval-count="96"
      time-clicks-clamped
      :selected-dates="selectedDates"
      @click:time2="onToggleTime"
      style="height: 400px;"
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
      selectedDates: []
    }
  },
  methods: {
    calendarNext () {
      this.$refs.calendar.next()
    },

    calendarPrev () {
      this.$refs.calendar.prev()
    },

    onToggleTime ({ scope }) {
      if (scope === undefined) {
        return
      }

      // make a copy of the timestamp
      const ts = QCalendar.copyTimestamp(scope.timestamp)

      // get date with time
      const t = QCalendar.getDateTime(ts)

      // toggle to/from array
      if (this.selectedDates.includes(t)) {
        // remove the date
        for (let i = 0; i < this.selectedDates.length; ++i) {
          if (t === this.selectedDates[i]) {
            this.selectedDates.splice(i, 1)
            break
          }
        }
      }
      else {
        // add the date if not outside
        if (scope.outside !== true) {
          this.selectedDates.push(t)
        }
      }
    }
  },
  watch: {
    selectedDates (val) {
      /* eslint-disable-next-line */
      console.log('selected dates:', val)
    }
  }
}
</script>
