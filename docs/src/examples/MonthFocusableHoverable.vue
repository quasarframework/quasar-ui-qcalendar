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

    <div class="row justify-center">
      <div style="display: flex; max-width: 800px; width: 100%;">
        <q-calendar-month
          ref="calendar"
          v-model="selectedDate"
          :hoverable="hoverable"
          :focusable="focusable"
          :focus-type="focusType"
          :day-min-height="40"
          animated
          bordered
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
</template>

<script>
import { QCalendarMonth, today } from '@quasar/quasar-ui-qcalendar/src/index.js'
import '@quasar/quasar-ui-qcalendar/src/QCalendarVariables.sass'
import '@quasar/quasar-ui-qcalendar/src/QCalendarTransitions.sass'
import '@quasar/quasar-ui-qcalendar/src/QCalendarMonth.sass'

import { defineComponent } from 'vue'
import NavigationBar from '../components/NavigationBar.vue'

export default defineComponent({
  name: 'MonthFocusableHoverable',
  components: {
    NavigationBar,
    QCalendarMonth
  },
  data () {
    return {
      selectedDate: today(),
      hoverable: true,
      focusable: true,
      focusType: [],
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
    onClickDay (data) {
      console.log('onClickDay', data)
    },
    onClickWorkweek (data) {
      console.log('onClickWorkweek', data)
    },
    onClickHeadDay (data) {
      console.log('onClickHeadDay', data)
    },
    onClickHeadWorkweek (data) {
      console.log('onClickHeadWorkweek', data)
    }
  }
})
</script>
