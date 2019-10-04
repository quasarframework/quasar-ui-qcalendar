<template>
  <div style="overflow: auto">
    <q-calendar
      v-model="selectedDate"
      view="month"
      :day-height="100"
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
