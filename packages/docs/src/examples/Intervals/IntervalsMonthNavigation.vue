<template>
  <div class="subcontent">
    <div class="line">
      This example uses the <code class="markdown-token">use-navigation</code> property along with
      the <code class="markdown-token">focusable</code> and
      <code class="markdown-token">focus-type</code> properties.<br />
      If the calendar has focus you can use the <kbd>&larr;</kbd> and <kbd>&rarr;</kbd> keys on your
      keyboard for navigation.<br />
      On the intervals, you can use <kbd>Tab</kbd> and <kbd>Shift</kbd>+<kbd>Tab</kbd> for
      navigation.
    </div>

    <navigation-bar @today="onToday" @prev="onPrev" @next="onNext" />

    <div class="row justify-center">
      <div style="display: flex; max-width: 800px; width: 100%; height: 400px">
        <q-calendar-day
          ref="calendar"
          v-model="selectedDate"
          view="month"
          use-navigation
          hoverable
          focusable
          :focus-type="['interval', 'weekday']"
          animated
          bordered
          @change="onChange"
          @moved="onMoved"
          @click-date="onClickDate"
          @click-time="onClickTime"
          @click-interval="onClickInterval"
          @click-head-intervals="onClickHeadIntervals"
          @click-head-day="onClickHeadDay"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { QCalendarDay, today, Timestamp } from '@quasar/quasar-ui-qcalendar'
import '@quasar/quasar-ui-qcalendar/index.css'
import { ref } from 'vue'
import NavigationBar from 'components/NavigationBar.vue'

const calendar = ref<QCalendarDay>(),
  selectedDate = ref(today())

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
function onChange(data: { start: string; end: string; days: Timestamp[] }) {
  console.info('onChange', data)
}
function onClickDate(data: Timestamp) {
  console.info('onClickDate', data)
}
function onClickTime(data: Timestamp) {
  console.info('onClickTime', data)
}
function onClickInterval(data: Timestamp) {
  console.info('onClickInterval', data)
}
function onClickHeadIntervals(data: Timestamp) {
  console.info('onClickHeadIntervals', data)
}
function onClickHeadDay(data: Timestamp) {
  console.info('onClickHeadDay', data)
}
</script>
