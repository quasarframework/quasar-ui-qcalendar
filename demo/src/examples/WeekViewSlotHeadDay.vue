<template>
  <div style="max-width: 800px; width: 100%;">
    <q-calendar
      v-model="selectedDate"
      view="week"
      locale="en-us"
      style="height: 400px;"
    >
      <template #head-day="timestamp">
        {{ getHeadDay(timestamp) }}
      </template>
    </q-calendar>
  </div>
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
      return `The date is: ${timestamp.date}`
    }
  }
}
</script>
