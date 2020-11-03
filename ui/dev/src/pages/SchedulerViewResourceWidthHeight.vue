<template>
  <div class="row justify-center full-width" style="max-width: 800px; width: 100%;">
    <div class="row justify-center full-width q-pa-md">
      <div class="q-gutter-sm column justify-center">
        <div class="row justify-evenly q-gutter-sm" style="width: 400px;">
          <span>Note: setting any height to 0 will make it 'auto'</span>
        </div>
        <div class="row justify-evenly q-gutter-sm" style="width: 400px;">
          <span>Resource Width</span> <q-slider v-model="resourceWidth" label label-always :min="60" :max="200"/>
        </div>
        <div class="row justify-evenly q-gutter-sm" style="width: 400px;">
          <span>Resource Height</span> <q-slider v-model="resourceHeight" label label-always :min="0" :max="200"/>
        </div>
      </div>
    </div>
    <div class="row justify-center full-width">
      <q-calendar
        v-model="selectedDate"
        view="week-scheduler"
        :resources="resources"
        :resource-height="resourceHeight"
        :resource-width="resourceWidth"
        locale="en-us"
        sticky
        style="height: 200px; max-width: 800px; width: 100%;"
      />
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      resourceWidth: 100,
      resourceHeight: 70,
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
