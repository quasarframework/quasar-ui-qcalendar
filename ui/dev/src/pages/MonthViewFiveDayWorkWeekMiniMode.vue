<template>
  <q-calendar
    v-model="selectedDate"
    :weekdays="[1, 2, 3, 4, 5]"
    mini-mode="auto"
    breakpoint="sm"
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
