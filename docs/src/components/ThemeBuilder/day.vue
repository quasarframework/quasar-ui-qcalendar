<template>
  <div class="q-gutter-sm">
    <div class="q-mb-sm">
      <q-checkbox
        v-model="noActiveDate"
        dense
        label="No active date"
      />
    </div>

    <div
      class="row no-wrap"
      style="width: 600px;"
    >
      <span
        class="col-shrink no-wrap"
        style="min-width: 142px;"
      >Interval Range:</span>
      <q-range
        v-model="intervalRange"
        label
        label-always
        :min="0"
        :max="24"
        :step="intervalRangeStep"
        :left-label-value="leftLabelRange"
        :right-label-value="rightLabelRange"
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
      >Interval Height:</span>
      <q-slider
        v-model="intervalHeight"
        :min="20"
        :max="100"
        label
        label-always
        :label-value="intervalHeight + 'px'"
        class="col"
      />
    </div>
    <div class="row no-wrap items-center">
      <span
        class="col-shrink no-wrap"
        style="min-width: 150px;"
      >Interval Step (Section):</span>
      <div class="col q-gutter-sm">
        <q-radio
          v-model="intervalRangeStep"
          :val="1"
          label="60 min"
        />
        <q-radio
          v-model="intervalRangeStep"
          :val="0.5"
          label="30 min"
        />
        <q-radio
          v-model="intervalRangeStep"
          :val="0.25"
          label="15 min"
        />
      </div>
    </div>

    <q-calendar-day
      v-model="selectedDate"
      view="day"
      locale="en-US"
      bordered
      :interval-minutes="60 * intervalRangeStep"
      :interval-start="intervalStart"
      :interval-count="intervalCount"
      :interval-height="intervalHeight"
      :no-active-date="noActiveDate"
      style="max-height: 400px;"
      :style="styles"
    />
  </div>
</template>

<script>
import { QCalendarDay } from '@quasar/quasar-ui-qcalendar/src/index.js'
import '@quasar/quasar-ui-qcalendar/src/index.sass'

export default {
  name: 'ThemeBuilderDay',
  components: {
    QCalendarDay
  },
  props: {
    modelValue: String,
    styles: Object
  },
  data () {
    return {
      selectedDate: '',
      noActiveDate: false,
      intervalRange: { min: 0, max: 24 },
      intervalRangeStep: 1,
      intervalHeight: 20
    }
  },
  computed: {
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
    },
    intervalStart () {
      return this.intervalRange.min * (1 / this.intervalRangeStep)
    },
    intervalCount () {
      return (this.intervalRange.max - this.intervalRange.min) * (1 / this.intervalRangeStep)
    }
  },
  watch: {
    modelValue (val) {
      this.selectedDate = val
    },
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
  beforeMount () {
    this.selectedDate = this.modelValue
  }
}
</script>
