<template>
  <q-calendar
    v-model="selectedDate"
    view="day"
    :weekdays="[1, 2, 3, 4, 5]"
    locale="en-us"
    style="height: 400px;"
  />
</template>

<script>
export default {
  data () {
    return {
      selectedDate: '2020-05-31'
    }
  }
}
</script>
