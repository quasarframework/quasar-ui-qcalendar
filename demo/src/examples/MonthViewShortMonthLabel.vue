<template>
  <q-calendar
    v-model="selectedDate"
    view="month"
    short-month-label
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
