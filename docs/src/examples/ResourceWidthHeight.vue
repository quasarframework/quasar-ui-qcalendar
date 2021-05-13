<template>
  <div class="subcontent">
    <navigation-bar
      @today="onToday"
      @prev="onPrev"
      @next="onNext"
    />

    <div class="row justify-center full-width">
      <div class="column justify-center">
        <div class="row justify-evenly q-gutter-sm q-mb-lg">
          <span class="no-wrap">Note: setting Resource Height to 0 will make it 'auto' height</span>
        </div>
        <div class="row justify-evenly no-wrap q-gutter-sm" style="width: 600px;">
          <span class="col-shrink no-wrap" style="min-width: 142px;">Resource Width</span> <q-slider v-model="resourceWidth" label label-always :min="60" :max="200" class="col" />
        </div>
        <div class="row justify-evenly no-wrap q-gutter-sm" style="width: 600px;">
          <span class="col-shrink no-wrap" style="min-width: 142px;">Resource Height</span> <q-slider v-model="resourceHeight" label label-always :min="0" :max="200" class="col" />
        </div>
        <div class="row justify-evenly no-wrap q-gutter-sm" style="width: 600px;">
          <span class="col-shrink no-wrap" style="min-width: 142px;">Resource Min. Height</span> <q-slider v-model="resourceMinHeight" label label-always :min="0" :max="200" class="col" />
        </div>
      </div>
    </div>

    <div class="row justify-center">
      <div style="display: flex; max-width: 800px; width: 100%;">
        <q-calendar-resource
          ref="calendar"
          v-model="selectedDate"
          v-model:modelResources="resources"
          resource-key="id"
          resource-label="name"
          :resource-height="resourceHeight"
          :resource-min-height="resourceMinHeight"
          bordered
          sticky
          @change="onChange"
          @moved="onMoved"
          @resource-expanded="onResourceExpanded"
          @click-date="onClickDate"
          @click-time="onClickTime"
          @click-resource="onClickResource"
          @click-head-resources="onClickHeadResources"
          @click-interval="onClickInterval"
          :style="styles"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { QCalendarResource } from '@quasar/quasar-ui-qcalendar/src/QCalendarResource.js'
import { today } from '@quasar/quasar-ui-qcalendar/src/Timestamp.js'
import '@quasar/quasar-ui-qcalendar/src/QCalendarVariables.sass'
import '@quasar/quasar-ui-qcalendar/src/QCalendarTransitions.sass'
import '@quasar/quasar-ui-qcalendar/src/QCalendarResource.sass'

import { defineComponent } from 'vue'
import NavigationBar from '../components/NavigationBar.vue'

export default defineComponent({
  name: 'ResourceWidthHeight',
  components: {
    NavigationBar,
    QCalendarResource
  },
  data () {
    return {
      selectedDate: today(),
      resourceWidth: 100,
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
  computed: {
    styles () {
      const s = {
        '--calendar-resources-width': this.resourceWidth + 'px'
      }
      console.log(s)
      return s
    }
  },
  methods: {
    onToday () {
      this.$refs.calendar.moveToToday()
    },
    onPrev () {
      this.$refs.calendar.prev()
    },
    onNext () {
      this.$refs.calendar.next()
    },
    onMoved (data) {
      console.log('onMoved', data)
    },
    onChange (data) {
      console.log('onChange', data)
    },
    onResourceExpanded (data) {
      console.log('onResourceExpanded', data)
    },
    onClickDate (data) {
      console.log('onClickDate', data)
    },
    onClickTime (data) {
      console.log('onClickTime', data)
    },
    onClickResource (data) {
      console.log('onClickResource', data)
    },
    onClickHeadResources (data) {
      console.log('onClickHeadResources', data)
    },
    onClickInterval (data) {
      console.log('onClickInterval', data)
    }
  }
})
</script>
