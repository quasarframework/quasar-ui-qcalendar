<template>
  <div class="subcontent">
    <navigation-bar @today="onToday" @prev="onPrev" @next="onNext" />

    <div class="row justify-center">
      <div style="display: flex; max-width: 800px; width: 100%">
        <q-calendar-month
          ref="calendar"
          v-model="selectedDate"
          :selected-dates="selectedDates"
          :day-min-height="40"
          animated
          bordered
          @click-day="onToggleDay"
          @click-date="onToggleDate"
          @change="onChange"
          @moved="onMoved"
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

import { ref } from 'vue'
import NavigationBar from 'components/NavigationBar.vue'

const calendar = ref<QCalendarMonth>(),
  selectedDate = ref(today()),
  selectedDates = ref<string[]>([])

interface Scope {
  scope: {
    timestamp: Timestamp
    outside: boolean
  }
}

function onToggleDate({ scope }: Scope) {
  console.info('date clicked (scope)', scope)
  if (scope !== undefined) {
    toggleDate(scope)
  }
}

function onToggleDay({ scope }: Scope) {
  console.info('day clicked (scope)', scope)
  if (scope !== undefined) {
    toggleDate(scope)
  }
}

function toggleDate(scope: { timestamp: Timestamp; outside: boolean }) {
  const date = scope.timestamp.date
  if (selectedDates.value.includes(date)) {
    // remove the date
    for (let i = 0; i < selectedDates.value.length; ++i) {
      if (date === selectedDates.value[i]) {
        selectedDates.value.splice(i, 1)
        break
      }
    }
  } else {
    // add the date if not outside
    if (scope.outside !== true) {
      selectedDates.value.push(date)
    }
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
// onClickDate (data) {
//   console.info('onClickDate', data)
// },
// onClickDay (data) {
//   console.info('onClickDay', data)
// },
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
