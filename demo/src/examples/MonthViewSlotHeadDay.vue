<template>
  <div style="max-width: 800px; width: 100%;">
    <q-calendar
      v-model="selectedDate"
      view="month"
      locale="en-us"
    >
      <template #head-day="{ day }">
        {{ getHeadDay(day) }}
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
