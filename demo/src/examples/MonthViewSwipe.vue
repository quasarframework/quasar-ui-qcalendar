<template>
  <div style="max-width: 800px; width: 100%; overflow: hidden;">
    <q-calendar
      ref="calendar"
      v-model="selectedDate"
      v-touch-swipe.mouse.left.right="handleSwipe"
      view="month"
      locale="en-us"
      animated
      transition-prev="slide-right"
      transition-next="slide-left"
      style="overflow: hidden;"
    />
  </div>
</template>

<script>
export default {
  data () {
    return {
      selectedDate: ''
    }
  },

  methods: {
    calendarNext () {
      this.$refs.calendar.next()
    },
    calendarPrev () {
      this.$refs.calendar.prev()
    },
    handleSwipe ({ evt, ...info }) {
      if (info.duration >= 30) {
        if (info.direction === 'right') {
          this.calendarPrev()
        }
        else if (info.direction === 'left') {
          this.calendarNext()
        }
      }
      evt.cancelable !== false && evt.preventDefault()
      evt.stopPropagation()
    }
  }
}
</script>
