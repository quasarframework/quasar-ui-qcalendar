<template>
  <div class="row justify-center full-width" style="max-width: 800px; width: 100%;">
    <div class="row justify-center full-width q-pa-md">
      <div class="q-gutter-sm column justify-center">
        <div class="row justify-evenly q-gutter-sm" style="width: 400px;">
          <span>Cell Min. Width</span>
          <q-slider
          v-model="minWidth"
          label
          label-always
          :min="50"
          :max="300"
          :step="5"
        />
        </div>
        <div class="row justify-evenly q-gutter-sm" style="width: 400px;">
          <span>Max Days</span>
          <q-slider
            v-model="maxDays"
            label
            label-always
            :min="1"
            :max="100"
          />
        </div>
      </div>
    </div>
    <div class="row justify-center" style="max-width: 100%;">

      <div class="full-width q-ma-md q-pl-md"><strong>Custom Scheduler</strong></div>

      <q-calendar
        v-model="selectedDate"
        view="custom-scheduler"
        bordered
        :resources="resources"
        resource-key="name"
        :resource-height="50"
        :resource-width="120"
        :max-days="maxDays"
        :cell-width="minWidth + 'px'"
        locale="en-us"
        style="height: 300px; max-width: 800px"
      />

      <div class="full-width q-ma-md q-pl-md"><strong>Month Scheduler</strong></div>

      <q-calendar
        v-model="selectedDate"
        view="month-scheduler"
        bordered
        :resources="resources"
        resource-key="name"
        :resource-height="50"
        :resource-width="120"
        :max-days="maxDays"
        :cell-width="minWidth + 'px'"
        locale="en-us"
        style="height: 300px; max-width: 800px"
      />
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      selectedDate: '',
      minWidth: 100,
      maxDays: 7,
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
