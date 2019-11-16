<template>
  <q-calendar
    ref="calendar"
    v-model="currentDate"
    view="day"
    locale="en-us"
    style="height: 400px;"
  >
    <!-- eslint-disable vue/no-unused-vars -->
    <template #day-container="{ date }">
      <div class="day-view-current-time-indicator" :style="style" />
      <div class="day-view-current-time-line" :style="style" />
    </template>
  </q-calendar>
</template>

<script>
import {
  parseDate
} from '@quasar/quasar-ui-qcalendar/src/utils/timestamp'

export default {
  data () {
    return {
      currentDate: void 0,
      currentTime: void 0,
      intervalId: null,
      timeStartPos: 0
    }
  },

  mounted () {
    this.adjustCurrentTime()
    // now, adjust the time every minute
    this.intervalId = setInterval(() => {
      this.adjustCurrentTime()
    }, 60000)
  },

  beforeDestroy () {
    clearInterval(this.intervalId)
  },

  computed: {
    style () {
      return {
        top: this.timeStartPos + 'px'
      }
    }
  },

  methods: {
    adjustCurrentTime () {
      const now = new Date()
      const p = parseDate(now)
      this.currentDate = p.date
      this.currentTime = p.time
      this.timeStartPos = this.$refs.calendar.timeStartPos(this.currentTime)
    }
  }
}
</script>

<style>
.day-view-current-time-indicator {
  position: absolute;
  left: 45px;
  height: 10px;
  width: 10px;
  margin-top: -4px;
  background-color: rgba(0, 0, 255, .5);
  border-radius: 50%;
}
.day-view-current-time-line {
  position: absolute;
  left: 55px;
  border-top: rgba(0, 0, 255, .5) 2px solid;
  width: calc(100% - 50px - 5px)
}
</style>
