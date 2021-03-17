<template>
  <div class="subcontent">
    <navigation-bar
      @today="onToday"
      @prev="onPrev"
      @next="onNext"
    />

    <div style="display: flex; justify-content: center; align-items: center">
      <div style="display: flex; justify-content: center; align-items: center">
        <label for="hoverable">Hoverable:</label>
        <input
          id="hoverable"
          v-model="hoverable"
          type="checkbox"
        >
      </div>
      <div style="display: flex; justify-content: center; align-items: center">
        <label for="focusable">Focusable:</label>
        <input
          id="focusable"
          v-model="focusable"
          type="checkbox"
        >
        <div style="display: flex; justify-content: center; align-items: center">
          <label
            for="focus-type"
            style="margin-right: 2px;"
          >focus-type:</label>
          <select
            id="focus-type"
            v-model="focusTypeSelection"
            class="button select"
          >
            <option
              v-for="option in options"
              :key="option"
              :value="option"
            >
              {{ option + (focusType.includes(option) ? ' ✔' : '') }}
            </option>
          </select>
        </div>
      </div>
    </div>

    <div style="display: flex; justify-content: center; max-width: 800px; width: 100%;">
      <QCalendarScheduler
        ref="calendar"
        v-model="selectedDate"
        v-model:modelResources="resources"
        view="week"
        :hoverable="hoverable"
        :focusable="focusable"
        :focus-type="focusType"
        animated
        bordered
        style="max-width: 800px; width: 100%;"
        @change="onChange"
        @moved="onMoved"
        @click-date="onClickDate"
        @click-day-resource="onClickDayResource"
        @click-resource="onClickResource"
        @click-head-resources="onClickHeadResources"
        @click-head-day="onClickHeadDay"
      />
    </div>
  </div>
</template>

<script>
import { QCalendarScheduler } from '@quasar/quasar-ui-qcalendar/QCalendarScheduler.js'
import { today } from '@quasar/quasar-ui-qcalendar/Timestamp.js'
import '@quasar/quasar-ui-qcalendar/QCalendarVariables.sass'
import '@quasar/quasar-ui-qcalendar/QCalendarTransitions.sass'
import '@quasar/quasar-ui-qcalendar/QCalendarScheduler.sass'

import { defineComponent } from 'vue'
import NavigationBar from '../components/NavigationBar.vue'

export default defineComponent({
  name: 'SchedulerFocusableHoverable',
  components: {
    NavigationBar,
    QCalendarScheduler
  },
  data () {
    return {
      selectedDate: today(),
      hoverable: true,
      focusable: true,
      focusType: [],
      focusTypeSelection: '',
      options: [ 'day', 'weekday', 'date', 'resource' ],
      resources: [
        { id: 1, label: 'John' },
        { id: 2, label: 'Mary' },
        { id: 3, label: 'Susan' },
        { id: 4, label: 'Olivia' },
        { id: 5, label: 'Board Room' },
        { id: 6, label: 'Room-1' },
        { id: 7, label: 'Room-2' }
      ]
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
    onClickDayResource (data) {
      console.log('onClickDayResource', data)
    },
    onClickResource (data) {
      console.log('onClickResource', data)
    },
    onClickHeadResources (data) {
      console.log('onClickHeadResources', data)
    },
    onClickHeadDay (data) {
      console.log('onClickHeadDay', data)
    }
  }
})
</script>
