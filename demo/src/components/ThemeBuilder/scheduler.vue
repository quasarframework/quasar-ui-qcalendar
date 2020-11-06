<template>
  <div>
    <div class="q-gutter-sm justify-center">
      <q-checkbox v-model="disabledDays" dense label="Disabled weekends" />
      <div class="row justify-evenly q-gutter-sm">
        <span>Note: setting any height to 0 will make it 'auto'</span>
      </div>
      <div class="row justify-evenly q-gutter-sm full-width">
        <div class="col-5"><div class="q-mb-md">Resource Width: </div><q-slider v-model="resourceWidth" label label-always :min="60" :max="200" class="col" /></div>
        <div class="col-5"><div class="q-mb-md">Resource Height: </div> <q-slider v-model="resourceHeight" label label-always :min="0" :max="200" class="col" /></div>
      </div>
    </div>
    <q-calendar
      v-model="selectedDate"
      view="week-scheduler"
      locale="en-us"
      bordered
      no-scroll
      :disabled-weekdays="disabledWeekdays"
      :resources="resources"
      resource-key="name"
      :resource-height="resourceHeight"
      :resource-width="resourceWidth"
      :style="styles"
    />

  </div>
</template>

<script>
export default {
  name: 'ThemeBuilderScheduler',
  props: {
    value: String,
    styles: Object
  },
  data () {
    return {
      selectedDate: '',
      disabledDays: false,
      resourceWidth: 150,
      resourceHeight: 70,
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
  },

  beforeMount () {
    this.selectedDate = this.value
  },

  watch: {
    value (val) {
      this.selectedDate = val
    }
  },

  computed: {
    disabledWeekdays () {
      return this.disabledDays === true ? [0, 6] : []
    }
  }
}
</script>
