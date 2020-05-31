<template>
  <q-calendar
    v-model="selectedDate"
    :weekdays="[1, 2, 3, 4, 5]"
    view="week"
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
