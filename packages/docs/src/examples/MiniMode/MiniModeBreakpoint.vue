<template>
  <div class="subcontent">
    <p class="text-body2 text-center q-mb-md">
      Resize the page to see how mini-mode weekday labels respond to configured breakpoints.
    </p>

    <navigation-bar @today="onToday" @prev="onPrev" @next="onNext" />

    <div style="display: flex; justify-content: center; align-items: center; flex-wrap: nowrap">
      <div style="display: flex; max-width: 600px; width: 100%">
        <q-calendar-month
          ref="calendar"
          v-model="selectedDate"
          mini-mode="auto"
          breakpoint="sm"
          animated
          bordered
          :day-height="isMiniMode ? 0 : 50"
          @mini-mode="onMiniMode"
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
import { QCalendarMonth } from '@quasar/quasar-ui-qcalendar'
import { today, Timestamp } from '@timestamp-js/core'
import '@quasar/quasar-ui-qcalendar/index.css'

import { ref } from 'vue'
import NavigationBar from '@/components/NavigationBar.vue'

const calendar = ref<QCalendarMonth>()
const selectedDate = ref(today())
const isMiniMode = ref(false)

function onMiniMode(val: boolean) {
  isMiniMode.value = val
}
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
