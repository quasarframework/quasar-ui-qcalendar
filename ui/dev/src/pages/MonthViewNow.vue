<template>
  <q-calendar
    v-model="selectedDate"
    view="month"
    now
    locale="en-us"
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
