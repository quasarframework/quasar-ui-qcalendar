<template>
  <div style="max-width: 800px; width: 100%; background: #000;">
    <q-calendar
      v-model="selectedDate"
      view="day"
      dark
      locale="en-us"
      style="height: 400px;"
    />
  </div>
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
