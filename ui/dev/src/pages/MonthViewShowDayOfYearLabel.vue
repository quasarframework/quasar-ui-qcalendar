<template>
  <div style="max-width: 800px; width: 100%;">
    <div class="row justify-center items-center">
      <q-btn flat label="Prev" @click="prev" />
      <q-separator vertical />
      <q-btn flat label="Next" @click="next" />
    </div>
    <q-separator />
    <div style="overflow: hidden">
      <q-calendar
        ref="calendar"
        v-model="selectedDate"
        view="month"
        locale="en-us"
        show-day-of-year-label
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
      selectedDate: ''
    }
  },
  methods: {
    next () {
      this.$refs.calendar.next()
    },
    prev () {
      this.$refs.calendar.prev()
    }
  }
}
</script>
