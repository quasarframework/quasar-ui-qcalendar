<template>
  <q-calendar
    v-model="selectedDate"
    view="week"
    locale="en-us"
    dark
    style="height: 400px;"
  />
</template>

<script>
export default {
  data () {
    return {
      selectedDate: '2019-04-01'
    }
  }
}
</script>
