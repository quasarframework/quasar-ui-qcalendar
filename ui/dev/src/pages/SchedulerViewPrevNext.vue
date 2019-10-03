<template>
  <div>
    <q-toolbar>
      <q-btn stretch flat label="Prev" @click="calendarPrev" />
      <q-separator vertical />
      <q-btn stretch flat label="Next" @click="calendarNext" />
      <q-space />
    </q-toolbar>
    <q-separator />
    <q-calendar
      ref="calendar"
      v-model="selectedDate"
      view="scheduler"
      :resources="resources"
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
