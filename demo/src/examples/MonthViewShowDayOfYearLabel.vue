<template>
  <q-calendar
    v-model="selectedDate"
    show-day-of-year-label
    view="month"
    locale="en-us"
    style="height: 400px;"
  />
</template>

<script>
export default {
  data () {
    return {
      selectedDate: '2019-04-01'
    }
  }
}
</script>
