<template>
  <div style="margin: 12px;">
    <label for="hoverable">Hoverable:</label>
    <input
      id="hoverable"
      v-model="hoverable"
      type="checkbox"
    >
    <label for="focusable">Focusable:</label>
    <input
      id="focusable"
      v-model="focusable"
      type="checkbox"
    >
    <label
      for="focus-type"
      style="margin-right: 2px;"
    >focus-type:</label>
    <select
      id="focus-type"
      v-model="focusTypeSelection"
    >
      <option
        v-for="option in options"
        :key="option"
        :value="option"
      >
        {{ option }} {{ focusType.includes(option) ? ' ✔' : '' }}
      </option>
    </select>
  </div>

  <div style="margin: 12px;">
    <button
      class="button"
      style="margin: 2px;"
      @click="onToday"
    >
      Today
    </button>
    <button
      class="button"
      style="margin: 2px;"
      @click="onPrev"
    >
      &lt; Prev
    </button>
    <button
      class="button"
      style="margin: 2px;"
      @click="onNext"
    >
      Next &gt;
    </button>
  </div>

  <div style="width: 100%; display: flex; justify-content: center">
    <QCalendarDay
      ref="calendar"
      v-model="selectedDate"
      view="week"
      :hoverable="hoverable"
      :focusable="focusable"
      :focus-type="focusType"
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
import { today } from '@quasar/quasar-ui-qcalendar/Timestamp.js'
import '@quasar/quasar-ui-qcalendar/QCalendarVariables.sass'
import '@quasar/quasar-ui-qcalendar/QCalendarTransitions.sass'
import '@quasar/quasar-ui-qcalendar/QCalendarDay.sass'

import { defineComponent } from 'vue'

export default defineComponent({
  name: 'WeekFocusableHoverable',
  components: {
    QCalendarDay
  },
  data () {
    return {
      selectedDate: today(),
      hoverable: true,
      focusable: true,
      focusType: [],
      focusTypeSelection: '',
      options: [ 'day', 'weekday', 'date' ]
    }
  },
  watch: {
    hoverable (val) {
      console.log(`hoverable: ${ val }`)
    },
    focusable (val) {
      console.log(`focusable: ${ val }`)
    },
    focusTypeSelection (val) {
      const index = this.focusType.indexOf(val)
      if (index > -1) {
        this.focusType.splice(index, 1)
      }
      else {
        this.focusType.push(val)
      }
      console.log('focusType', this.focusType)
    }
  },
  methods: {
    onToday () {
      this.$refs.calendar.moveToToday()
    },
    onPrev () {
      this.$refs.calendar.prev()
    },
    onNext () {
      this.$refs.calendar.next()
    },
    onMoved (data) {
      console.log('onMoved', data)
    },
    onChange (data) {
      console.log('onChange', data)
    },
    onClickDate (data) {
      console.log('onClickDate', data)
    },
    onClickTime (data) {
      console.log('onClickTime', data)
    },
    onClickInterval (data) {
      console.log('onClickInterval', data)
    },
    onClickHeadIntervals (data) {
      console.log('onClickHeadIntervals', data)
    },
    onClickHeadDay (data) {
      console.log('onClickHeadDay', data)
    }
  }
})
</script>
