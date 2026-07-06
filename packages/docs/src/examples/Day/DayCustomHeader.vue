<template>
  <div class="subcontent custom-header-example">
    <p class="text-body2 text-center q-mb-md">
      This recipe replaces the default header with custom date buttons while keeping the calendar
      body synchronized.
    </p>

    <div style="display: flex; flex-direction: row; justify-content: center; width: 100%">
      <div style="max-width: 800px; width: 100%; display: flex; flex-direction: column">
        <div class="custom-header-example__title-bar">
          <button
            tabindex="0"
            class="custom-header-example__date-button custom-header-example__direction-button custom-header-example__direction-button--left"
            @click="onPrev"
          >
            <span class="q-calendar__focus-helper" tabindex="-1"></span>
          </button>
          <div class="custom-header-example__dates-holder">
            <transition :name="transition">
              <div
                v-if="parsedStart"
                :key="parsedStart.date"
                class="custom-header-example__internal-dates-holder"
              >
                <div v-for="day in days" :key="day.date" :style="dayStyle">
                  <button
                    tabindex="0"
                    style="width: 100%"
                    :class="dayClass(day)"
                    @click="onSelectDate(day.date)"
                  >
                    <span class="q-calendar__focus-helper" tabindex="-1"></span>
                    <div style="width: 100%">
                      {{ formatMonth(day) }}
                    </div>
                    <div style="width: 100%; font-size: 16px; font-weight: 700">
                      {{ formatDay(day) }}
                    </div>
                    <div style="width: 100%; font-size: 10px">
                      {{ formatWeekday(day) }}
                    </div>
                  </button>
                </div>
              </div>
            </transition>
          </div>
          <button
            tabindex="0"
            class="custom-header-example__date-button custom-header-example__direction-button custom-header-example__direction-button--right"
            @click="onNext"
          >
            <span class="q-calendar__focus-helper" tabindex="-1"></span>
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
import { QCalendarDay } from '@quasar/quasar-ui-qcalendar'
import {
  addToDate,
  createDayList,
  getEndOfWeek,
  getStartOfWeek,
  parseTimestamp,
  today,
} from '@timestamp-js/core'
import '@quasar/quasar-ui-qcalendar/index.css'
import { ref, reactive, computed } from 'vue'

type CalendarTimestamp = NonNullable<ReturnType<typeof parseTimestamp>>

const calendar = ref<QCalendarDay>()

const selectedDate = ref(today())
const weekdays = reactive([0, 1, 2, 3, 4, 5, 6])
const locale = ref('en-US')
const monthFormatter = new Intl.DateTimeFormat(locale.value, {
  timeZone: 'UTC',
  month: 'short',
})
const dayFormatter = new Intl.DateTimeFormat(locale.value, {
  timeZone: 'UTC',
  day: 'numeric',
})
const weekdayFormatter = new Intl.DateTimeFormat(locale.value, {
  timeZone: 'UTC',
  weekday: 'short',
})
const transitionPrev = ref('slide-right')
const transitionNext = ref('slide-left')
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
    transition.value = 'q-calendar--' + transitionPrev.value
    selectedDate.value = ts.date
  }
}

function onNext() {
  if (parsedStart.value) {
    const ts = addToDate(parsedStart.value, { day: 7 })
    transition.value = 'q-calendar--' + transitionNext.value
    selectedDate.value = ts.date
  }
}

function toUtcDate(day: CalendarTimestamp) {
  return new Date(Date.UTC(day.year, day.month - 1, day.day))
}

function formatMonth(day: CalendarTimestamp) {
  return monthFormatter.format(toUtcDate(day))
}

function formatDay(day: CalendarTimestamp) {
  return dayFormatter.format(toUtcDate(day))
}

function formatWeekday(day: CalendarTimestamp) {
  return weekdayFormatter.format(toUtcDate(day))
}

function dayClass(day: CalendarTimestamp) {
  return {
    'custom-header-example__date-button': true,
    'custom-header-example__date-button--selected': selectedDate.value === day.date,
  }
}

function onSelectDate(date: string) {
  selectedDate.value = date
  transition.value = ''
}

function onMoved(data: CalendarTimestamp) {
  console.info('onMoved', data)
}
function onChange(data: {
  start: CalendarTimestamp
  end: CalendarTimestamp
  days: CalendarTimestamp[]
}) {
  console.info('onChange', data)
}
function onClickDate(data: CalendarTimestamp) {
  console.info('onClickDate', data)
}
function onClickTime(data: CalendarTimestamp) {
  console.info('onClickTime', data)
}
function onClickInterval(data: CalendarTimestamp) {
  console.info('onClickInterval', data)
}
function onClickHeadIntervals(data: CalendarTimestamp) {
  console.info('onClickHeadIntervals', data)
}
function onClickHeadDay(data: CalendarTimestamp) {
  console.info('onClickHeadDay', data)
}
</script>

<style lang="scss" scoped>
.custom-header-example__title-bar {
  position: relative;
  width: 100%;
  height: 70px;
  background: #3f51b5;
  display: flex;
  flex-direction: row;
  align-items: stretch;
  overflow: hidden;
  overflow: clip;
  border-radius: 3px;
  user-select: none;
}

.custom-header-example__dates-holder {
  position: relative;
  flex: 1 1 auto;
  min-width: 0;
  align-items: center;
  display: flex;
  justify-content: space-between;
  color: #fff;
  overflow: hidden;
  overflow: clip;
  user-select: none;
}

.custom-header-example__internal-dates-holder {
  position: relative;
  width: 100%;
  height: 100%;
  display: inline-flex;
  flex: 1 1 100%;
  flex-direction: row;
  justify-content: space-between;
  overflow: hidden;
  overflow: clip;
  user-select: none;
}

.custom-header-example__internal-dates-holder[class*='q-calendar--'][class*='-active'] {
  position: absolute;
  top: 0;
  left: 0; /* rtl:ignore */
  right: 0; /* rtl:ignore */
  width: 100%;
}

.custom-header-example__date-button.custom-header-example__direction-button {
  background: #3f51b5;
  color: white;
  flex: 0 0 50px;
  width: 50px;
  max-width: 50px !important;
}

.custom-header-example__direction-button--left:before {
  content: '<';
  display: inline-flex;
  flex-direction: column;
  justify-content: center;
  height: 100%;
  font-weight: 900;
  font-size: 3em;
}

.custom-header-example__direction-button--right:before {
  content: '>';
  display: inline-flex;
  flex-direction: column;
  justify-content: center;
  height: 100%;
  font-weight: 900;
  font-size: 3em;
}

.custom-header-example__date-button {
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

.custom-header-example__date-button--selected {
  color: #3f51b5 !important;
  background: white !important;
}
</style>
