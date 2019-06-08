```
<script>
import { stopAndPrevent } from 'quasar/src/utils/event'
export default {
  return {
    tab: 'template',
    selectedDate: '2019-04-01',
    dragging: false, // used for drag-and-drop
    ignoreNextSwipe: false, // used for drag-and-drop
    template: template,
    script: script
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
          } else if (info.direction === 'left') {
            this.calendarNext()
          }
        } else {
          this.ignoreNextSwipe = false
        }
      }
      stopAndPrevent(evt)
    }
  }
}
</script>
```