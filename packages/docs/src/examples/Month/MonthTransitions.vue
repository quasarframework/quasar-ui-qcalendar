<template>
  <div class="subcontent">
    <navigation-bar @today="onToday" @prev="onPrev" @next="onNext" />

    <div class="q-ma-sm row justify-center q-gutter-sm">
      <q-select
        v-model="previousTransition"
        label="Previous Transition"
        outlined
        dense
        options-dense
        :options="transitions"
        style="min-width: 160px"
      />

      <q-select
        v-model="nextTransition"
        label="Next Transition"
        outlined
        dense
        options-dense
        :options="transitions"
        style="min-width: 160px"
      />
    </div>

    <div class="row justify-center">
      <div style="display: flex; max-width: 800px; width: 100%">
        <q-calendar-month
          ref="calendar"
          v-model="selectedDate"
          :day-min-height="40"
          animated
          bordered
          :transition-prev="previousTransition"
          :transition-next="nextTransition"
          @change="onChange"
          @moved="onMoved"
          @click-date="onClickDate"
          @click-day="onClickDay"
          @click-workweek="onClickWorkweek"
          @click-head-workweek="onClickHeadWorkweek"
          @click-head-day="onClickHeadDay"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { QCalendarMonth, today, Timestamp } from '@quasar/quasar-ui-qcalendar'
import '@quasar/quasar-ui-qcalendar/index.css'

import { ref } from 'vue'
import NavigationBar from 'components/NavigationBar.vue'

const calendar = ref<QCalendarMonth>(),
  selectedDate = ref(today()),
  transitions = ref([
    'slide-left',
    'slide-right',
    'slide-up',
    'slide-down',
    'roll-left',
    'roll-right',
    'roll-up',
    'roll-down',
    'jump-left',
    'jump-right',
    'jump-up',
    'jump-down',
    'fade',
    'scale',
    'rotate',
    'spin',
    'flip',
  ]),
  previousTransition = ref('slide-left'),
  nextTransition = ref('slide-right')

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
function onClickDate(data: Timestamp) {
  console.info('onClickDate', data)
}
function onClickDay(data: Timestamp) {
  console.info('onClickDay', data)
}
function onClickWorkweek(data: Timestamp) {
  console.info('onClickWorkweek', data)
}
function onClickHeadDay(data: Timestamp) {
  console.info('onClickHeadDay', data)
}
function onClickHeadWorkweek(data: Timestamp) {
  console.info('onClickHeadWorkweek', data)
}
</script>
