<template>
  <div style="max-width: 800px; width: 100%;">
    <q-calendar
      v-model="selectedDate"
      view="month"
      locale="en-us"
    >
      <template #head-day="scope">
        {{ getHeadDay(scope) }}
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
    getHeadDay (scope) {
      return `Top date is: ${scope.days[0].date}`
    }
  }
}
</script>
