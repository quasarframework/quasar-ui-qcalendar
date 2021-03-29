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
        { name: 'John', height: 30 },
        {
          name: 'Board Room',
          expanded: false,
          height: 70,
          children: [
            { name: 'Room-1', height: 70 },
            {
              name: 'Room-2',
              expanded: false,
              height: 30,
              children: [
                { name: 'Partition-A', height: 40 },
                { name: 'Partition-B', height: 70 },
                { name: 'Partition-C', height: 70 }
              ]
            }
          ]
        },
        { name: 'Mary', height: 40 },
        { name: 'Susan', height: 80 },
        { name: 'Olivia', height: 80 }
      ]
    }
  }
}
</script>
