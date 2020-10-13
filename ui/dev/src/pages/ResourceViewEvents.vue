<template>
  <div class="row items-center" style="max-width: 800px; width: 100%; height: 421px;">
    <div class="col-8 full-height">
      <div class="row justify-center items-center" style="height: 30px;">
        <q-btn flat dense label="Prev" @click="calendarPrev" />
        <q-separator vertical />
        <q-btn flat dense label="Next" @click="calendarNext" />
      </div>
      <q-separator />
      <div style="overflow: hidden; height: 390px;">
        <q-calendar
          ref="calendar"
          v-model="selectedDate"
          view="day-resource"
          locale="en-us"
          short-weekday-label
          :resources="resources"
          :resource-height="50"
          animated
          @input="onModelChanged"
          @click:time2="onClickTime2"
          @click:resource2="onClickResource2"
          @click:interval2="onClickInterval2"
          @click:resource:header2="onClickResourceHeader2"
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
      events: [],
      resources: [
        { label: 'John' },
        { label: 'Mary' },
        { label: 'Susan' },
        { label: 'Olivia' },
        { label: 'Board Room' },
        { label: 'Room-1' },
        { label: 'Room-2' }
      ]
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
    onClickResource2 (data) {
      this.events.unshift(`click:resource2: ${JSON.stringify(data)}`)
    },
    onClickInterval2 (data) {
      this.events.unshift(`click:interval2: ${JSON.stringify(data)}`)
    },
    onClickTime2 (data) {
      this.events.unshift(`click:time2: ${JSON.stringify(data)}`)
    },
    onClickResourceHeader2 (data) {
      this.events.unshift(`click:resource:header2: ${JSON.stringify(data)}`)
    }
  }
}
</script>
