<template>
  <div
    class="row justify-center"
    style="max-width: 800px; width: 100%;"
  >
    <div class="row justify-center items-center">
      <q-btn
        dense
        flat
        label="Prev"
        @click="calendarPrev"
      />
      <q-separator vertical />
      <q-btn
        dense
        flat
        label="Next"
        @click="calendarNext"
      />
    </div>
    <q-separator />
    <div
      class="row justify-center q-pa-md"
      style="max-width: 800px; width: 100%; overflow: hidden;"
    >
      <q-calendar
        ref="calendar"
        v-model="selectedDate"
        view="month"
        locale="en-us"
        mini-mode
        animated
        :selected-dates="selectedDates"
        style="max-width: 300px; min-width: auto; overflow: hidden"
        @click:day2="onToggleDate"
        @click:date2="onToggleDate"
      />
    </div>
  </div>
</template>

<script>
function leftClick (e) {
  return e.button === 0
}

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

    classDay (timestamp) {
      if (this.anchorDayIdentifier !== false && this.otherDayIdentifier !== false) {
        return this.getBetween(timestamp)
      }
    },

    onToggleDate ({ scope, event }) {
      if (leftClick(event)) {
        if (this.selectedDates.includes(scope.timestamp.date)) {
          // remove the date
          for (let i = 0; i < this.selectedDates.length; ++i) {
            if (scope.timestamp.date === this.selectedDates[ i ]) {
              this.selectedDates.splice(i, 1)
              break
            }
          }
        }
        else {
          // add the date
          this.selectedDates.push(scope.timestamp.date)
        }
      }
    }
  }
}
</script>
