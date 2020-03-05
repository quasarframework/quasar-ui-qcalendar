<template>
  <q-calendar
    v-model="selectedDate"
    view="scheduler"
    :resources="resources"
    :resource-height="50"
    locale="en-us"
    dark
    style="height: 400px;"
  />
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
