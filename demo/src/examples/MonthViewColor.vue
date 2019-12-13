<template>
  <q-calendar
    v-model="selectedDate"
    view="month"
    locale="en-us"
    color="#FF0000"
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
