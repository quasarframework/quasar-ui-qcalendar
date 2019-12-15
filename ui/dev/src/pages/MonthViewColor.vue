<template>
  <q-calendar
    v-model="selectedDate"
    view="month"
    locale="en-us"
    color="orange-8"
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
