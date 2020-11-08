<template>
  <q-calendar
    v-model="selectedDate"
    view="day"
    locale="en-us"
    style="height: 400px;"
  >
    <template #head-day="{ timestamp }">
      {{ getHeadDay(timestamp) }}
    </template>
  </q-calendar>
</template>

<script>
export default {
  data () {
    return {
      selectedDate: ''
    }
  },

  methods: {
    getHeadDay (timestamp) {
      return `${timestamp.date}`
    }
  }
}
</script>
