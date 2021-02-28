<template>
  <div class="subcontent">
    <navigation-bar
      @today="onToday"
      @prev="onPrev"
      @next="onNext"
    />

    <div style="display: flex; justify-content: center">
      <QCalendarDay
        ref="calendar"
        v-model="selectedDate"
        view="week"
        bordered
        animated
        transition-next="slide-left"
        transition-prev="slide-right"
        style="max-width: 800px; width: 100%; height: 400px;"
        @change="onChange"
        @moved="onMoved"
        @click-date="onClickDate"
        @click-time="onClickTime"
        @click-interval="onClickInterval"
        @click-head-intervals="onClickHeadIntervals"
        @click-head-day="onClickHeadDay"
      >
        <template #day-interval="{ scope }">
          <div style="display: flex; flex-direction: column; justify-content: center; align-items: center; height: 100%; font-size: 10px;">
            {{ getData(scope) }}
          </div>
        </template>
      </QCalendarDay>
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
  name: 'WeekSlotDayInterval',
  components: {
    NavigationBar,
    QCalendarDay
  },
  data () {
    return {
      selectedDate: today()
    }
  },
  methods: {
    getData (scope) {
      // console.log(scope)
      return scope.timestamp.time
    },
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
