<template>
  <div class="subcontent">
    <navigation-bar @today="onToday" @prev="onPrev" @next="onNext" />

    <div class="row no-wrap" style="width: 600px">
      <span class="col-shrink no-wrap" style="min-width: 142px">Day Height:</span>
      <q-slider
        v-model="dayHeight"
        :min="0"
        :max="200"
        label
        label-always
        :label-value="dayHeight + 'px'"
        class="col"
      />
    </div>

    <div class="row no-wrap" style="width: 600px">
      <span class="col-shrink no-wrap" style="min-width: 142px">Day Min. Height:</span>
      <q-slider
        v-model="dayMinHeight"
        :min="0"
        :max="200"
        label
        label-always
        :label-value="dayMinHeight + 'px'"
        class="col"
      />
    </div>

    <div class="row justify-center">
      <div :style="calendarStyle">
        <q-calendar-month
          ref="calendar"
          v-model="selectedDate"
          :day-height="dayHeight"
          :day-min-height="dayMinHeight"
          animated
          bordered
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

import { ref, computed, type CSSProperties } from 'vue'
import NavigationBar from 'components/NavigationBar.vue'

const calendar = ref<QCalendarMonth>(),
  selectedDate = ref(today()),
  dayHeight = ref(50),
  dayMinHeight = ref(50)

const calendarStyle = computed<CSSProperties>(() => {
  return {
    display: 'flex',
    maxWidth: '800px',
    width: '100%',
    height: dayHeight.value === 0 && dayMinHeight.value === 0 ? '600px' : '',
  }
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
