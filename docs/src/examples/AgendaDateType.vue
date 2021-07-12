<template>
  <div class="subcontent">
    <navigation-bar
      @today="onToday"
      @prev="onPrev"
      @next="onNext"
    />

    <div class="q-ma-sm row justify-center">
      <q-radio
        v-model="dateType"
        val="round"
        label="round"
        dense
        style="min-width: 100px;"
      />
      <q-radio
        v-model="dateType"
        val="rounded"
        label="rounded"
        dense
        style="min-width: 100px;"
      />
      <q-radio
        v-model="dateType"
        val="square"
        label="square"
        dense
        style="min-width: 100px;"
      />
    </div>

    <div class="row justify-center">
      <div style="display: flex; max-width: 800px; width: 100%; height: 200px;">
        <q-calendar-agenda
          ref="calendar"
          v-model="selectedDate"
          view="week"
          :date-type="dateType"
          :left-column-options="leftColumnOptions"
          :right-column-options="rightColumnOptions"
          column-options-id="id"
          column-options-label="label"
          :day-min-height="200"
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
  </div>
</template>

<script>
import { QCalendarAgenda, today } from '@quasar/quasar-ui-qcalendar/src/index.js'
import '@quasar/quasar-ui-qcalendar/src/QCalendarVariables.sass'
import '@quasar/quasar-ui-qcalendar/src/QCalendarTransitions.sass'
import '@quasar/quasar-ui-qcalendar/src/QCalendarAgenda.sass'

import { defineComponent } from 'vue'
import NavigationBar from '../components/NavigationBar.vue'

export default defineComponent({
  name: 'AgendaDateType',
  components: {
    NavigationBar,
    QCalendarAgenda
  },
  data () {
    return {
      selectedDate: today(),
      dateType: 'square',
      leftColumnOptions: [
        {
          id: 'overdue',
          label: 'Overdue'
        }
      ],
      rightColumnOptions: [
        {
          id: 'summary',
          label: 'Summary'
        }
      ]
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
