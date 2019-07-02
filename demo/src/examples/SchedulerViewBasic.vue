<template>
  <q-calendar
    v-model="selectedDate"
    view="scheduler"
    :resources="resources"
    :interval-height="50"
    locale="en-us"
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
        { label: 'Conference Room 1' },
        { label: 'Conference Room 2' }
      ]
    }
  }
}
</script>
