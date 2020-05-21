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
        <div class="row justify-evenly q-gutter-sm" style="width: 400px;">
          <span>Resource Width</span> <q-slider v-model="resourceWidth" label label-always :min="60" :max="200"/>
        </div>
        <div class="row justify-evenly q-gutter-sm" style="width: 400px;">
          <span>Resource Height</span> <q-slider v-model="resourceHeight" label label-always :min="0" :max="200"/>
        </div>
        <div class="row justify-evenly q-gutter-sm" style="width: 400px;">
          <span>Calendar Width</span> <q-slider v-model="calendarWidth" label label-always :min="200" :max="800"/>
        </div>
        <div class="row justify-evenly q-gutter-sm" style="width: 400px;">
          <span>Calendar Height</span> <q-slider v-model="calendarHeight" label label-always :min="0" :max="600"/>
        </div>
      </div>
    </div>
    <div class="q-gutter-sm">
      <q-calendar
        v-model="selectedDate"
        view="day-resource"
        :resources="resources"
        :interval-width="intervalWidth"
        :interval-height="intervalHeight"
        :resource-width="resourceWidth"
        :resource-height="resourceHeight"
        locale="en-us"
        :style="style"
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
      resourceWidth: 100,
      resourceHeight: 70,
      calendarWidth: 800,
      calendarHeight: 200,
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
  },

  computed: {
    style () {
      return {
        height: (this.calendarHeight === 0 ? 'auto' : this.calendarHeight + 'px'),
        maxWidth: this.calendarWidth + 'px',
        width: '100%'
      }
    }
  }
}
</script>
