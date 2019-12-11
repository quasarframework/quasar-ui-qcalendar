<template>
  <q-calendar
    v-model="selectedDate"
    view="month"
    now
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
