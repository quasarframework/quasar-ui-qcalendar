<template>
  <q-calendar
    v-model="selectedDate"
    :column-count="3"
    view="day"
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
