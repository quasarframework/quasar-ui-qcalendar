<template>
  <div class="subcontent">
    <p class="text-body2 text-center q-mb-md">
      Scroll a rendered scheduler date into view without changing the calendar range or model value.
    </p>

    <div class="row items-center justify-center q-gutter-sm q-mb-md">
      <q-btn color="primary" label="Scroll to first" @click="scrollToFirst" />
      <q-btn color="primary" label="Scroll to today" @click="scrollToToday" />
      <q-btn color="primary" label="Scroll to last" @click="scrollToLast" />
    </div>

    <div class="row justify-center">
      <div class="calendar-container">
        <q-calendar-scheduler
          ref="calendar"
          v-model="selectedDate"
          v-model:model-resources="resources"
          view="month"
          cell-width="140px"
          resource-key="id"
          resource-label="name"
          resource-height="50"
          bordered
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { QCalendarScheduler } from '@quasar/quasar-ui-qcalendar'
import { today } from '@timestamp-js/core'
import '@quasar/quasar-ui-qcalendar/index.css'

interface Resource {
  id: string
  name: string
}

const calendar = ref<QCalendarScheduler>()
const selectedDate = ref(today())
const resources = ref<Resource[]>([
  { id: 'planning', name: 'Planning' },
  { id: 'delivery', name: 'Delivery' },
  { id: 'review', name: 'Review' },
])
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
  height: 280px;
}
</style>
