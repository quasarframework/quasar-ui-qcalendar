<template>
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

  <QCalendarDay
    ref="calendar"
    v-model="selectedDate"
    view="week"
    column-header-before
    column-header-after
    bordered
    animated
    transition-next="slide-left"
    transition-prev="slide-right"
    style="max-width: 800px; width: 100%; height: 400px; display: inline-flex;"
    @change="onChange"
    @moved="onMoved"
    @click-date="onClickDate"
    @click-time="onClickTime"
    @click-interval="onClickInterval"
    @click-head-intervals="onClickHeadIntervals"
    @click-head-day="onClickHeadDay"
  >
    <template #column-header-before="{ /* timestamp, index */ }">
      <div style="margin: 2px;">
        column-header-before slot
      </div>
    </template>
    <template #column-header-after="{ /* timestamp, index */ }">
      <div style="margin: 2px;">
        column-header-after slot
      </div>
    </template>
  </QCalendarDay>
</template>

<script>
import { QCalendarDay } from '@quasar/quasar-ui-qcalendar/QCalendarDay.js'
import { today } from '@quasar/quasar-ui-qcalendar/Timestamp.js'
import '@quasar/quasar-ui-qcalendar/QCalendarVariables.sass'
import '@quasar/quasar-ui-qcalendar/QCalendarTransitions.sass'
import '@quasar/quasar-ui-qcalendar/QCalendarDay.sass'

import { defineComponent } from 'vue'

export default defineComponent({
  name: 'WeekSlotColumnHeader',
  components: {
    QCalendarDay
  },
  data () {
    return {
      selectedDate: today()
    }
  },
  methods: {
    onNext () {
      this.$refs.calendar.next()
    },
    onPrev () {
      this.$refs.calendar.prev()
    },
    onToday () {
      this.$refs.calendar.moveToToday()
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

<style lang="sass">
.button
  margin: 5px 2px 10px 5px

</style>
