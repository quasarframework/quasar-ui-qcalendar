<template>
  <div style="max-width: 800px; width: 100%;">
    <q-calendar
      v-model="selectedDate"
      view="week-scheduler"
      :resources="resources"
      :resource-height="50"
      locale="en-us"
      style="height: 400px;"
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
      selectedDate: '',
      resources: [
        { label: 'John' },
        { label: 'Mary' },
        { label: 'Susan' },
        { label: 'Olivia' },
        { label: 'Board Room' },
        { label: 'Room-1' },
        { label: 'Room-2' }
      ]
    }
  },

  methods: {
    getHeadDay (timestamp) {
      return `The date is: ${timestamp.date}`
    }
  }
}
</script>
