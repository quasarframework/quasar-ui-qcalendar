<template>
  <div style="max-width: 800px; width: 100%;">
    <div class="row justify-center items-center">
      <q-btn
        flat
        label="Prev"
        @click="calendarPrev"
      />
      <q-separator vertical />
      <q-btn
        flat
        label="Next"
        @click="calendarNext"
      />
    </div>
    <q-separator />
    <div style="overflow: hidden">
      <q-calendar
        ref="calendar"
        v-model="selectedDate"
        view="week-scheduler"
        :resources="resources"
        locale="en-us"
        animated
        transition-prev="slide-right"
        transition-next="slide-left"
      />
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      selectedDate: '',
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
