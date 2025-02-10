<template>
  <div class="subcontent">
    <div style="display: flex; flex-direction: row; justify-content: center; width: 100%">
      <div style="max-width: 800px; width: 100%; display: flex; flex-direction: column">
        <div class="title-bar" style="display: flex">
          <button
            tabindex="0"
            class="date-button direction-button direction-button__left"
            @click="onPrev"
          >
            <span class="q-calendar__focus-helper" tabindex="-1" />
          </button>
          <div class="dates-holder">
            <transition :name="transition" appear>
              <div v-if="parsedStart" :key="parsedStart.date" class="internal-dates-holder">
                <div v-for="day in days" :key="day.date" :style="dayStyle">
                  <button
                    tabindex="0"
                    style="width: 100%"
                    :class="dayClass(day)"
                    @click="
                      // prettier-ignore
                      selectedDate = day.date;
                      // prettier-ignore
                      transition = '';
                    "
                  >
                    <span class="q-calendar__focus-helper" tabindex="-1" />
                    <div style="width: 100%">
                      {{ monthFormatter(day, true) }}
                    </div>
                    <div style="width: 100%; font-size: 16px; font-weight: 700">
                      {{ dayFormatter(day, false) }}
                    </div>
                    <div style="width: 100%; font-size: 10px">
                      {{ weekdayFormatter(day, true) }}
                    </div>
                  </button>
                </div>
              </div>
            </transition>
          </div>
          <button
            tabindex="0"
            class="date-button direction-button direction-button__right"
            @click="onNext"
          >
            <span class="q-calendar__focus-helper" tabindex="-1" />
          </button>
        </div>
        <q-calendar-day
          ref="calendar"
          v-model="selectedDate"
          bordered
          animated
          style="height: 400px"
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
</template>

<script setup lang="ts">
import {
  QCalendarDay,
  addToDate,
  createDayList,
  createNativeLocaleFormatter,
  getEndOfWeek,
  getStartOfWeek,
  parseTimestamp,
  today,
  Timestamp,
} from '@quasar/quasar-ui-qcalendar'
import '@quasar/quasar-ui-qcalendar/index.css'
import { ref, reactive, computed } from 'vue'

const calendar = ref<QCalendarDay>()

const selectedDate = ref(today())
const weekdays = reactive([0, 1, 2, 3, 4, 5, 6])
const locale = ref('en-US')
const monthFormatter = monthFormatterFunc()
const dayFormatter = dayFormatterFunc()
const weekdayFormatter = weekdayFormatterFunc()
const transitionPrev = ref('slide-left')
const transitionNext = ref('slide-right')
const transition = ref('')

const parsedStart = computed(() => {
  if (selectedDate.value) {
    const parsedDate = parseTimestamp(selectedDate.value)
    if (parsedDate) {
      return today2.value ? getStartOfWeek(parsedDate, weekdays, today2.value) : undefined
    }
  }
  return undefined
})

const parsedEnd = computed(() => {
  if (selectedDate.value) {
    const parsedDate = parseTimestamp(selectedDate.value)
    if (parsedDate) {
      return today2.value ? getEndOfWeek(parsedDate, weekdays, today2.value) : undefined
    }
  }
  return undefined
})

const today2 = computed(() => {
  return parseTimestamp(today())
})

const days = computed(() => {
  if (parsedStart.value && parsedEnd.value) {
    if (today2.value) {
      return createDayList(parsedStart.value, parsedEnd.value, today2.value, weekdays)
    }
  }
  return []
})

const dayStyle = computed(() => {
  const width = 100 / weekdays.length + '%'
  return {
    width,
  }
})

function onPrev() {
  if (parsedStart.value) {
    const ts = addToDate(parsedStart.value, { day: -7 })
    selectedDate.value = ts.date
    transition.value = 'q-calendar--' + transitionPrev.value
  }
}

function onNext() {
  if (parsedStart.value) {
    const ts = addToDate(parsedStart.value, { day: 7 })
    selectedDate.value = ts.date
    transition.value = 'q-calendar--' + transitionNext.value
  }
}

function dayClass(day: Timestamp) {
  return {
    'date-button': true,
    'selected-date-button': selectedDate.value === day.date,
  }
}

function monthFormatterFunc() {
  const longOptions: Intl.DateTimeFormatOptions = { timeZone: 'UTC', month: 'long' } as const
  const shortOptions: Intl.DateTimeFormatOptions = { timeZone: 'UTC', month: 'short' } as const

  return createNativeLocaleFormatter(locale.value, (_tms, short) =>
    short ? shortOptions : longOptions,
  )
}

function weekdayFormatterFunc() {
  const longOptions: Intl.DateTimeFormatOptions = { timeZone: 'UTC', weekday: 'long' } as const
  const shortOptions: Intl.DateTimeFormatOptions = { timeZone: 'UTC', weekday: 'short' } as const

  return createNativeLocaleFormatter(locale.value, (_tms, short) =>
    short ? shortOptions : longOptions,
  )
}

function dayFormatterFunc() {
  const longOptions: Intl.DateTimeFormatOptions = { timeZone: 'UTC', day: '2-digit' } as const
  const shortOptions: Intl.DateTimeFormatOptions = { timeZone: 'UTC', day: 'numeric' } as const

  return createNativeLocaleFormatter(locale.value, (_tms, short) =>
    short ? shortOptions : longOptions,
  )
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

<style lang="scss" scoped>
.title-bar {
  position: relative;
  width: 100%;
  height: 70px;
  background: #3f51b5;
  // display: flex;
  // flex-direction: row;
  // flex: 1 0 100%;
  // justify-content: space-between;
  // align-items: center;
  overflow: hidden;
  border-radius: 3px;
  user-select: none;
}

.dates-holder {
  position: relative;
  width: 100%;
  align-items: center;
  display: flex;
  justify-content: space-between;
  color: #fff;
  overflow: hidden;
  user-select: none;
}

.internal-dates-holder {
  position: relative;
  width: 100%;
  display: inline-flex;
  flex: 1 1 100%;
  flex-direction: row;
  justify-content: space-between;
  overflow: hidden;
  user-select: none;
}

.direction-button {
  background: #3f51b5;
  color: white;
  width: 40px;
  max-width: 50px !important;
}

.direction-button__left:before {
  content: '<';
  display: inline-flex;
  flex-direction: column;
  justify-content: center;
  height: 100%;
  font-weight: 900;
  font-size: 3em;
}

.direction-button__right:before {
  content: '>';
  display: inline-flex;
  flex-direction: column;
  justify-content: center;
  height: 100%;
  font-weight: 900;
  font-size: 3em;
}

.date-button {
  color: white;
  background: #3f51b5;
  z-index: 2;
  height: 100%;
  outline: 0;
  cursor: pointer;
  border-radius: 3px;
  display: inline-flex;
  flex: 1 0 auto;
  flex-direction: column;
  align-items: stretch;
  position: relative;
  border: 0;
  vertical-align: middle;
  padding: 0;
  font-size: 14px;
  line-height: 1.715em;
  text-decoration: none;
  font-weight: 500;
  text-transform: uppercase;
  text-align: center;
  user-select: none;
}

.selected-date-button {
  color: #3f51b5 !important;
  background: white !important;
}
</style>
