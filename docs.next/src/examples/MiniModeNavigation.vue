<template>
  <div class="subcontent">
    <div class="line">For keyboard navigation use the <span class="example-token">use-navigation</span> property along with the <span class="example-token">focusable</span> and <span class="example-token">focus-type</span> properties.</div>
    <div class="line">Hint: When the calendar has focus use the <kbd>Home</kbd>, <kbd>End</kbd>, <kbd>&larr;</kbd>, <kbd>&rarr;</kbd>, <kbd>&uarr;</kbd>, <kbd>&darr;</kbd>, <kbd>PgUp</kbd>, <kbd>PgDn</kbd>, <kbd>Home</kbd> and , <kbd>End</kbd>keys.</div>
    <div class="line">You can also use <kbd>Tab</kbd> and <kbd>Shift</kbd>+<kbd>Tab</kbd> for regular browser navigation.</div>

    <navigation-bar
      @today="onToday"
      @prev="onPrev"
      @next="onNext"
    />

    <div style="display: flex; justify-content: center">
      <div style="max-width: 280px; width: 100%; display: flex; flex-direction: column; justify-content: center; border: 1px solid #ccc; border-radius: 4px; padding: 10px;">
        <div style="width: 100%; display: flex; justify-content: space-evenly">
          <div style="width: 50%; display: flex; justify-content: space-between;">
            <span
              class="q-button"
              style="cursor: pointer; user-select: none;"
              @click="onPrev"
            >&lt;</span>
            {{ formattedMonth }}
            <span
              class="q-button"
              style="cursor: pointer; user-select: none;"
              @click="onNext"
            >&gt;</span>
          </div>
          <div style="width: 30%; display: flex; justify-content: space-between;">
            <span
              class="q-button"
              style="cursor: pointer; user-select: none;"
              @click="addToYear(-1)"
            >&lt;</span>
            {{ selectedYear }}
            <span
              class="q-button"
              style="cursor: pointer; user-select: none;"
              @click="addToYear(1)"
            >&gt;</span>
          </div>
        </div>

        <div style="display: flex; justify-content: center; align-items: center; flex-wrap: nowrap;">
          <div style="display: flex; max-width: 280px; width: 100%;">
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

<script>
import {
  addToDate,
  parseTimestamp,
  today
} from '@quasar/quasar-ui-qcalendar/src/Timestamp.js'
import { QCalendarMonth } from '@quasar/quasar-ui-qcalendar/src/QCalendarMonth.js'
import '@quasar/quasar-ui-qcalendar/src/QCalendarVariables.sass'
import '@quasar/quasar-ui-qcalendar/src/QCalendarTransitions.sass'
import '@quasar/quasar-ui-qcalendar/src/QCalendarMonth.sass'

import { defineComponent, ref, computed } from 'vue'
import NavigationBar from '../components/NavigationBar.vue'

export default defineComponent({
  name: 'MiniModeNavigation',
  components: {
    NavigationBar,
    QCalendarMonth
  },
  setup () {
    const selectedDate = ref(today()),
      calendar = ref(null),
      selectedYear = ref(new Date().getFullYear()),
      locale = 'en-US'

    const formattedMonth = computed(() => {
      const date = new Date(selectedDate.value)
      return monthFormatter().format(date)
    })

    function monthFormatter () {
      try {
        return new Intl.DateTimeFormat(locale || undefined, {
          month: 'long',
          timeZone: 'UTC'
        })
      }
      catch (e) {
        //
      }
    }

    function addToYear (amount) {
      // parse current date to timestamp
      let ts = parseTimestamp(selectedDate.value)
      // add specified amount of days
      ts = addToDate(ts, { year: amount })
      // re-assign values
      selectedDate.value = ts.date
      selectedYear.value = ts.year
    }

    function onToday () {
      calendar.value.moveToToday()
    }
    function onPrev () {
      calendar.value.prev()
    }
    function onNext () {
      calendar.value.next()
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
    function onClickDay (data) {
      console.log('onClickDay', data)
    }
    function onClickWorkweek (data) {
      console.log('onClickWorkweek', data)
    }
    function onClickHeadDay (data) {
      console.log('onClickHeadDay', data)
    }
    function onClickHeadWorkweek (data) {
      console.log('onClickHeadWorkweek', data)
    }

    return {
      selectedDate,
      calendar,
      selectedYear,
      formattedMonth,
      addToYear,
      onToday,
      onPrev,
      onNext,
      onMoved,
      onChange,
      onClickDate,
      onClickDay,
      onClickWorkweek,
      onClickHeadDay,
      onClickHeadWorkweek
    }
  }
})
</script>
