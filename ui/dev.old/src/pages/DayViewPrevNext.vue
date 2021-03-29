<template>
  <div style="max-width: 800px; width: 100%;">
    <div class="row justify-center items-center">
      <q-btn flat label="Prev" @click="calendarPrev" />
      <q-separator vertical />
      <q-btn flat label="Next" @click="calendarNext" />
    </div>
    <q-separator />
    <q-calendar
      ref="calendar"
      v-model="selectedDate"
      view="day"
      locale="en-us"
      animated
      transition-prev="slide-right"
      transition-next="slide-left"
      style="height: 400px;"
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
    }
  }
}
</script>
