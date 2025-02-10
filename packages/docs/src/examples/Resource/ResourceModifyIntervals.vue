<template>
  <div class="subcontent">
    <navigation-bar @today="onToday" @prev="onPrev" @next="onNext" />

    <div class="row justify-center full-width">
      <div class="column justify-center">
        <div class="row justify-evenly no-wrap q-gutter-sm items-center" style="width: 600px">
          <span class="col-shrink no-wrap" style="min-width: 142px">Interval Start</span>
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

        <div class="row justify-evenly no-wrap q-gutter-sm items-center" style="width: 600px">
          <span class="col-shrink no-wrap" style="min-width: 142px">Interval Minutes</span>
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
      <div style="display: flex; max-width: 800px; width: 100%; max-max-height: 400px">
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

<script setup lang="ts">
import { QCalendarResource, today, Timestamp } from '@quasar/quasar-ui-qcalendar'
import '@quasar/quasar-ui-qcalendar/index.css'

import { ref, computed, watch } from 'vue'
import NavigationBar from 'components/NavigationBar.vue'

interface Resource {
  id: string
  name: string
  height?: number
  expanded?: boolean
  children?: Resource[]
}

const calendar = ref<QCalendarResource>(),
  selectedDate = ref(today()),
  resources = ref<Resource[]>([
    { id: '1', name: 'John' },
    { id: '2', name: 'Board Room' },
    { id: '3', name: 'Mary' },
    { id: '4', name: 'Susan' },
    { id: '5', name: 'Olivia' },
  ]),
  intervalRange = ref({ min: 0, max: 24 }),
  intervalRangeStep = ref(1),
  options = ref([
    { label: '60 min', value: 1 },
    { label: '30 min', value: 0.5 },
    { label: '15 min', value: 0.25 },
  ])

const intervalStart = computed(() => {
  return intervalRange.value.min * (1 / intervalRangeStep.value)
})

const intervalCount = computed(() => {
  return (intervalRange.value.max - intervalRange.value.min) * (1 / intervalRangeStep.value)
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

function onToday() {
  if (calendar.value) {
    calendar.value.moveToToday()
  }
}
function onPrev() {
  if (calendar.value) {
    calendar.value.prev()
  }
}
function onNext() {
  if (calendar.value) {
    calendar.value.next()
  }
}
function onMoved(data: Timestamp) {
  console.info('onMoved', data)
}
function onChange(data: { start: Timestamp; end: Timestamp; days: Timestamp[] }) {
  console.info('onChange', data)
}
function onResourceExpanded(data: Timestamp) {
  console.info('onResourceExpanded', data)
}
function onClickDate(data: Timestamp) {
  console.info('onClickDate', data)
}
function onClickTime(data: Timestamp) {
  console.info('onClickTime', data)
}
function onClickResource(data: Timestamp) {
  console.info('onClickResource', data)
}
function onClickHeadResources(data: Timestamp) {
  console.info('onClickHeadResources', data)
}
function onClickInterval(data: Timestamp) {
  console.info('onClickInterval', data)
}
</script>
