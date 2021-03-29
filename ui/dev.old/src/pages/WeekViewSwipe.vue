<template>
  <div style="max-width: 800px; width: 100%;">
    <q-calendar
      ref="calendar"
      v-model="selectedDate"
      view="week"
      locale="en-us"
      v-touch-swipe.mouse.left.right="handleSwipe"
      animated
      transition-prev="slide-right"
      transition-next="slide-left"
      style="height: 400px; overflow: hidden"
    />
  </div>
</template>

<script>
export default {
  data () {
    return {
      selectedDate: '',
      dragging: false, // used for drag-and-drop
      ignoreNextSwipe: false // used for drag-and-drop
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
      if (this.dragging === false) {
        if (info.duration >= 30 && this.ignoreNextSwipe === false) {
          if (info.direction === 'right') {
            this.calendarPrev()
          }
          else if (info.direction === 'left') {
            this.calendarNext()
          }
        }
        else {
          this.ignoreNextSwipe = false
        }
      }
      // stopAndPrevent(evt)
      evt.cancelable !== false && evt.preventDefault()
      evt.stopPropagation()
    }
  }
}
</script>
