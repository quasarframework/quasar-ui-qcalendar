<template>
  <div class="subcontent">
    <p class="text-body2 text-center q-mb-md">
      A rendered date can be brought into view without changing the calendar range or model value.
    </p>

    <div class="row items-center justify-center q-gutter-sm q-mb-md">
      <q-btn color="primary" label="Scroll to first" @click="scrollToFirst" />
      <q-btn color="primary" label="Scroll to today" @click="scrollToToday" />
      <q-btn color="primary" label="Scroll to last" @click="scrollToLast" />
    </div>

    <div class="row justify-center">
      <div class="calendar-container">
        <q-calendar-day
          ref="calendar"
          v-model="selectedDate"
          view="month"
          cell-width="140px"
          bordered
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { QCalendarDay } from '@quasar/quasar-ui-qcalendar'
import { today } from '@timestamp-js/core'
import '@quasar/quasar-ui-qcalendar/index.css'

const calendar = ref<QCalendarDay>()
const selectedDate = ref(today())
const [year, month] = selectedDate.value.split('-').map(Number)
const daysInMonth = new Date(Date.UTC(year!, month!, 0)).getUTCDate()
const renderedDates = Array.from(
  { length: daysInMonth },
  (_, index) => `${year}-${String(month).padStart(2, '0')}-${String(index + 1).padStart(2, '0')}`,
)
function scrollToDate(date: string) {
  calendar.value?.scrollToDate(date, 350)
}

function scrollToFirst() {
  scrollToDate(renderedDates[0]!)
}

function scrollToToday() {
  scrollToDate(today())
}

function scrollToLast() {
  scrollToDate(renderedDates.at(-1)!)
}
</script>

<style scoped>
.calendar-container {
  display: flex;
  width: 100%;
  max-width: 800px;
  height: 400px;
}
</style>
