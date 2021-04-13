<template>
  <div class="subcontent">
    <navigation-bar
      @today="onToday"
      @prev="onPrev"
      @next="onNext"
    />

    <div style="display: flex; justify-content: center; align-items: center">
      <q-checkbox
        v-model="hoverable"
        label="Hoverable"
      />

      <q-checkbox
        v-model="focusable"
        label="Focusable"
      />

      <q-select
        v-model="focusType"
        label="Focus Type"
        outlined
        dense
        multiple
        map-options
        emit-value
        options-dense
        :options="options"
        class="button"
        style="min-width: 180px;"
      />
    </div>

    <div style="display: flex; max-width: 800px; width: 100%; height: 400px;">
      <q-calendar-day
        ref="calendar"
        v-model="selectedDate"
        view="week"
        :hoverable="hoverable"
        :focusable="focusable"
        :focus-type="focusType"
        animated
        bordered
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
</template>

<script>
import { QCalendarDay } from '@quasar/quasar-ui-qcalendar/QCalendarDay.js'
import { today } from '@quasar/quasar-ui-qcalendar/Timestamp.js'
import '@quasar/quasar-ui-qcalendar/QCalendarVariables.sass'
import '@quasar/quasar-ui-qcalendar/QCalendarTransitions.sass'
import '@quasar/quasar-ui-qcalendar/QCalendarDay.sass'

import { defineComponent } from 'vue'
import NavigationBar from '../components/NavigationBar.vue'

export default defineComponent({
  name: 'WeekFocusableHoverable',
  components: {
    NavigationBar,
    QCalendarDay
  },
  data () {
    return {
      selectedDate: today(),
      hoverable: true,
      focusable: true,
      focusType: [],
      options: [ 'interval', 'weekday', 'date' ]
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
