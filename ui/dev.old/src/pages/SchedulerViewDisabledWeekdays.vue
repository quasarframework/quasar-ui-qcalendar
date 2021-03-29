<template>
  <div style="max-width: 800px; width: 100%;">
    <q-calendar
      v-model="selectedDate"
      view="week-scheduler"
      :resources="resources"
      :disabled-weekdays="[0,6]"
      locale="en-us"
      style="height: 400px;"
    />
  </div>
</template>

<script>
export default {
  data () {
    return {
      selectedDate: '2019-04-01',
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
  }
}
</script>
