<template>
  <div class="subcontent">
    <p class="text-body2 text-center q-mb-md">
      Specific dates or ranges are disabled so unavailable days stand out from normal calendar days.
    </p>

    <navigation-bar @today="onToday" @prev="onPrev" @next="onNext" />

    <div class="day-disabled-days">
      <div class="day-disabled-days__demo">
        <div class="day-disabled-days__label">Array of disabled dates</div>
        <div class="day-disabled-days__calendar">
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
        </div>
      </div>

      <div class="day-disabled-days__demo">
        <div class="day-disabled-days__label">Styled disabled range</div>
        <div class="day-disabled-days__calendar">
          <q-calendar-day
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
  </div>
</template>

<script setup lang="ts">
import { QCalendarDay } from '@quasar/quasar-ui-qcalendar'
import { addToDate, parseTimestamp, Timestamp } from '@timestamp-js/core'
import '@quasar/quasar-ui-qcalendar/index.css'
import { ref, computed } from 'vue'
import NavigationBar from '@/components/NavigationBar.vue'

const calendar = ref<QCalendarDay>()

const selectedDate = ref('2026-05-26')

const disabledDays = computed(() => {
  const ts = parseTimestamp(selectedDate.value)
  // make 4 visible days disabled, starting with the selected date
  return Array.from({ length: 4 }, (_, i) => addToDate(ts!, { day: i }).date)
})

const disabledDaysRange = computed(() => {
  // create a reservation-style range for example 2
  return [
    {
      from: disabledDays.value[0],
      to: disabledDays.value[disabledDays.value.length - 1],
      color: '#ef5350',
      textColor: '#ffffff',
      label: 'Reserved',
    },
  ]
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

<style scoped lang="scss">
.day-disabled-days {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(360px, 1fr));
  gap: 16px;
  width: 100%;
  max-width: 1100px;
  margin: 0 auto;
}

.day-disabled-days__demo {
  min-width: 0;
}

.day-disabled-days__label {
  margin-bottom: 8px;
  font-weight: 700;
  text-align: center;
}

.day-disabled-days__calendar {
  display: flex;
  height: 420px;
}
</style>
