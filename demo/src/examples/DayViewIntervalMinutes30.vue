<template>
  <q-calendar
    v-model="selectedDate"
    view="day"
    locale="en-us"
    :interval-minutes="30"
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
