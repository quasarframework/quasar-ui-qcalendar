<template>
  <div
    class="row justify-center"
    style="max-width: 800px; width: 100%; overflow: hidden;"
  >
    <q-calendar
      ref="calendar"
      v-model="selectedDate"
      view="month"
      locale="en-us"
      mini-mode
      no-active-date
      animated
      transition-prev="flip-left"
      transition-next="flip-right"
      :selected-dates="selectedDates"
      style="max-width: 300px; min-width: auto; overflow: hidden"
      @click:day2="onToggleDate"
      @click:date2="onToggleDate"
    />
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
