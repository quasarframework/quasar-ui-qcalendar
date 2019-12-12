<template>
  <q-calendar
    v-model="selectedDate"
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
