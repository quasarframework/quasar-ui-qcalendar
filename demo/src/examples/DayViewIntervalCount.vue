<template>
  <q-calendar
    v-model="selectedDate"
    view="day"
    locale="en-us"
    :interval-count="4"
    style="height: 400px;"
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
