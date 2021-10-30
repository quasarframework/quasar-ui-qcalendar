<template>
  <div class="subcontent">
    <navigation-bar
      @today="onToday"
      @prev="onPrev"
      @next="onNext"
    />

    <div class="row justify-center full-width">
      <div class="column justify-center">
        <div
          class="row justify-evenly no-wrap q-gutter-sm items-center"
          style="width: 600px;"
        >
          <span
            class="col-shrink no-wrap"
            style="min-width: 142px;"
          >Interval Start</span>
          <q-range
            v-model="intervalRange"
            label
            label-always
            :min="0"
            :max="24"
            :step="intervalRangeStep"
            class="col"
            :left-label-value="leftLabelRange"
            :right-label-value="rightLabelRange"
          />
        </div>

        <div
          class="row justify-evenly no-wrap q-gutter-sm items-center"
          style="width: 600px;"
        >
          <span
            class="col-shrink no-wrap"
            style="min-width: 142px;"
          >Interval Minutes</span>
          <q-option-group
            v-model="intervalRangeStep"
            :options="options"
            type="radio"
            inline
            class="col"
          />
        </div>
      </div>
    </div>

    <div class="row justify-center">
      <div style="display: flex; max-width: 800px; width: 100%; max-height: 400px;">
        <q-calendar-resource
          ref="calendar"
          v-model="selectedDate"
          v-model:model-resources="resources"
          resource-key="id"
          resource-label="name"
          :interval-minutes="60 * intervalRangeStep"
          :interval-start="intervalStart"
          :interval-count="intervalCount"
          animated
          bordered
          @change="onChange"
          @moved="onMoved"
          @resource-expanded="onResourceExpanded"
          @click-date="onClickDate"
          @click-time="onClickTime"
          @click-resource="onClickResource"
          @click-head-resources="onClickHeadResources"
          @click-interval="onClickInterval"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { QCalendarResource, today } from '@quasar/quasar-ui-qcalendar/src/index.js'
import '@quasar/quasar-ui-qcalendar/src/QCalendarVariables.sass'
import '@quasar/quasar-ui-qcalendar/src/QCalendarTransitions.sass'
import '@quasar/quasar-ui-qcalendar/src/QCalendarResource.sass'

import { defineComponent } from 'vue'
import NavigationBar from '../components/NavigationBar.vue'

export default defineComponent({
  name: 'ResourceModifyIntervals',
  components: {
    NavigationBar,
    QCalendarResource
  },
  data () {
    return {
      selectedDate: today(),
      resources: [
        { id: '1', name: 'John' },
        { id: '2', name: 'Board Room' },
        { id: '3', name: 'Mary' },
        { id: '4', name: 'Susan' },
        { id: '5', name: 'Olivia' }
      ],
      intervalRange: { min: 0, max: 24 },
      intervalRangeStep: 1,
      options: [
        { label: '60 min', value: 1 },
        { label: '30 min', value: 0.5 },
        { label: '15 min', value: 0.25 }
      ]
    }
  },
  computed: {
    intervalStart () {
      return this.intervalRange.min * (1 / this.intervalRangeStep)
    },

    intervalCount () {
      return (this.intervalRange.max - this.intervalRange.min) * (1 / this.intervalRangeStep)
    },

    leftLabelRange () {
      const a = Math.floor(this.intervalRange.min)
      const b = Number((this.intervalRange.min % 1).toFixed(2))
      const c = 60 * b
      return a + ':' + (c < 10 ? c + '0' : c)
    },

    rightLabelRange () {
      const a = Math.floor(this.intervalRange.max)
      const b = Number((this.intervalRange.max % 1).toFixed(2))
      const c = 60 * b
      return a + ':' + (c < 10 ? c + '0' : c)
    }
  },
  watch: {
    intervalRangeStep (val) {
      // normalize min/max values according to the step value
      const calcMin = (range) => {
        const b = Number((range % 1).toFixed(2))
        const c = b % val
        if (c > 0) {
          return range + c
        }
        return range
      }
      const calcMax = (range) => {
        const b = Number((range % 1).toFixed(2))
        const c = b % val
        if (c > 0) {
          return range - c
        }
        return range
      }
      this.intervalRange.min = calcMin(this.intervalRange.min)
      this.intervalRange.max = calcMax(this.intervalRange.max)
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
