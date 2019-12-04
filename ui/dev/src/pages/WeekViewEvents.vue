<template>
  <div>
    <q-toolbar>
      <q-btn stretch flat label="Prev" @click="calendarPrev" />
      <q-separator vertical />
      <q-btn stretch flat label="Next" @click="calendarNext" />
      <q-space />
    </q-toolbar>
    <q-separator />
    <div class="row justify-between">
      <div class="col-8" style="overflow: hidden">
        <q-calendar
          ref="calendar"
          v-model="selectedDate"
          view="week"
          locale="en-us"
          animated
          transition-prev="slide-right"
          transition-next="slide-left"
          style="height: 400px;"
          @mousedown:time="onMouseDownTime"
          @mouseup:time="onMouseUpTime"
        />
      </div>
      <div class="col-4" style="min-height: 100%; border: #c0c0c0 solid 1px;">
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      selectedDate: '2019-04-01'
    }
  },
  methods: {
    calendarNext () {
      this.$refs.calendar.next()
    },
    calendarPrev () {
      this.$refs.calendar.prev()
    },
    onMouseDownTime (e) {
      console.log('down:', e)
    },
    onMouseUpTime (e) {
      console.log('up:', e)
    }
  }
}
</script>
