<template>
  <div class="subcontent">
    <navigation-bar @today="onToday" @prev="onPrev" @next="onNext" />

    <div class="column items-center">
      <div class="day-column-count-plus__date">{{ selectedDate }}</div>
      <div class="day-column-count-plus__calendar">
        <q-calendar-day
          ref="calendar"
          v-model="selectedDate"
          view="day"
          :column-count="4"
          bordered
          animated
          @change="onChange"
          @moved="onMoved"
          @click-date="onClickDate"
          @click-time="onClickTime"
          @click-interval="onClickInterval"
          @click-head-intervals="onClickHeadIntervals"
          @click-head-day="onClickHeadDay"
        >
          <template #head-day="{ scope }">
            <div style="text-align: center; font-weight: 800">
              {{ persons[scope.columnIndex]?.name }}
            </div>
          </template>
        </q-calendar-day>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { QCalendarDay } from '@quasar/quasar-ui-qcalendar'
import { today, Timestamp } from '@timestamp-js/core'
import '@quasar/quasar-ui-qcalendar/index.css'

const calendar = ref<QCalendarDay>()

import { ref } from 'vue'
import NavigationBar from '@/components/NavigationBar.vue'

const selectedDate = ref(today())
const persons = ref([
  { name: 'James Smith' },
  { name: 'John Williams' },
  { name: 'David Miller' },
  { name: 'Linda Brown' },
])

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

<style scoped lang="scss">
.day-column-count-plus__date {
  margin-bottom: 8px;
  font-size: 18px;
  font-weight: 800;
  text-align: center;
}

.day-column-count-plus__calendar {
  display: flex;
  max-width: 800px;
  width: 100%;
  height: 400px;
}
</style>
