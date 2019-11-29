<template>
  <q-calendar
    v-model="selectedDate"
    view="week-agenda"
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
