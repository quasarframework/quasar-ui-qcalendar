<template>
  <div class="row justify-center" style="max-width: 800px; width: 100%; overflow: hidden;">
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
      style="max-width: 300px;"
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
    classDay (timestamp) {
      if (this.anchorDayIdentifier !== false && this.otherDayIdentifier !== false) {
        return this.getBetween(timestamp)
      }
    },

    onToggleDate (timestamp) {
      if (leftClick(event)) {
        if (this.selectedDates.includes(timestamp.date)) {
          // remove the date
          for (let i = 0; i < this.selectedDates.length; ++i) {
            if (timestamp.date === this.selectedDates[i]) {
              this.selectedDates.splice(i, 1)
              break
            }
          }
        } else {
          // add the date
          this.selectedDates.push(timestamp.date)
        }
      }
    }
  }
}
</script>
