<template>
  <div>
    <div class="q-gutter-sm">
      <q-checkbox
        v-model="disabledDays"
        dense
        label="Disabled weekends"
      />
      <div class="q-gutter-sm column">
        <div class="row full-width">
          <div class="column">
            <div class="row q-mb-lg">
              <span class="no-wrap">Note: setting Resource Height to 0 will make it 'auto' height</span>
            </div>
            <div
              class="row no-wrap"
              style="width: 600px;"
            >
              <span
                class="col-shrink no-wrap"
                style="min-width: 142px;"
              >Resource Height</span> <q-slider
                v-model="resourceHeight"
                label
                label-always
                :min="0"
                :max="200"
                class="col"
              />
            </div>
            <div
              class="row no-wrap"
              style="width: 600px;"
            >
              <span
                class="col-shrink no-wrap"
                style="min-width: 142px;"
              >Resource Min. Height</span> <q-slider
                v-model="resourceMinHeight"
                label
                label-always
                :min="0"
                :max="200"
                class="col"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
    <q-calendar-scheduler
      v-model="selectedDate"
      v-model:model-resources="resources"
      :resource-height="resourceHeight"
      :resource-min-height="resourceMinHeight"
      resource-key="id"
      resource-label="name"
      view="week"
      locale="en-US"
      bordered
      no-scroll
      :disabled-weekdays="disabledWeekdays"
      style="height: 400px;"
      :style="styles"
    />
  </div>
</template>

<script>
import { QCalendarScheduler } from '@quasar/quasar-ui-qcalendar/src/index.js'
import '@quasar/quasar-ui-qcalendar/src/index.sass'

export default {
  name: 'ThemeBuilderScheduler',
  components: {
    QCalendarScheduler
  },
  props: {
    modelValue: String,
    styles: Object
  },
  data () {
    return {
      selectedDate: '',
      disabledDays: false,
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
                { id: '2.2.3', name: 'Partition-C' }
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

  computed: {
    disabledWeekdays () {
      return this.disabledDays === true ? [ 0, 6 ] : []
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
