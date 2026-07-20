<template>
  <div class="subcontent">
    <p class="text-body2 text-center q-mb-md">
      This timeline renders the current quarter and scrolls to any date already in that range.
    </p>

    <div class="row items-center justify-center q-gutter-sm q-mb-md">
      <q-btn color="primary" label="Scroll to first" @click="scrollToFirst" />
      <q-btn color="primary" label="Scroll to today" @click="scrollToToday" />
      <q-btn color="primary" label="Scroll to last" @click="scrollToLast" />
    </div>

    <div class="row justify-center">
      <div class="calendar-container">
        <q-calendar-task
          ref="calendar"
          v-model="selectedDate"
          v-model:model-tasks="tasks"
          view="month"
          :view-count="3"
          :task-width="180"
          :cell-width="72"
          bordered
        >
          <template #head-tasks>
            <div class="task-label text-weight-bold">Work stream</div>
          </template>

          <template #task="{ scope }">
            <div class="task-label">{{ scope.task.title }}</div>
          </template>
        </q-calendar-task>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { QCalendarTask } from '@quasar/quasar-ui-qcalendar'
import { today } from '@timestamp-js/core'
import '@quasar/quasar-ui-qcalendar/index.css'

const now = new Date()
const year = now.getFullYear()
const quarterStartMonth = Math.floor(now.getMonth() / 3) * 3
const quarterStart = new Date(Date.UTC(year, quarterStartMonth, 1))
const nextQuarterStart = new Date(Date.UTC(year, quarterStartMonth + 3, 1))
function formatDate(date: Date): string {
  return date.toISOString().slice(0, 10)
}

const quarterDates: string[] = []
for (
  let date = quarterStart;
  date < nextQuarterStart;
  date = new Date(date.getTime() + 86_400_000)
) {
  quarterDates.push(formatDate(date))
}
const calendar = ref<QCalendarTask>()
const selectedDate = ref(formatDate(quarterStart))
const tasks = ref([
  { id: 'planning', title: 'Planning' },
  { id: 'delivery', title: 'Delivery' },
  { id: 'review', title: 'Review' },
])
function scrollToDate(date: string) {
  calendar.value?.scrollToDate(date, 350)
}

function scrollToFirst() {
  scrollToDate(quarterDates[0]!)
}

function scrollToToday() {
  scrollToDate(today())
}

function scrollToLast() {
  scrollToDate(quarterDates.at(-1)!)
}
</script>

<style scoped>
.calendar-container {
  display: flex;
  width: 100%;
  max-width: 1000px;
  min-width: 0;
}

.task-label {
  display: flex;
  align-items: center;
  height: 100%;
  padding-inline: 8px;
}
</style>
