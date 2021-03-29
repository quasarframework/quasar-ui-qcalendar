<template>
  <div style="max-width: 800px; width: 100%;">
    <q-calendar
      v-model="selectedDate"
      view="3day"
      locale="en-us"
      style="height: 400px;"
    />
  </div>
</template>

<script>
export default {
  name: 'DayView',

  data () {
    return {
      selectedDate: ''
    }
  }
}
</script>
