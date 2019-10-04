<template>
  <q-calendar
    v-model="selectedDate"
    view="week"
    locale="en-us"
    now
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
