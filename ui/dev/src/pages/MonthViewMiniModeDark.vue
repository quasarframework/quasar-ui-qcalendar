<template>
  <q-calendar
    v-model="selectedDate"
    view="month"
    mini-mode="auto"
    breakpoint="sm"
    locale="en-us"
    dark
    style="height: 300px;"
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
