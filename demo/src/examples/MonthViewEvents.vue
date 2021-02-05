<template>
  <div
    class="row items-center"
    style="max-width: 800px; width: 100%; height: 421px;"
  >
    <div class="col-8 full-height">
      <div class="row justify-center items-center">
        <q-btn
          flat
          dense
          label="Prev"
          @click="calendarPrev"
        />
        <q-separator vertical />
        <q-btn
          flat
          dense
          label="Next"
          @click="calendarNext"
        />
      </div>
      <q-separator />
      <div style="overflow: hidden; height: 390px;">
        <q-calendar
          ref="calendar"
          v-model="selectedDate"
          view="month"
          locale="en-us"
          animated
          show-work-weeks
          short-weekday-label
          short-month-label
          @input="onModelChanged"
          @click:date2="onClickDate2"
          @click:day2="onClickDay2"
          @click:workweek2="onClickWorkweek2"
          @click:workweek:header2="onClickWorkweekHeader2"
          @click:day:header2="onClickDayHeader2"
        />
      </div>
    </div>
    <q-card class="events col-4 q-pa-xs full-height column justify-start items-start">
      <q-item-section class="full-width">
        <q-item-label>Events</q-item-label>
        <q-item-label class="my-text-caption">
          New data appended to top
        </q-item-label>
      </q-item-section>
      <q-separator />
      <div
        class="scroll overflow-auto"
        style="height: 360px; width: 100%;"
      >
        <div
          v-for="(event, index) in events"
          :key="index"
          class="col-12"
          style="font-size: 10px; line-height: 10px; max-height: 14px; min-height: 14px; padding: 2px 2px; white-space: nowrap;"
        >
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
      this.events.unshift(`Model changed: ${ date }`)
    },
    onClickDate2 (data) {
      this.events.unshift(`click:date2: ${ JSON.stringify(data) }`)
    },
    onClickDay2 (data) {
      this.events.unshift(`click:day2: ${ JSON.stringify(data) }`)
    },
    onClickWorkweek2 (data) {
      this.events.unshift(`click:workweek2: ${ JSON.stringify(data) }`)
    },
    onClickWorkweekHeader2 (data) {
      this.events.unshift(`click:workweek:header2: ${ JSON.stringify(data) }`)
    },
    onClickDayHeader2 (data) {
      this.events.unshift(`click:day:header2: ${ JSON.stringify(data) }`)
    }
  }
}
</script>
<style lang="sass" scoped>
.my-text-caption
  font-size: 0.7rem
  font-weight: 400
  line-height: .75rem !important
  letter-spacing: 0.03333em
</style>
