<template>
  <div class="q-gutter-sm">
    <div class="q-mb-sm">
      <q-checkbox v-model="noActiveDate" dense label="No active date" />
    </div>

    <div class="row no-wrap" style="width: 600px">
      <span class="col-shrink no-wrap" style="min-width: 142px">Interval Range:</span>
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

    <div class="row no-wrap" style="width: 600px">
      <span class="col-shrink no-wrap" style="min-width: 142px">Interval Height:</span>
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
      <span class="col-shrink no-wrap" style="min-width: 150px">Interval Step (Section):</span>
      <div class="col q-gutter-sm">
        <q-radio v-model="intervalRangeStep" :val="1" label="60 min" />
        <q-radio v-model="intervalRangeStep" :val="0.5" label="30 min" />
        <q-radio v-model="intervalRangeStep" :val="0.25" label="15 min" />
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
      style="max-height: 400px"
      :style="styles"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onBeforeMount } from 'vue'
import { QCalendarDay } from '@quasar/quasar-ui-qcalendar'
import '@quasar/quasar-ui-qcalendar/index.css'

interface Props {
  modelValue: string
  styles: Record<string, any>
}

const props = defineProps<Props>()

const selectedDate = ref('')
const noActiveDate = ref(false)
const intervalRange = ref({ min: 0, max: 24 })
const intervalRangeStep = ref(1)
const intervalHeight = ref(20)

const leftLabelRange = computed(() => {
  const a = Math.floor(intervalRange.value.min)
  const b = Number((intervalRange.value.min % 1).toFixed(2))
  const c = 60 * b
  return a + ':' + (c < 10 ? c + '0' : c)
})

const rightLabelRange = computed(() => {
  const a = Math.floor(intervalRange.value.max)
  const b = Number((intervalRange.value.max % 1).toFixed(2))
  const c = 60 * b
  return a + ':' + (c < 10 ? c + '0' : c)
})

const intervalStart = computed(() => {
  return intervalRange.value.min * (1 / intervalRangeStep.value)
})

const intervalCount = computed(() => {
  return (intervalRange.value.max - intervalRange.value.min) * (1 / intervalRangeStep.value)
})

watch(
  () => props.modelValue,
  (val) => {
    selectedDate.value = val
  },
)

watch(
  () => intervalRangeStep.value,
  (val) => {
    // normalize min/max values according to the step value
    const calcMin = (range: number) => {
      const b = Number((range % 1).toFixed(2))
      const c = b % val
      if (c > 0) {
        return range + c
      }
      return range
    }
    const calcMax = (range: number) => {
      const b = Number((range % 1).toFixed(2))
      const c = b % val
      if (c > 0) {
        return range - c
      }
      return range
    }
    intervalRange.value.min = calcMin(intervalRange.value.min)
    intervalRange.value.max = calcMax(intervalRange.value.max)
  },
)

onBeforeMount(() => {
  selectedDate.value = props.modelValue
})
</script>
