<template>
  <div class="subcontent">
    <navigation-bar @today="onToday" @prev="onPrev" @next="onNext" />

    <div class="row justify-center">
      <div style="display: flex; max-width: 800px; width: 100%; height: 400px">
        <q-calendar-day
          ref="calendar"
          v-model="selectedDate"
          :interval-minutes="15"
          :interval-count="96"
          :interval-height="15"
          time-clicks-clamped
          :selected-dates="selectedDates"
          animated
          bordered
          @click-time="onToggleTime"
          @change="onChange"
          @moved="onMoved"
          @click-date="onClickDate"
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
  today,
  copyTimestamp,
  getDateTime,
  Timestamp,
} from '@quasar/quasar-ui-qcalendar'
import '@quasar/quasar-ui-qcalendar/index.css'
import { ref } from 'vue'
import NavigationBar from 'components/NavigationBar.vue'

const calendar = ref<QCalendarDay>()

const selectedDate = ref(today())
const selectedDates = ref<string[]>([])

function onToggleTime({ scope }: { scope: { timestamp: Timestamp; outside: boolean } }) {
  console.info('click-time (scope)', scope)
  if (scope === undefined) {
    return
  }

  // make a copy of the timestamp
  const ts = copyTimestamp(scope.timestamp)

  // get date with time
  const t = getDateTime(ts)

  // toggle to/from array
  if (selectedDates.value.includes(t)) {
    // remove the date
    for (let i = 0; i < selectedDates.value.length; ++i) {
      if (t === selectedDates.value[i]) {
        selectedDates.value.splice(i, 1)
        break
      }
    }
  } else {
    // add the date if not outside
    if (scope.outside !== true) {
      selectedDates.value.push(t)
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
function onClickDate(data: Timestamp) {
  console.info('onClickDate', data)
}
// onClickTime (data) {
//   console.info('onClickTime', data)
// },
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
