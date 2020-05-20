<template>
  <div class="row justify-center full-width q-pa-md">
    <div class="row justify-center full-width q-pa-md">
      <div class="q-gutter-sm column justify-center">
        <div class="row justify-evenly q-gutter-sm" style="width: 400px;">
          <span>Note: setting any height to 0 will make it 'auto'</span>
        </div>
        <div class="row justify-evenly q-gutter-sm" style="width: 400px;">
          <span>Interval Width</span> <q-slider v-model="intervalWidth" label label-always :min="60" :max="200"/>
        </div>
        <div class="row justify-evenly q-gutter-sm" style="width: 400px;">
          <span>Interval Height</span> <q-slider v-model="intervalHeight" label label-always :min="0" :max="200"/>
        </div>
      </div>
      <q-calendar
        v-model="selectedDate"
        view="day-resource"
        :resources="resources"
        :resource-height="50"
        :interval-width="intervalWidth"
        :interval-height="intervalHeight"
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
      intervalWidth: 100,
      intervalHeight: 20,
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
