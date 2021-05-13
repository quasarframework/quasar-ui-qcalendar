<template>
  <div>
    <div class="q-gutter-sm column justify-center">
    <div class="row justify-center full-width">
      <div class="column justify-center">
        <div class="row justify-evenly q-gutter-sm q-mb-lg">
          <span class="no-wrap">Note: setting Resource Height to 0 will make it 'auto' height</span>
        </div>
        <div class="row justify-evenly no-wrap q-gutter-sm" style="width: 600px;">
          <span class="col-shrink no-wrap" style="min-width: 142px;">Resource Height</span> <q-slider v-model="resourceHeight" label label-always :min="0" :max="200" class="col" />
        </div>
        <div class="row justify-evenly no-wrap q-gutter-sm" style="width: 600px;">
          <span class="col-shrink no-wrap" style="min-width: 142px;">Resource Min. Height</span> <q-slider v-model="resourceMinHeight" label label-always :min="0" :max="200" class="col" />
        </div>
      </div>
    </div>
    </div>
    <q-calendar-resource
      v-model="selectedDate"
      v-model:modelResources="resources"
      :resources="resources"
      :resource-height="resourceHeight"
      :resource-min-height="resourceMinHeight"
      resource-key="id"
      resource-label="name"
      locale="en-US"
      bordered
      sticky
      :style="styles"
    />
  </div>
</template>

<script>
import { QCalendarResource } from '@quasar/quasar-ui-qcalendar/src/QCalendarResource.js'
import '@quasar/quasar-ui-qcalendar/src/QCalendarVariables.sass'
import '@quasar/quasar-ui-qcalendar/src/QCalendarTransitions.sass'
import '@quasar/quasar-ui-qcalendar/src/QCalendarResource.sass'

export default {
  name: 'ThemeBuilderResource',
  components: {
    QCalendarResource
  },
  props: {
    modelValue: String,
    styles: Object
  },
  data () {
    return {
      selectedDate: '',
      resourceHeight: 70,
      resourceMinHeight: 20,
      resources: [
        { id: '1', name: 'John' },
        {
          id: '2',
          name: 'Board Room',
          expanded: false,
          children: [
            { id: '2.1', name: 'Room-1' },
            {
              id: '2.2',
              name: 'Room-2',
              expanded: false,
              children: [
                { id: '2.2.1', name: 'Partition-A' },
                { id: '2.2.2', name: 'Partition-B' },
                { id: '2.2.2', name: 'Partition-C' }
              ]
            }
          ]
        },
        { id: '3', name: 'Mary' },
        { id: '4', name: 'Susan' },
        { id: '5', name: 'Olivia' }
      ]
    }
  },
  watch: {
    modelValue (val) {
      this.selectedDate = val
    }
  },
  beforeMount () {
    this.selectedDate = this.modelValue
  }
}
</script>
