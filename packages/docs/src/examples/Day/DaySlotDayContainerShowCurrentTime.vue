<template>
  <div class="subcontent">
    <navigation-bar @today="onToday" @prev="onPrev" @next="onNext" />

    <div class="row justify-center">
      <div style="display: flex; max-width: 800px; width: 100%; height: 400px">
        <q-calendar-day
          ref="calendar"
          v-model="selectedDate"
          view="day"
          bordered
          :hour24-format="toggled"
          :interval-minutes="15"
          :interval-count="96"
          :interval-height="10"
          animated
          transition-next="slide-left"
          transition-prev="slide-right"
          @change="onChange"
          @moved="onMoved"
          @click-date="onClickDate"
          @click-time="onClickTime"
          @click-interval="onClickInterval"
          @click-head-intervals="onClickHeadIntervals"
          @click-head-day="onClickHeadDay"
        >
          <template #day-container="{ scope: { days } }">
            <template v-if="hasDate(days)">
              <div class="day-view-current-time-indicator" :style="style" />
              <div class="day-view-current-time-line" :style="style" />
            </template>
          </template>
        </q-calendar-day>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { QCalendarDay, today, parseDate, Timestamp } from '@quasar/quasar-ui-qcalendar'
import '@quasar/quasar-ui-qcalendar/index.css'
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import NavigationBar from 'components/NavigationBar.vue'

const calendar = ref<QCalendarDay>()

const selectedDate = ref(today()),
  toggled = ref(false),
  currentDate = ref<string>(),
  currentTime = ref<string>(),
  timeStartPos = ref(0)
let intervalId: NodeJS.Timeout | undefined

onMounted(() => {
  adjustCurrentTime()
  // now, adjust the time every minute
  intervalId = setInterval(() => {
    adjustCurrentTime()
  }, 60000)
})

onBeforeUnmount(() => {
  if (intervalId !== null) {
    clearInterval(intervalId)
  }
})

const style = computed(() => {
  return {
    top: timeStartPos.value + 'px',
  }
})

function hasDate(days: Timestamp[]) {
  return currentDate.value ? days.find((day) => day.date === currentDate.value) : false
}
function onNext() {
  if (calendar.value) {
    calendar.value.next()
  }
}
function onPrev() {
  if (calendar.value) {
    calendar.value.prev()
  }
}
function onToday() {
  if (calendar.value) {
    calendar.value.moveToToday()
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

function adjustCurrentTime() {
  const now = parseDate(new Date())
  if (now) {
    currentDate.value = now.date
    currentTime.value = now.time
    if (calendar.value) {
      timeStartPos.value = calendar.value.timeStartPos(currentTime.value, false)
    }
  }
}
</script>

<style lang="scss">
.day-view-current-time-indicator {
  position: absolute;
  left: -5px;
  height: 10px;
  width: 10px;
  margin-top: -4px;
  background-color: rgba(0, 0, 255, 0.5);
  border-radius: 50%;
}

.day-view-current-time-line {
  position: absolute;
  left: 5px;
  border-top: rgba(0, 0, 255, 0.5) 2px solid;
  width: calc(100% - 5px);
}

.q-dark,
.body--dark,
.q-calendar--dark {
  .day-view-current-time-indicator {
    background-color: rgba(255, 255, 0, 0.85);
  }

  .day-view-current-time-line {
    border-top: rgba(255, 255, 0, 0.85) 2px solid;
  }
}
</style>
