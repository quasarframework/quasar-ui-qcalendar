<template>
  <div class="row items-center" style="max-width: 800px; width: 100%; height: 421px;">
    <div class="col-8 full-height">
      <div class="row justify-center items-center" style="height: 30px;">
        <q-btn flat dense label="Prev" @click="calendarPrev" />
        <q-separator vertical />
        <q-btn flat dense label="Next" @click="calendarNext" />
      </div>
      <q-separator />
      <div style="overflow: hidden; height: 400px;">
        <q-calendar
          ref="calendar"
          v-model="selectedDate"
          view="day"
          locale="en-us"
          @input="onModelChanged"
          @click:date2="onClickDate"
          @click:day2="onClickDay"
          @click:interval2="onClickInterval"
          @click:time2="onClickTime"
          @click:interval:header2="onClickIntervalHeader"
        />
      </div>
    </div>
    <q-card class="events col-4 q-pa-xs full-height column justify-start items-start">
      <q-item-section class="full-width">
        <q-item-label>Events</q-item-label>
        <q-item-label caption>New data appended to top</q-item-label>
      </q-item-section>
      <q-separator />
      <div class="scroll overflow-auto" style="height: 360px; width: 100%;">
        <div v-for="(event, index) in events" :key="index" class="col-12" style="font-size: 10px; line-height: 10px; max-height: 14px; min-height: 14px; padding: 2px 2px; white-space: nowrap;">
          {{ event }}
        </div>
      </div>
    </q-card>
  </div>
</template>

<script>
export default {
  data () {
    return {
      selectedDate: '',
      events: []
    }
  },
  methods: {
    calendarNext () {
      this.$refs.calendar.next()
    },
    calendarPrev () {
      this.$refs.calendar.prev()
    },
    onModelChanged (date) {
      this.events.unshift(`Model changed: ${date}`)
    },
    onClickDate (data) {
      this.events.unshift(`click:date2: ${JSON.stringify(data)}`)
    },
    onClickDay (data) {
      this.events.unshift(`click:day2: ${JSON.stringify(data)}`)
    },
    onClickInterval (data) {
      this.events.unshift(`click:interval2: ${JSON.stringify(data)}`)
    },
    onClickTime (data) {
      this.events.unshift(`click:time2: ${JSON.stringify(data)}`)
    },
    onClickIntervalHeader (data) {
      this.events.unshift(`click:interval:header2: ${JSON.stringify(data)}`)
    }
  }
}
</script>
