<template>
  <div style="max-width: 800px; width: 100%;">
    <q-calendar
      v-model="selectedDate"
      view="day-resource"
      :resources="resources"
      resource-key="name"
      :resource-height="50"
      bordered
      locale="en-us"
      style="height: 300px;"
    />
  </div>
</template>

<script>
export default {
  data () {
    return {
      selectedDate: '',
      resources: [
        { name: 'John' },
        {
          name: 'Board Room',
          expanded: false,
          children: [
            { name: 'Room-1' },
            {
              name: 'Room-2',
              expanded: false,
              children: [
                { name: 'Partition-A' },
                { name: 'Partition-B' },
                { name: 'Partition-C' }
              ]
            }
          ]
        },
        { name: 'Mary' },
        { name: 'Susan' },
        { name: 'Olivia' }
      ]
    }
  }
}
</script>
