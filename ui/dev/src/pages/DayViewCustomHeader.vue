<template>
  <div>
    <div class="title-bar row items-center">
      <q-btn flat color="white" icon="fas fa-chevron-left" style="height: 100%" @click="onPrev" />
      <div class="row justify-between items-center text-white" style="width: calc(100% - 112px)">
        <div v-for="day in days" :key="day.date" class="col-auto" :style="dayStyle">
          <q-btn flat class="row justify-center" style="line-height: unset;" @click="selectedDate = day.date">
            <div class="text-center" style="width: 100%;">{{ monthFormatter(day, true) }}</div>
            <div class="text-center text-bold" style="width: 100%;  font-size: 16px;">{{ dayFormatter(day, false) }}</div>
            <div class="text-center" style="width: 100%; font-size: 10px;">{{ weekdayFormatter(day, true) }}</div>
          </q-btn>
        </div>
      </div>
      <q-btn flat color="white" icon="fas fa-chevron-right" style="height: 100%" @click="onNext" />
    </div>
    <q-calendar
      v-model="selectedDate"
      view="day"
      hide-header
      bordered
      :interval-height="50"
      locale="en-us"
      style="height: 400px; border-top: none;"
    />
  </div>
</template>

<script>
import {
  parseDate,
  parseTimestamp,
  getWeekdaySkips,
  getStartOfWeek,
  getEndOfWeek,
  createDayList,
  createNativeLocaleFormatter,
  addToDate
} from '@quasar/quasar-ui-qcalendar'
const CURRENT_DAY = new Date()

function getCurrentDay (day) {
  const newDay = new Date(CURRENT_DAY)
  newDay.setDate(day)
  const tm = parseDate(newDay)
  return tm.date
}

export default {
  data () {
    return {
      selectedDate: getCurrentDay(CURRENT_DAY.getDate()),
      weekdays: [0, 1, 2, 3, 4, 5, 6],
      locale: 'en-us',
      monthFormatter: this.monthFormatterFunc(),
      dayFormatter: this.dayFormatterFunc(),
      weekdayFormatter: this.weekdayFormatterFunc(),
      transitionPrev: 'slide-right',
      transitionNext: 'slide-left',
      transition: ''
    }
  },

  beforeMounted () {
  },

  computed: {
    weekdaySkips () {
      return getWeekdaySkips(this.weekdays)
    },

    parsedStart () {
      if (this.selectedDate) {
        return getStartOfWeek(parseTimestamp(this.selectedDate), this.weekdays, this.today)
      }
      return void 0
    },

    parsedEnd () {
      if (this.selectedDate) {
        return getEndOfWeek(parseTimestamp(this.selectedDate), this.weekdays, this.today)
      }
      return void 0
    },

    today () {
      const newDay = new Date(CURRENT_DAY)
      const tm = parseDate(newDay)
      return tm
    },

    days () {
      if (this.parsedStart && this.parsedEnd) {
        return createDayList(
          this.parsedStart,
          this.parsedEnd,
          this.today,
          this.weekdaySkips
        )
      }
      return []
    },

    dayStyle () {
      return {
        width: 100 / this.weekdays.length + '%'
      }
    }
  },

  methods: {
    onPrev () {
      const ts = addToDate(this.parsedStart, { day: -7 })
      this.selectedDate = ts.date
      this.transition = 'q-transition--' + this.transitionPrev
    },

    onNext () {
      const ts = addToDate(this.parsedStart, { day: 7 })
      this.selectedDate = ts.date
      this.transition = 'q-transition--' + this.transitionNext
    },

    monthFormatterFunc () {
      const longOptions = { timeZone: 'UTC', month: 'long' }
      const shortOptions = { timeZone: 'UTC', month: 'short' }

      return createNativeLocaleFormatter(
        this.locale,
        (_tms, short) => short ? shortOptions : longOptions
      )
    },

    weekdayFormatterFunc () {
      const longOptions = { timeZone: 'UTC', weekday: 'long' }
      const shortOptions = { timeZone: 'UTC', weekday: 'short' }

      return createNativeLocaleFormatter(
        this.locale,
        (_tms, short) => short ? shortOptions : longOptions
      )
    },

    dayFormatterFunc () {
      const longOptions = { timeZone: 'UTC', day: '2-digit' }
      const shortOptions = { timeZone: 'UTC', day: 'numeric' }

      return createNativeLocaleFormatter(
        this.locale,
        (_tms, short) => short ? shortOptions : longOptions
      )
    }
  }
}
</script>

<style lang="sass" scoped>
.title-bar
  width: 100%
  height: 70px
  background: $accent
  display: flex
  flex-direction: row
  flex: 1
</style>
