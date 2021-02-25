<template>
  <div class="subcontent">
    <navigation-bar
      @today="onToday"
      @prev="onPrev"
      @next="onNext"
    />

    <div style="display: flex; justify-content: center">
      <input
        id="xxs"
        v-model="size"
        value="xxs"
        type="radio"
      >
      <label for="xxs">xxs</label>
      <input
        id="xs"
        v-model="size"
        value="xs"
        type="radio"
      >
      <label for="sm">sm</label>
      <input
        id="sm"
        v-model="size"
        value="sm"
        type="radio"
      >
      <label for="sm">sm</label>
      <input
        id="md"
        v-model="size"
        value="md"
        type="radio"
      >
      <label for="md">md</label>
      <input
        id="lg"
        v-model="size"
        value="lg"
        type="radio"
      >
      <label for="lg">lg</label>
      <input
        id="xl"
        v-model="size"
        value="xl"
        type="radio"
      >
      <label for="xl">xl</label>
      <input
        id="xxl"
        v-model="size"
        value="xxl"
        type="radio"
      >
      <label for="xxl">xxl</label>
    </div>

    <div style="display: flex; justify-content: center">
      <QCalendarMonth
        ref="calendar"
        v-model="selectedDate"
        :month-label-size="size"
        date-align="right"
        animated
        bordered
        style="max-width: 800px; width: 100%; height: 400px;"
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
</template>

<script>
import { QCalendarMonth } from '@quasar/quasar-ui-qcalendar/QCalendarMonth.js'
import { today } from '@quasar/quasar-ui-qcalendar/Timestamp.js'
import '@quasar/quasar-ui-qcalendar/QCalendarVariables.sass'
import '@quasar/quasar-ui-qcalendar/QCalendarTransitions.sass'
import '@quasar/quasar-ui-qcalendar/QCalendarMonth.sass'

import { defineComponent } from 'vue'
import NavigationBar from '../components/NavigationBar.vue'

export default defineComponent({
  name: 'MonthLabelSize',
  components: {
    NavigationBar,
    QCalendarMonth
  },
  data () {
    return {
      selectedDate: today(),
      size: 'sm'
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
