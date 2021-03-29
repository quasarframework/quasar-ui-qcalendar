<template>
  <div style="max-width: 800px; width: 100%; background: #121212;">
    <q-calendar
      v-model="selectedDate"
      view="month"
      dark
      locale="en-us"
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
