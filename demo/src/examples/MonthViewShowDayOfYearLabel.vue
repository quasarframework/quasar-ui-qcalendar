<template>
  <q-calendar
    v-model="selectedDate"
    show-day-of-year-label
    view="month"
    locale="en-us"
  />
</template>

<script>
export default {
  data () {
    return {
      selectedDate: ''
    }
  }
}
</script>
