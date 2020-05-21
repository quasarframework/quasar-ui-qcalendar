<template>
  <div class="row justify-center full-width q-pa-md">
    <div class="q-gutter-sm full-width row justify-center">
      <q-checkbox v-model="bordered" label="Bordered" />
      <q-checkbox v-model="sticky" label="Sticky" />
      <q-checkbox v-model="short" label="Short Interval Label" />
    </div>
    <div class="q-gutter-sm">
      <q-calendar
        v-model="selectedDate"
        view="day-resource"
        :resources="resources"
        :bordered="bordered"
        :sticky="sticky"
        :short-interval-label="short"
        locale="en-us"
        style="height: 200px; max-width: 800px; width: 100%;"
      />
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      bordered: false,
      sticky: false,
      short: false,
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
