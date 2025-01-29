<template>
  <div>
    <div class="q-gutter-sm q-mb-sm">
      <q-checkbox v-model="mobile" dense label="Use Touch (set if on mobile)" />
      <q-checkbox v-model="noActiveDate" dense label="No active date" />
      <q-checkbox v-model="disabledDays" dense label="Disabled weekends" />
      <q-checkbox v-model="noOutsideDays" dense label="No outside days" />
      <q-checkbox v-model="showWorkweeks" dense label="Show workweeks" />
      <div class="full-width text-caption">Selection Type</div>
      <q-radio v-model="selectionType" dense val="off" label="Off" />
      <q-radio v-model="selectionType" dense val="toggle" label="Selection (toggle)" />
      <q-radio v-model="selectionType" dense val="range" label="Range" />
    </div>
    <div>
      <q-calendar-month
        ref="calendar"
        v-model="selectedDate"
        view="month"
        locale="en-US"
        bordered
        focusable
        hoverable
        :focusType="['day']"
        :no-active-date="noActiveDate"
        :selected-start-end-dates="startEndDates"
        :selected-dates="selectedDates"
        :disabled-weekdays="disabledWeekdays"
        :no-outside-days="noOutsideDays"
        :show-work-weeks="showWorkweeks"
        :day-min-height="70"
        :style="styles"
        @click-day="onToggleDay"
        @click-date="onToggleDate"
        @mousedown-day="onMouseDownDay"
        @mouseup-day="onMouseUpDay"
        @mousemove-day="onMouseMoveDay"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onBeforeMount } from 'vue'
import { QCalendarMonth, getDayIdentifier } from '@quasar/quasar-ui-qcalendar'
import '@quasar/quasar-ui-qcalendar/index.css'

interface Props {
  modelValue: string
  styles: Record<string, any>
}

const props = defineProps<Props>()

const selectedDate = ref('')
const selectedDates = ref<string[]>([])
const anchorTimestamp = ref<any>(null)
const otherTimestamp = ref<any>(null)
const mouseDown = ref(false)
const mobile = ref(false)
const noActiveDate = ref(false)
const selectionType = ref('off')
const disabledDays = ref(false)
const noOutsideDays = ref(false)
const showWorkweeks = ref(false)

const disabledWeekdays = computed(() => {
  return disabledDays.value === true ? [0, 6] : []
})

const startEndDates = computed(() => {
  const dates: string[] = []
  if (anchorDayIdentifier.value !== false && otherDayIdentifier.value !== false) {
    if (anchorDayIdentifier.value <= otherDayIdentifier.value) {
      dates.push(anchorTimestamp.value.date, otherTimestamp.value.date)
    } else {
      dates.push(otherTimestamp.value.date, anchorTimestamp.value.date)
    }
  }
  return dates
})

const anchorDayIdentifier = computed(() => {
  if (anchorTimestamp.value !== null) {
    return getDayIdentifier(anchorTimestamp.value)
  }
  return false
})

const otherDayIdentifier = computed(() => {
  if (otherTimestamp.value !== null) {
    return getDayIdentifier(otherTimestamp.value)
  }
  return false
})

// const lowIdentifier = computed(() => {
//   // returns lowest of the two values
//   return Math.min(anchorDayIdentifier.value, otherDayIdentifier.value)
// })

// const highIdentifier = computed(() => {
//   // returns highest of the two values
//   return Math.max(anchorDayIdentifier.value, otherDayIdentifier.value)
// })

watch(
  () => props.modelValue,
  (val) => {
    selectedDate.value = val
  },
)

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

function onToggleDate({ scope }: { scope: any }) {
  if (scope !== undefined) {
    toggleDate(scope)
  }
}

function onToggleDay({ scope }: { scope: any }) {
  if (scope !== undefined) {
    toggleDate(scope)
  }
}

function toggleDate(scope: any) {
  if (selectionType.value !== 'toggle') return
  const date = scope.timestamp.date
  if (selectedDates.value.includes(date)) {
    // remove the date
    for (let i = 0; i < selectedDates.value.length; ++i) {
      if (date === selectedDates.value[i]) {
        selectedDates.value.splice(i, 1)
        break
      }
    }
  } else {
    // add the date if not outside
    if (scope.outside !== true) {
      selectedDates.value.push(date)
    }
  }
}

function onMouseDownDay({ scope, event }: { scope: any; event: MouseEvent }) {
  if (selectionType.value !== 'range') return
  if (leftClick(event)) {
    if (
      mobile.value === true &&
      anchorTimestamp.value !== null &&
      otherTimestamp.value !== null &&
      anchorTimestamp.value.date === otherTimestamp.value.date
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

function onMouseUpDay({ scope, event }: { scope: any; event: MouseEvent }) {
  if (selectionType.value !== 'range') return
  if (leftClick(event)) {
    // mouse is up, capture last and cancel selection
    otherTimestamp.value = scope.timestamp
    mouseDown.value = false
  }
}

function onMouseMoveDay({ scope }: { scope: any }) {
  if (selectionType.value !== 'range') return
  if (mouseDown.value === true) {
    otherTimestamp.value = scope.timestamp
  }
}
</script>
