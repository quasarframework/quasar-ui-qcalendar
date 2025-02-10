<template>
  <div class="subcontent">
    <navigation-bar @today="onToday" @prev="onPrev" @next="onNext" />

    <div class="row justify-center">
      <div style="display: flex; max-width: 800px; width: 100%; height: 200px">
        <q-calendar-agenda
          ref="calendar"
          v-model="selectedDate"
          view="day"
          :column-count="3"
          :left-column-options="leftColumnOptions"
          :right-column-options="rightColumnOptions"
          column-options-id="id"
          column-options-label="label"
          :day-min-height="200"
          bordered
          animated
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

const selectedDate = ref(today())
const leftColumnOptions = ref([
  {
    id: 'overdue',
    label: 'Overdue',
  },
])
const rightColumnOptions = ref([
  {
    id: 'summary',
    label: 'Summary',
  },
])
const calendar = ref<QCalendarAgenda>()

const onChange = (date: string) => {
  console.info('Date changed:', date)
}

const onMoved = (date: string) => {
  console.info('Date moved:', date)
}

const onClickDate = (date: string) => {
  console.info('Date clicked:', date)
}

const onClickTime = (time: string) => {
  console.info('Time clicked:', time)
}

const onClickInterval = (interval: string) => {
  console.info('Interval clicked:', interval)
}

const onClickHeadIntervals = (interval: string) => {
  console.info('Head intervals clicked:', interval)
}

const onClickHeadDay = (day: string) => {
  console.info('Head day clicked:', day)
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
