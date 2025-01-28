<template>
  <div>
    <div class="q-mb-sm q-gutter-sm">
      <q-checkbox v-model="mobile" dense label="Use Touch (set if on mobile)" />
      <q-checkbox v-model="noActiveDate" dense label="No active date" />
      <q-checkbox v-model="disabledDays" dense label="Disabled weekends" />
    </div>

    <div class="row no-wrap q-mb-lg">
      <span class="no-wrap" style="min-width: 130px">Selection Type:</span>
      <div class="q-gutter-sm">
        <q-radio v-model="selectionType" dense val="off" label="Off" />
        <q-radio v-model="selectionType" dense val="toggle" label="Selection (toggle)" />
        <q-radio v-model="selectionType" dense val="range" label="Range" />
      </div>
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
      view="week"
      bordered
      time-clicks-clamped
      :interval-minutes="60 * intervalRangeStep"
      :interval-start="intervalStart"
      :interval-count="intervalCount"
      :interval-height="intervalHeight"
      :disabled-weekdays="disabledWeekdays"
      :no-active-date="noActiveDate"
      :selected-dates="selectedDates"
      :selected-start-end-dates="startEndDates"
      locale="en-US"
      style="height: 400px"
      :style="styles"
      @click-time="onToggleTime"
      @mousedown-time="onMouseDownTime"
      @mouseup-time="onMouseUpTime"
      @mousemove-time="onMouseMoveTime"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onBeforeMount } from 'vue'
import {
  QCalendarDay,
  getDayTimeIdentifier,
  getDateTime,
  copyTimestamp,
} from '@quasar/quasar-ui-qcalendar'
import '@quasar/quasar-ui-qcalendar/index.css'

interface Props {
  modelValue: string
  styles: Record<string, any>
}

const props = defineProps<Props>()

const selectedDate = ref('')
const noActiveDate = ref(false)
const disabledDays = ref(false)
const intervalRange = ref({ min: 0, max: 24 })
const intervalRangeStep = ref(1)
const intervalHeight = ref(20)
const selectedDates = ref<string[]>([])
const anchorTimestamp = ref<any>(null)
const otherTimestamp = ref<any>(null)
const mouseDown = ref(false)
const mobile = ref(false)
const selectionType = ref('off')

const disabledWeekdays = computed(() => {
  return disabledDays.value === true ? [0, 6] : []
})

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

const startEndDates = computed(() => {
  const dates: string[] = []
  if (anchorDayTimeIdentifier.value !== false && otherDayTimeIdentifier.value !== false) {
    if (anchorDayTimeIdentifier.value <= otherDayTimeIdentifier.value) {
      dates.push(getDateTime(anchorTimestamp.value), getDateTime(otherTimestamp.value))
    } else {
      dates.push(getDateTime(otherTimestamp.value), getDateTime(anchorTimestamp.value))
    }
  }
  return dates
})

const anchorDayTimeIdentifier = computed(() => {
  if (anchorTimestamp.value !== null) {
    return getDayTimeIdentifier(anchorTimestamp.value)
  }
  return false
})

const otherDayTimeIdentifier = computed(() => {
  if (otherTimestamp.value !== null) {
    return getDayTimeIdentifier(otherTimestamp.value)
  }
  return false
})

// const lowIdentifier = computed(() => {
//   // returns lowest of the two values
//   return Math.min(anchorDayTimeIdentifier.value, otherDayTimeIdentifier.value)
// })

// const highIdentifier = computed(() => {
//   // returns highest of the two values
//   return Math.max(anchorDayTimeIdentifier.value, otherDayTimeIdentifier.value)
// })

watch(
  () => props.modelValue,
  (val) => {
    selectedDate.value = val
  },
)

watch(intervalRangeStep, (val) => {
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
})

watch(selectionType, () => {
  // clear any existing data
  anchorTimestamp.value = null
  otherTimestamp.value = null
  selectedDates.value.splice(0, selectedDates.value.length)
})

onBeforeMount(() => {
  selectedDate.value = props.modelValue
})

function leftClick(e: MouseEvent) {
  return e.button === 0
}

function onToggleTime({ scope }: { scope: any }) {
  if (selectionType.value !== 'toggle' || scope === undefined) {
    return
  }

  // make a copy of the timestamp
  const ts = copyTimestamp(scope.timestamp)

  // get date with time
  const t = getDateTime(ts)

  // toggle to/from array
  if (selectedDates.value.includes(t)) {
    // remove the date
    for (let i = 0; i < selectedDates.value.length; ++i) {
      if (t === selectedDates.value[i]) {
        selectedDates.value.splice(i, 1)
        break
      }
    }
  } else {
    // add the date if not outside
    if (scope.outside !== true) {
      selectedDates.value.push(t)
    }
  }
}

function onMouseDownTime({ scope, event }: { scope: any; event: MouseEvent }) {
  if (selectionType.value !== 'range') return
  if (leftClick(event)) {
    if (
      mobile.value === true &&
      anchorTimestamp.value !== null &&
      otherTimestamp.value !== null &&
      getDateTime(anchorTimestamp.value) === getDateTime(otherTimestamp.value)
    ) {
      otherTimestamp.value = scope.timestamp
      mouseDown.value = false
      return
    }
    // mouse is down, start selection and capture current
    mouseDown.value = true
    anchorTimestamp.value = scope.timestamp
    otherTimestamp.value = scope.timestamp
  }
}

function onMouseUpTime({ scope, event }: { scope: any; event: MouseEvent }) {
  if (selectionType.value !== 'range') return
  if (mobile.value !== true && leftClick(event)) {
    // mouse is up, capture last and cancel selection
    otherTimestamp.value = scope.timestamp
    mouseDown.value = false
  }
}

function onMouseMoveTime({ scope }: { scope: any }) {
  if (selectionType.value !== 'range') return
  if (mobile.value !== true && mouseDown.value === true) {
    otherTimestamp.value = scope.timestamp
  }
}
</script>
