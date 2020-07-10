<template>
  <div style="max-width: 800px; width: 100%;">
    <div class="row justify-center full-width">
      <q-btn flat label="Prev" @click="calendarPrev" />
      <q-separator vertical />
      <q-btn flat label="Next" @click="calendarNext" />
      <q-separator />
    </div>
    <div class="row justify-center full-width">
      <q-calendar
        ref="calendar"
        v-model="selectedDate"
        view="day-resource"
        :resources="resources"
        :resource-height="50"
        locale="en-us"
        sticky
        animated
        transition-prev="slide-right"
        transition-next="slide-left"
        style="height: 200px; max-width: 800px; width: 100%;"
      />
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      selectedDate: '2019-04-01',
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
    }
  }
}
</script>
