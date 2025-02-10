<template>
  <div class="subcontent">
    <navigation-bar @today="onToday" @prev="onPrev" @next="onNext" />

    <div class="row justify-center">
      <div
        class="q-gutter-md"
        style="display: flex; flex-direction: column; max-width: 800px; width: 90%; height: 500px"
      >
        <q-calendar-day
          ref="calendar"
          v-model="selectedDate"
          :disabled-days="disabledDays"
          no-active-date
          animated
          bordered
          transition-next="slide-left"
          transition-prev="slide-right"
          @change="onChange"
          @moved="onMoved"
          @click-date="onClickDate"
          @click-time="onClickTime"
          @click-interval="onClickInterval"
          @click-head-intervals="onClickHeadIntervals"
          @click-head-day="onClickHeadDay"
        />
        <q-calendar-day
          ref="calendar2"
          v-model="selectedDate"
          :disabled-days="disabledDaysRange"
          no-active-date
          animated
          bordered
          transition-next="slide-left"
          transition-prev="slide-right"
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
import {
  QCalendarDay,
  addToDate,
  parseTimestamp,
  today,
  Timestamp,
} from '@quasar/quasar-ui-qcalendar'
import '@quasar/quasar-ui-qcalendar/index.css'
import { ref, computed } from 'vue'
import NavigationBar from 'components/NavigationBar.vue'

const calendar = ref<QCalendarDay>()

const selectedDate = ref(today())

const disabledDays = computed(() => {
  const ts = parseTimestamp(today())
  // make next 4 days, after today, disabled
  return Array.from({ length: 4 }, (_, i) => addToDate(ts!, { day: i + 1 }).date)
})

const disabledDaysRange = computed(() => {
  // create the range for example 2
  // Note: this is an array, within an array
  return [[disabledDays.value[0], disabledDays.value[disabledDays.value.length - 1]]]
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
