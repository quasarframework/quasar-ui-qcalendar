<template>
  <q-calendar
    v-model="selectedDate"
    view="month"
    :hide-header="true"
    locale="en-us"
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
