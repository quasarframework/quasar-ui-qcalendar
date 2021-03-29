<template>
  <div style="max-width: 800px; width: 100%;">

    <div class="title-bar row items-center overflow-hidden">
      <q-btn flat color="white" icon="fas fa-chevron-left" class="direction-button" style="height: 100%;" @click="onPrev"></q-btn>
      <transition :name="transition" appear>
        <div :key="parsedStart.date" class="row justify-between items-center text-white overflow-hidden" style="width: calc(100% - 112px)">
          <div v-for="day in days" :key="day.date" class="col-auto" :style="dayStyle">
            <q-btn flat :class="dayClass(day)" style="line-height: unset;" @click="selectedDate = day.date; transition = ''">
              <div class="text-center" style="width: 100%;">{{ monthFormatter(day, true) }}</div>
              <div class="text-center text-bold" style="width: 100%;  font-size: 16px;">{{ dayFormatter(day, false) }}</div>
              <div class="text-center" style="width: 100%; font-size: 10px;">{{ weekdayFormatter(day, true) }}</div>
            </q-btn>
          </div>
        </div>
      </transition>
      <q-btn flat color="white" icon="fas fa-chevron-right" class="direction-button" style="height: 100%;" @click="onNext"></q-btn>
    </div>

    <div style="width: 800px; width: 100%; height: 200px; border: #c0c0c0 1px solid;">
      <q-calendar
        v-model="selectedDate"
        :interval-height="50"
        no-scroll
        class="calendar-container"
        view="day"
        hide-header
        animated
        locale="en-us"
        style="border-top: none; width: 1200px; height: 1200px;"
      >
        <template #day-body>
          <q-card v-for="item in 20" :key="item" class="my-event row justify-center ellipsis" style="top: 50px" :style="{'left': ((item - 1) * 50 + 2) + 'px'}">
            <q-card-section>
            {{item}}
            </q-card-section>
          </q-card>
        </template>
      </q-calendar>
    </div>

  </div>
</template>

<script>
// normally you would not import "all" of QCalendar, but is needed for this example to work with UMD (codepen)
import QCalendar from 'ui' // ui is aliased from '@quasar/quasar-ui-qcalendar'

const CURRENT_DAY = new Date()

function getCurrentDay (day) {
  const newDay = new Date(CURRENT_DAY)
  newDay.setDate(day)
  const tm = QCalendar.parseDate(newDay)
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
      return QCalendar.getWeekdaySkips(this.weekdays)
    },

    parsedStart () {
      if (this.selectedDate) {
        return QCalendar.getStartOfWeek(QCalendar.parseTimestamp(this.selectedDate), this.weekdays, this.today)
      }
      return undefined
    },

    parsedEnd () {
      if (this.selectedDate) {
        return QCalendar.getEndOfWeek(QCalendar.parseTimestamp(this.selectedDate), this.weekdays, this.today)
      }
      return undefined
    },

    today () {
      const newDay = new Date(CURRENT_DAY)
      const tm = QCalendar.parseDate(newDay)
      return tm
    },

    days () {
      if (this.parsedStart && this.parsedEnd) {
        return QCalendar.createDayList(
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
      const ts = QCalendar.addToDate(this.parsedStart, { day: -7 })
      this.selectedDate = ts.date
      this.transition = 'q-transition--' + this.transitionPrev
    },

    onNext () {
      const ts = QCalendar.addToDate(this.parsedStart, { day: 7 })
      this.selectedDate = ts.date
      this.transition = 'q-transition--' + this.transitionNext
    },

    dayClass (day) {
      return {
        row: true,
        'justify-center': true,
        'selected-date': this.selectedDate === day.date
      }
    },

    monthFormatterFunc () {
      const longOptions = { timeZone: 'UTC', month: 'long' }
      const shortOptions = { timeZone: 'UTC', month: 'short' }

      return QCalendar.createNativeLocaleFormatter(
        this.locale,
        (_tms, short) => short ? shortOptions : longOptions
      )
    },

    weekdayFormatterFunc () {
      const longOptions = { timeZone: 'UTC', weekday: 'long' }
      const shortOptions = { timeZone: 'UTC', weekday: 'short' }

      return QCalendar.createNativeLocaleFormatter(
        this.locale,
        (_tms, short) => short ? shortOptions : longOptions
      )
    },

    dayFormatterFunc () {
      const longOptions = { timeZone: 'UTC', day: '2-digit' }
      const shortOptions = { timeZone: 'UTC', day: 'numeric' }

      return QCalendar.createNativeLocaleFormatter(
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
  background: #9c27b0
  display: flex
  flex-direction: row
  flex: 1

.direction-button
  background: #9c27b0
  color: white
  z-index: 20

.selected-date
  color: #9c27b0
  background: white

.my-event
  position: absolute
  width: 46px
  height: 46px
  margin: 2px

.calendar-container
  position: relative
</style>
