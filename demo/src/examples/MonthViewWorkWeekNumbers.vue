<template>
  <q-calendar
    v-model="selectedDate"
    show-work-weeks
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
