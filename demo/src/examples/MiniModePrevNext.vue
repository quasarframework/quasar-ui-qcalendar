<template>
  <div class="row justify-center" style="max-width: 800px; width: 100%; overflow: hidden;">
    <q-toolbar class="no-padding no-margin" style="height: 40px; min-height: auto;">
      <q-space />
      <q-btn flat label="Prev" @click="calendarPrev" />
      <q-separator vertical />
      <q-btn flat label="Next" @click="calendarNext" />
      <q-space />
    </q-toolbar>
    <q-separator class="full-width" />
    <div class="row justify-center q-pa-md" style="max-width: 800px; width: 100%; overflow: hidden;">
      <q-calendar
        ref="calendar"
        v-model="selectedDate"
        view="month"
        locale="en-us"
        mini-mode
        animated
        transition-prev="flip-left"
        transition-next="flip-right"
        :selected-dates="selectedDates"
        @click:day="onToggleDate"
        @click:date="onToggleDate"
        style="max-width: 300px; min-width: auto; overflow: hidden"
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
        if (this.selectedDates.includes(scope.date)) {
          // remove the date
          for (let i = 0; i < this.selectedDates.length; ++i) {
            if (scope.date === this.selectedDates[i]) {
              this.selectedDates.splice(i, 1)
              break
            }
          }
        }
        else {
          // add the date
          this.selectedDates.push(scope.date)
        }
      }
    }
  }
}
</script>
