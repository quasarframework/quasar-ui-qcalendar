<template>
  <div>
    <div class="q-gutter-sm justify-center">
      <q-checkbox
        v-model="disabledDays"
        dense
        label="Disabled weekends"
      />
      <div class="row justify-evenly q-gutter-sm">
        <span />
        <span>Note: setting any height to 0 will make it 'auto'</span>
      </div>
      <div class="row justify-evenly q-gutter-sm full-width">
        <div class="col-5">
          <div class="q-mb-md">
            Resource Width:
          </div><q-slider
            v-model="resourceWidth"
            label
            label-always
            :min="60"
            :max="200"
            class="col"
          />
        </div>
        <div class="col-5">
          <div class="q-mb-md">
            Resource Height:
          </div> <q-slider
            v-model="resourceHeight"
            label
            label-always
            :min="0"
            :max="200"
            class="col"
          />
        </div>
      </div>
    </div>
    <q-calendar-scheduler
      v-model="selectedDate"
      v-model:modelResources="resources"
      resource-key="id"
      resource-label="name"
      view="week"
      locale="en-US"
      bordered
      no-scroll
      :disabled-weekdays="disabledWeekdays"
      :resource-height="resourceHeight"
      :resource-width="resourceWidth"
      :style="styles"
    />
  </div>
</template>

<script>
import { QCalendarScheduler } from '@quasar/quasar-ui-qcalendar/src/QCalendarScheduler.js'
import '@quasar/quasar-ui-qcalendar/src/QCalendarVariables.sass'
import '@quasar/quasar-ui-qcalendar/src/QCalendarTransitions.sass'
import '@quasar/quasar-ui-qcalendar/src/QCalendarScheduler.sass'

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
      resourceWidth: 150,
      resourceHeight: 70,
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
