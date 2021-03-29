<template>
  <div style="max-width: 800px; width: 100%;">
    <q-calendar
      v-model="selectedDate"
      :weekdays="[1, 2, 3, 4, 5]"
      view="week"
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
