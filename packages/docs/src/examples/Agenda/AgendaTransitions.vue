<template>
  <div class="subcontent">
    <navigation-bar @today="onToday" @prev="onPrev" @next="onNext" />

    <div style="display: flex; justify-content: center">
      <div class="button-bar" style="margin: 12px">
        <div style="display: flex; align-items: center">
          <q-select
            v-model="previousTransition"
            label="Previous Transition"
            outlined
            dense
            options-dense
            :options="transitions"
            class="button"
            style="min-width: 160px"
          />

          <q-select
            v-model="nextTransition"
            label="Next Transition"
            outlined
            dense
            options-dense
            :options="transitions"
            class="button"
            style="min-width: 160px"
          />
        </div>
      </div>
    </div>

    <div class="row justify-center">
      <div style="display: flex; max-width: 800px; width: 100%; height: 200px">
        <q-calendar-agenda
          ref="calendar"
          v-model="selectedDate"
          view="week"
          short-weekday-label
          :day-min-height="200"
          bordered
          animated
          :transition-prev="previousTransition"
          :transition-next="nextTransition"
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

<script setup lang="ts">
import { ref } from 'vue'
import { QCalendarAgenda, today } from '@quasar/quasar-ui-qcalendar'
import '@quasar/quasar-ui-qcalendar/index.css'

import NavigationBar from 'components/NavigationBar.vue'

const calendar = ref<QCalendarAgenda>(),
  selectedDate = ref(today()),
  transitions = ref([
    'slide-left',
    'slide-right',
    'slide-up',
    'slide-down',
    'roll-left',
    'roll-right',
    'roll-up',
    'roll-down',
    'jump-left',
    'jump-right',
    'jump-up',
    'jump-down',
    'fade',
    'scale',
    'rotate',
    'spin',
    'flip',
  ]),
  previousTransition = ref('slide-left'),
  nextTransition = ref('slide-right')

const onChange = (date: string) => {
  console.log('Date changed:', date)
}

const onMoved = (date: string) => {
  console.log('Date moved:', date)
}

const onClickDate = (date: string) => {
  console.log('Date clicked:', date)
}

const onClickTime = (time: string) => {
  console.log('Time clicked:', time)
}

const onClickInterval = (interval: string) => {
  console.log('Interval clicked:', interval)
}

const onClickHeadIntervals = (interval: string) => {
  console.log('Head intervals clicked:', interval)
}

const onClickHeadDay = (day: string) => {
  console.log('Head day clicked:', day)
}

const onToday = () => {
  if (calendar.value) {
    calendar.value.moveToToday()
  }
}

const onPrev = () => {
  if (calendar.value) {
    calendar.value.prev()
  }
}

const onNext = () => {
  if (calendar.value) {
    calendar.value.next()
  }
}
</script>
