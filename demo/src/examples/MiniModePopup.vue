<template>
  <div class="row justify-center" style="max-width: 800px; width: 100%; overflow: hidden;">
    <div class="q-gutter-sm">
      <q-checkbox v-model="mobile" label="Use Touch (set if on mobile)" />
    </div>
    <q-separator class="full-width" />
    <q-input color="blue-8" filled v-model="convertedDates" @input="onInputChanged" label="Enter date range" mask="####-##-## - ####-##-##" class="q-pa-sm">
      <template v-slot:append>
        <div class="q-gutter-sm" style="overflow: hidden;">
          <span>
            <q-icon name="far fa-calendar" class="cursor-pointer q-ma-md" />
            <q-popup-proxy v-model="showCalendar" anchor="top right" self="bottom middle">
              <div style="width: 300px;">
                <div class="row q-pa-sm">
                  <div class="col-8 row justify-evenly items-center">
                    <q-icon name="fas fa-chevron-left" @click="calendarPrev" />
                    <div class="text-center" style="min-width: 100px;">{{ formattedMonth }}</div>
                    <q-icon name="fas fa-chevron-right" @click="calendarNext" />
                  </div>
                  <div class="col-4 row justify-evenly items-center">
                    <q-icon name="fas fa-chevron-left" @click="addToYear(-1)" />
                    {{ selectedYear }}
                    <q-icon name="fas fa-chevron-right" @click="addToYear(1)" />
                  </div>
                </div>
                <q-calendar
                  ref="calendar"
                  v-model="selectedDate"
                  view="month"
                  :locale="locale"
                  mini-mode
                  :day-class="classDay"
                  @changed="onChanged"
                  @mousedown:day="onMouseDownDay"
                  @mouseup:day="onMouseUpDay"
                  @mousemove:day="onMouseMoveDay"
                  style="height: 250px;"
                />
                <div class="row justify-center q-pa-xs">
                  <q-btn label="Today" no-caps flat size="sm" @click="onToday" />
                </div>
              </div>
            </q-popup-proxy>
          </span>
        </div>
      </template>
    </q-input>
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

function leftClick (e) {
  return e.button === 0
}

export default {
  data () {
    return {
      selectedDate: getCurrentDay(CURRENT_DAY.getDate()),
      selectedYear: CURRENT_DAY.getFullYear(),
      convertedDates: '',
      showCalendar: false,
      anchorTimestamp: '',
      otherTimestamp: '',
      mouseDown: false,
      mobile: false,
      locale: 'en-us'
    }
  },

  computed: {
    startEndDates () {
      const dates = []
      if (this.anchorDayIdentifier !== false && this.otherDayIdentifier !== false) {
        if (this.anchorDayIdentifier <= this.otherDayIdentifier) {
          dates.push(this.anchorTimestamp.date, this.otherTimestamp.date)
        }
        else {
          dates.push(this.otherTimestamp.date, this.anchorTimestamp.date)
        }
      }
      return dates
    },

    anchorDayIdentifier () {
      if (this.anchorTimestamp !== '') {
        return QCalendar.getDayIdentifier(this.anchorTimestamp)
      }
      return false
    },

    otherDayIdentifier () {
      if (this.otherTimestamp !== '') {
        return QCalendar.getDayIdentifier(this.otherTimestamp)
      }
      return false
    },

    lowIdentifier () {
      // returns lowest of the two values
      return Math.min(this.anchorDayIdentifier, this.otherDayIdentifier)
    },

    highIdentifier () {
      // returns highest of the two values
      return Math.max(this.anchorDayIdentifier, this.otherDayIdentifier)
    },

    formattedMonth () {
      const date = new Date(this.selectedDate)
      return this.monthFormatter().format(date)
    }
  },

  watch: {
    startEndDates () {
      const [start, end] = this.startEndDates
      this.convertedDates = `${start} - ${end}`
    },

    selectedDate () {
      const tm = QCalendar.parseTimestamp(this.selectedDate)
      this.selectedYear = tm.year
    }
  },

  methods: {
    onInputChanged (val) {
      const items = val.split(' - ')
      if (items[0] && items[0].length === 10) this.anchorTimestamp = QCalendar.parseTimestamp(items[0])
      if (items[1] && items[1].length === 10) this.otherTimestamp = QCalendar.parseTimestamp(items[1])
    },

    onChanged ({ start, end }) {
      console.log(start, end)
    },

    addToYear (amount) {
      // parse current date to timestamp
      let ts = QCalendar.parseTimestamp(this.selectedDate)
      // add specified amount of days
      ts = QCalendar.addToDate(ts, { year: amount })
      // re-assign values
      this.selectedDate = ts.date
      this.selectedYear = ts.year
    },

    onToday () {
      this.selectedDate = getCurrentDay(CURRENT_DAY.getDate())
    },

    calendarNext () {
      this.$refs.calendar.next()
    },

    calendarPrev () {
      this.$refs.calendar.prev()
    },

    classDay (timestamp) {
      if (this.anchorDayIdentifier !== false && this.otherDayIdentifier !== false) {
        return this.getBetween(timestamp)
      }
    },

    getBetween (timestamp) {
      const nowIdentifier = QCalendar.getDayIdentifier(timestamp)
      return {
        'q-selected-day-first': this.lowIdentifier === nowIdentifier,
        'q-selected-day': this.lowIdentifier <= nowIdentifier && this.highIdentifier >= nowIdentifier,
        'q-selected-day-last': this.highIdentifier === nowIdentifier
      }
    },

    onMouseDownDay ({ scope, event }) {
      if (leftClick(event)) {
        if (this.mobile === true &&
          this.anchorTimestamp !== null &&
          this.otherTimestamp !== null &&
          this.anchorTimestamp.date === this.otherTimestamp.date) {
          this.otherTimestamp = scope
          this.mouseDown = false
          return
        }
        // mouse is down, start selection and capture current
        this.mouseDown = true
        this.anchorTimestamp = scope
        this.otherTimestamp = scope
      }
    },

    onMouseUpDay ({ scope, event }) {
      if (leftClick(event)) {
        // mouse is up, capture last and cancel selection
        this.otherTimestamp = scope
        this.mouseDown = false
      }
    },

    onMouseMoveDay ({ scope, event }) {
      if (this.mouseDown === true) {
        this.otherTimestamp = scope
      }
    },

    monthFormatter () {
      try {
        return new Intl.DateTimeFormat(this.locale || undefined, {
          month: 'long',
          timeZone: 'UTC'
        })
      }
      catch (e) {
        //
      }
    }
  }
}
</script>
