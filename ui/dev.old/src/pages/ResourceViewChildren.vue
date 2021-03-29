<template>
  <div class="row justify-center full-width q-pa-md">
    <q-calendar
      v-model="selectedDate"
      view="day-resource"
      :resources="resources"
      resource-key="name"
      :resource-height="50"
      :resource-width="120"
      bordered
      sticky
      locale="en-us"
      style="height: 300px; max-width: 800px; width: 100%;"
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
