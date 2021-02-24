<template>
  <div style="margin: 12px;">
    <div class="line">This example shows how you can build your own custom navigation bar.</div>
  </div>
  <div style="display: inline-flex; flex-direction: column;">
    <div
      class="title-bar"
      style="max-width: 800px; width: 100%; display: inline-flex;"
    >
      <button
        tabindex="0"
        class="date-button direction-button direction-button__left"
        @click="onPrev"
      >
        <span
          class="q-calendar__focus-helper"
          tabindex="-1"
        />
      </button>
      <div class="dates-holder">
        <transition
          :name="transition"
          appear
        >
          <div
            :key="parsedStart.date"
            class="internal-dates-holder"
          >
            <div
              v-for="day in days"
              :key="day.date"
              :style="dayStyle"
            >
              <button
                tabindex="0"
                style="width: 100%;"
                :class="dayClass(day)"
                @click="selectedDate = day.date; transition = ''"
              >
                <span
                  class="q-calendar__focus-helper"
                  tabindex="-1"
                />
                <div
                  style="width: 100%;"
                >
                  {{ monthFormatter(day, true) }}
                </div>
                <div
                  style="width: 100%; font-size: 16px; font-weight: 700;"
                >
                  {{ dayFormatter(day, false) }}
                </div>
                <div
                  style="width: 100%; font-size: 10px;"
                >
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
        <span
          class="q-calendar__focus-helper"
          tabindex="-1"
        />
      </button>
    </div>
    <QCalendarDay
      ref="calendar"
      v-model="selectedDate"
      bordered
      animated
      style="max-width: 800px; width: 100%; height: 400px; display: inline-flex;"
      @change="onChange"
      @moved="onMoved"
      @click-date="onClickDate"
      @click-time="onClickTime"
      @click-interval="onClickInterval"
      @click-head-intervals="onClickHeadIntervals"
      @click-head-day="onClickHeadDay"
    />
  </div>
</template>

<script>
import { QCalendarDay } from '@quasar/quasar-ui-qcalendar/QCalendarDay.js'
import {
  addToDate,
  createDayList,
  createNativeLocaleFormatter,
  getEndOfWeek,
  getStartOfWeek,
  getWeekdaySkips,
  parseTimestamp,
  today
} from '@quasar/quasar-ui-qcalendar/Timestamp.js'
import '@quasar/quasar-ui-qcalendar/QCalendarVariables.sass'
import '@quasar/quasar-ui-qcalendar/QCalendarTransitions.sass'
import '@quasar/quasar-ui-qcalendar/QCalendarDay.sass'

import { defineComponent, ref, reactive, computed } from 'vue'

export default defineComponent({
  name: 'DayCustomHeader',
  components: {
    QCalendarDay
  },
  setup () {
    const selectedDate = ref(today()),
      calendar = ref(null),
      weekdays = reactive([ 0, 1, 2, 3, 4, 5, 6 ]),
      locale = ref('en-us'),
      monthFormatter = monthFormatterFunc(),
      dayFormatter = dayFormatterFunc(),
      weekdayFormatter = weekdayFormatterFunc(),
      transitionPrev = ref('slide-left'),
      transitionNext = ref('slide-right'),
      transition = ref('')

    const weekdaySkips = computed(() => {
      return getWeekdaySkips(weekdays)
    })

    const parsedStart = computed(() => {
      if (selectedDate.value) {
        return getStartOfWeek(parseTimestamp(selectedDate.value), weekdays, today2.value)
      }
      return undefined
    })

    const parsedEnd = computed(() => {
      if (selectedDate.value) {
        return getEndOfWeek(parseTimestamp(selectedDate.value), weekdays, today2.value)
      }
      return undefined
    })

    const today2 = computed(() => {
      return parseTimestamp(today())
    })

    const days = computed(() => {
      if (parsedStart.value && parsedEnd.value) {
        return createDayList(
          parsedStart.value,
          parsedEnd.value,
          today2.value,
          weekdaySkips.value
        )
      }
      return []
    })

    const dayStyle = computed(() => {
      const width = 100 / weekdays.length + '%'
      return {
        width
      }
    })

    function onPrev () {
      const ts = addToDate(parsedStart.value, { day: -7 })
      selectedDate.value = ts.date
      transition.value = 'q-calendar--' + transitionPrev.value
    }

    function onNext () {
      const ts = addToDate(parsedStart.value, { day: 7 })
      selectedDate.value = ts.date
      transition.value = 'q-calendar--' + transitionNext.value
    }

    function dayClass (day) {
      return {
        'date-button': true,
        'selected-date-button': selectedDate.value === day.date
      }
    }

    function monthFormatterFunc () {
      const longOptions = { timeZone: 'UTC', month: 'long' }
      const shortOptions = { timeZone: 'UTC', month: 'short' }

      return createNativeLocaleFormatter(
        locale.value,
        (_tms, short) => (short ? shortOptions : longOptions)
      )
    }

    function weekdayFormatterFunc () {
      const longOptions = { timeZone: 'UTC', weekday: 'long' }
      const shortOptions = { timeZone: 'UTC', weekday: 'short' }

      return createNativeLocaleFormatter(
        locale.value,
        (_tms, short) => (short ? shortOptions : longOptions)
      )
    }

    function dayFormatterFunc () {
      const longOptions = { timeZone: 'UTC', day: '2-digit' }
      const shortOptions = { timeZone: 'UTC', day: 'numeric' }

      return createNativeLocaleFormatter(
        locale.value,
        (_tms, short) => (short ? shortOptions : longOptions)
      )
    }

    function onMoved (data) {
      console.log('onMoved', data)
    }
    function onChange (data) {
      console.log('onChange', data)
    }
    function onClickDate (data) {
      console.log('onClickDate', data)
    }
    function onClickTime (data) {
      console.log('onClickTime', data)
    }
    function onClickInterval (data) {
      console.log('onClickInterval', data)
    }
    function onClickHeadIntervals (data) {
      console.log('onClickHeadIntervals', data)
    }
    function onClickHeadDay (data) {
      console.log('onClickHeadDay', data)
    }

    return {
      selectedDate,
      calendar,
      locale,
      monthFormatter,
      dayFormatter,
      weekdayFormatter,
      transitionPrev,
      transitionNext,
      transition,
      parsedStart,
      days,
      dayStyle,
      onPrev,
      onNext,
      dayClass,
      onMoved,
      onChange,
      onClickDate,
      onClickTime,
      onClickInterval,
      onClickHeadIntervals,
      onClickHeadDay
    }
  }
})
</script>

<style lang="sass" scoped>
.title-bar
  position: relative
  width: 100%
  height: 70px
  background: #3f51b5
  // display: flex
  // flex-direction: row
  // flex: 1 0 100%
  // justify-content: space-between
  // align-items: center
  overflow: hidden
  border-radius: 3px
  user-select: none

.dates-holder
  position: relative
  width: 100%
  align-items: center
  display: flex
  justify-content: space-between
  color: #fff
  overflow: hidden
  user-select: none

.internal-dates-holder
  position: relative
  width: 100%
  display: inline-flex
  flex: 1 1 100%
  flex-direction: row
  justify-content: space-between
  overflow: hidden
  user-select: none

.direction-button
  background: #3f51b5
  color: white
  width: 40px
  max-width: 50px !important

.direction-button__left
  &:before
    content: '<'
    display: inline-flex
    flex-direction: column
    justify-content: center
    height: 100%
    font-weight: 900
    font-size: 3em

.direction-button__right
  &:before
    content: '>'
    display: inline-flex
    flex-direction: column
    justify-content: center
    height: 100%
    font-weight: 900
    font-size: 3em

.date-button
  color: white
  background: #3f51b5
  z-index: 2
  height: 100%
  outline: 0
  cursor: pointer
  border-radius: 3px
  display: inline-flex
  flex: 1 0 auto
  flex-direction: column
  align-items: stretch
  position: relative
  border: 0
  vertical-align: middle
  padding: 0
  font-size: 14px
  line-height: 1.715em
  text-decoration: none
  font-weight: 500
  text-transform: uppercase
  text-align: center
  user-select: none

.selected-date-button
  color: #3f51b5 !important
  background: white !important
</style>
