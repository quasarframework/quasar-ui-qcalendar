<template>
  <div class="my-sticky">
    <navigation-bar @today="onToday" @prev="onPrev" @next="onNext" />

    <div class="row justify-center">
      <div
        class="bordered q-ma-sm"
        style="height: 120px; max-height: 120px; overflow: auto; max-width: 800px; width: 100%"
      >
        <q-calendar-month
          ref="calendar"
          v-model="selectedDate"
          :day-min-height="70"
          focusable
          hoverable
          @change="onChange"
          @moved="onMoved"
          @click-date="onClickDate"
          @click-day="onClickDay"
          @click-head-day="onClickHeadDay"
        >
        </q-calendar-month>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { QCalendarMonth, today, Timestamp } from '@quasar/quasar-ui-qcalendar'
import '@quasar/quasar-ui-qcalendar/index.css'
import NavigationBar from 'components/NavigationBar.vue'

const selectedDate = ref(today()),
  calendar = ref<QCalendarMonth>(),
  startDate = ref(today()),
  endDate = ref(today())

function onMoved(data: Timestamp) {
  console.info('onMoved', data)
}

function onChange(data: { start: string; end: string }) {
  startDate.value = data.start
  endDate.value = data.end
}

function onClickDate(data: {
  event: Event
  scope: {
    outside: boolean
    disabled: boolean
    hasMonth: boolean
    miniMode: boolean
    activeDate: false
    selectedDate: boolean
    timestamp: Timestamp
  }
}) {
  console.info('onClickDate', data)
}

function onClickDay(data: {
  event: Event
  scope: {
    outside: boolean
    disabled: boolean
    droppable: boolean
    hasMonth: boolean
    miniMode: boolean
    activeDate: false
    timestamp: Timestamp
  }
}) {
  console.info('onClickDay', data)
}

function onClickHeadDay(data: {
  event: Event
  scope: {
    outside: boolean
    days: Timestamp[]
    disabled: boolean
    droppable: boolean
    index: number
    miniMode: boolean
    activeDate: false
    timestamp: Timestamp
  }
}) {
  console.info('onClickHeadDay', data)
}

function onToday() {
  selectedDate.value = today()
}

function onPrev() {
  if (calendar.value) {
    calendar.value.prev()
  }
}

function onNext() {
  if (calendar.value) {
    calendar.value.next()
  }
}
</script>

<style lang="scss">
// Be sure to wrap your code so it
// does not affect all your calendars
.my-sticky {
  .q-calendar {
    overflow: unset !important;

    .q-calendar-month {
      //position: relative;

      .q-calendar-month__head {
        position: sticky !important;
        top: 0;
        z-index: 2;
      }
    }
  }

  .bordered {
    border: 1px solid #bcbcbc;
  }
}
</style>
