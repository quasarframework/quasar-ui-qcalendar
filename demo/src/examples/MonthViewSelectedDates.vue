<template>
  <div>
    <q-toolbar>
      <q-btn stretch flat label="Prev" @click="calendarPrev" />
      <q-separator vertical />
      <q-btn stretch flat label="Next" @click="calendarNext" />
      <q-space />
    </q-toolbar>
    <q-separator />
    <div style="overflow: hidden;">
      <q-calendar
        ref="calendar"
        v-model="selectedDate"
        view="month"
        locale="en-us"
        animated
        transition-prev="slide-right"
        transition-next="slide-left"
        :selected-dates="selectedDates"
        @click:day2="onToggleDay"
        @click:date2="onToggleDate"
      />
    </div>
  </div>
</template>

<script>
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

    onToggleDate ({ scope }) {
      if (scope !== undefined) {
        this.toggleDate(scope.timestamp.date)
      }
    },

    onToggleDay ({ scope }) {
      if (scope !== undefined) {
        this.toggleDate(scope.timestamp.date)
      }
    },

    toggleDate (date) {
      if (this.selectedDates.includes(date)) {
        // remove the date
        for (let i = 0; i < this.selectedDates.length; ++i) {
          if (date === this.selectedDates[i]) {
            this.selectedDates.splice(i, 1)
            break
          }
        }
      }
      else {
        // add the date
        this.selectedDates.push(date)
      }
    }
  },
  watch: {
    selectedDates (val) {
      console.log(val)
    }
  }
}
</script>
