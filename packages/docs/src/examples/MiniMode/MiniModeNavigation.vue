<template>
  <div class="subcontent">
    <p class="text-body2 text-center q-mb-md">
      Use the buttons or keyboard navigation to move the active date and watch the visible range
      update.
    </p>

    <navigation-bar @today="onToday" @prev="onPrev" @next="onNext" />

    <div style="display: flex; justify-content: center">
      <div
        style="
          max-width: 280px;
          width: 100%;
          display: flex;
          flex-direction: column;
          justify-content: center;
          border: 1px solid #ccc;
          border-radius: 4px;
          padding: 10px;
        "
      >
        <div style="width: 100%; display: flex; justify-content: space-evenly">
          <div style="width: 50%; display: flex; justify-content: space-between">
            <span class="q-button" style="cursor: pointer; user-select: none" @click="onPrev"
              >&lt;</span
            >
            {{ formattedMonth }}
            <span class="q-button" style="cursor: pointer; user-select: none" @click="onNext"
              >&gt;</span
            >
          </div>
          <div style="width: 30%; display: flex; justify-content: space-between">
            <span class="q-button" style="cursor: pointer; user-select: none" @click="addToYear(-1)"
              >&lt;</span
            >
            {{ selectedYear }}
            <span class="q-button" style="cursor: pointer; user-select: none" @click="addToYear(1)"
              >&gt;</span
            >
          </div>
        </div>

        <div style="display: flex; justify-content: center; align-items: center; flex-wrap: nowrap">
          <div style="display: flex; max-width: 280px; width: 100%">
            <q-calendar-month
              ref="calendar"
              v-model="selectedDate"
              mini-mode
              use-navigation
              no-active-date
              hoverable
              focusable
              :focus-type="['date', 'weekday']"
              :min-weeks="6"
              animated
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
    </div>
  </div>
</template>

<script setup lang="ts">
import { QCalendarMonth } from '@quasar/quasar-ui-qcalendar'
import { addToDate, parseTimestamp, today, Timestamp } from '@timestamp-js/core'
import '@quasar/quasar-ui-qcalendar/index.css'

import { ref, computed } from 'vue'
import NavigationBar from '@/components/NavigationBar.vue'

const calendar = ref<QCalendarMonth>(),
  selectedDate = ref(today()),
  locale = ref('en-US')

const formattedMonth = computed(() => {
  const date = new Date(selectedDate.value)
  const formatter = monthFormatter()
  return formatter ? formatter.format(date) : ''
})

const selectedYear = computed(() => {
  const ts = parseTimestamp(selectedDate.value)
  return ts ? ts.year : new Date().getFullYear()
})

function monthFormatter() {
  try {
    return new Intl.DateTimeFormat(locale.value || undefined, {
      month: 'long',
      timeZone: 'UTC',
    })
  } catch {
    //
  }
}

function addToYear(amount: number) {
  // parse current date to timestamp
  let ts = parseTimestamp(selectedDate.value)
  if (ts) {
    // add specified amount of days
    ts = addToDate(ts, { year: amount })
    // re-assign values
    selectedDate.value = ts.date
  }
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
