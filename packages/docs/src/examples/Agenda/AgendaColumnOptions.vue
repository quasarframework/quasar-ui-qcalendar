<template>
  <div class="subcontent">
    <navigation-bar @today="onToday" @prev="onPrev" @next="onNext" />

    <div class="row justify-center">
      <div style="display: flex; max-width: 800px; width: 100%; height: 400px">
        <q-calendar-agenda
          ref="calendar"
          v-model="selectedDate"
          view="week"
          :left-column-options="leftColumnOptions"
          :right-column-options="rightColumnOptions"
          :weekdays="[1, 2, 3, 4, 5]"
          :day-min-height="200"
          bordered
          animated
          locale="en-US"
          @change="onChange"
          @moved="onMoved"
          @click-date="onClickDate"
          @click-time="onClickTime"
          @click-interval="onClickInterval"
          @click-head-intervals="onClickHeadIntervals"
          @click-head-day="onClickHeadDay"
        >
          <template #day="{ scope: { timestamp } }">
            <template v-for="a in getAgenda(timestamp)" :key="timestamp.date + a.time">
              <div
                :label="a.time"
                class="justify-start q-ma-sm shadow-5 bg-grey-6"
                style="margin-top: 25px"
              >
                <div
                  v-if="a.avatar"
                  class="row justify-center"
                  style="margin-top: 30px; width: 100%"
                >
                  <q-avatar style="margin-top: -50px; margin-bottom: 10px; font-size: 60px">
                    <img :src="a.avatar" style="border: #9e9e9e solid 5px" />
                  </q-avatar>
                </div>
                <div class="col-12 q-px-sm">
                  <strong>{{ a.time }}</strong>
                </div>
                <div v-if="a.desc" class="col-12 q-px-sm" style="font-size: 10px">
                  {{ a.desc }}
                </div>
              </div>
            </template>
          </template>
        </q-calendar-agenda>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { QCalendarAgenda, Timestamp, today } from '@quasar/quasar-ui-qcalendar'
import '@quasar/quasar-ui-qcalendar/index.css'
import NavigationBar from 'components/NavigationBar.vue'

interface AgendaItem {
  time: string
  avatar?: string
  desc?: string
}

const calendar = ref<QCalendarAgenda>()
const selectedDate = ref(today())
const agenda = reactive<Record<number, AgendaItem[]>>({
  // value represents day of the week
  1: [
    {
      time: '08:00',
      avatar: 'https://cdn.quasar.dev/img/boy-avatar.png',
      desc: 'Meeting with CEO',
    },
    {
      time: '08:30',
      avatar: 'https://cdn.quasar.dev/img/avatar.png',
      desc: 'Meeting with HR',
    },
    {
      time: '10:00',
      avatar: 'https://cdn.quasar.dev/img/avatar1.jpg',
      desc: 'Meeting with Karen',
    },
  ],
  2: [
    {
      time: '11:30',
      avatar: 'https://cdn.quasar.dev/img/avatar2.jpg',
      desc: 'Meeting with Alisha',
    },
    {
      time: '17:00',
      avatar: 'https://cdn.quasar.dev/img/avatar3.jpg',
      desc: 'Meeting with Sarah',
    },
  ],
  3: [
    {
      time: '08:00',
      desc: 'Stand-up SCRUM',
      avatar: 'https://cdn.quasar.dev/img/material.png',
    },
    {
      time: '09:00',
      avatar: 'https://cdn.quasar.dev/img/boy-avatar.png',
    },
    {
      time: '10:00',
      desc: 'Sprint planning',
      avatar: 'https://cdn.quasar.dev/img/material.png',
    },
    {
      time: '13:00',
      avatar: 'https://cdn.quasar.dev/img/avatar1.jpg',
    },
  ],
  4: [
    {
      time: '09:00',
      avatar: 'https://cdn.quasar.dev/img/avatar3.jpg',
    },
    {
      time: '10:00',
      avatar: 'https://cdn.quasar.dev/img/avatar2.jpg',
    },
    {
      time: '13:00',
      avatar: 'https://cdn.quasar.dev/img/material.png',
    },
  ],
  5: [
    {
      time: '08:00',
      avatar: 'https://cdn.quasar.dev/img/boy-avatar.png',
    },
    {
      time: '09:00',
      avatar: 'https://cdn.quasar.dev/img/avatar2.jpg',
    },
    {
      time: '09:30',
      avatar: 'https://cdn.quasar.dev/img/avatar4.jpg',
    },
    {
      time: '10:00',
      avatar: 'https://cdn.quasar.dev/img/avatar5.jpg',
    },
    {
      time: '11:30',
      avatar: 'https://cdn.quasar.dev/img/material.png',
    },
    {
      time: '13:00',
      avatar: 'https://cdn.quasar.dev/img/avatar6.jpg',
    },
    {
      time: '13:30',
      avatar: 'https://cdn.quasar.dev/img/avatar3.jpg',
    },
    {
      time: '14:00',
      avatar: 'https://cdn.quasar.dev/img/linux-avatar.png',
    },
    {
      time: '14:30',
      avatar: 'https://cdn.quasar.dev/img/avatar.png',
    },
    {
      time: '15:00',
      avatar: 'https://cdn.quasar.dev/img/boy-avatar.png',
    },
    {
      time: '15:30',
      avatar: 'https://cdn.quasar.dev/img/avatar2.jpg',
    },
    {
      time: '16:00',
      avatar: 'https://cdn.quasar.dev/img/avatar6.jpg',
    },
  ],
})
const leftColumnOptions = reactive([
  {
    id: 'over-due',
    label: 'Over Due',
  },
])
const rightColumnOptions = reactive([
  {
    id: 'summary',
    label: 'Summary',
  },
])

function getAgenda(day: Timestamp) {
  return agenda[Number(day.weekday)] || []
}
function onToday() {
  if (calendar.value) {
    calendar.value.moveToToday()
  }
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
function onMoved(data: Timestamp) {
  console.info('onMoved', data)
}
function onChange(data: { start: Timestamp; end: Timestamp; days: Timestamp[] }) {
  console.info('onChange', data)
}
function onClickDate(data: Timestamp) {
  console.info('onClickDate', data)
}
function onClickTime(data: Timestamp) {
  console.info('onClickTime', data)
}
function onClickInterval(data: Timestamp) {
  console.info('onClickInterval', data)
}
function onClickHeadIntervals(data: Timestamp) {
  console.info('onClickHeadIntervals', data)
}
function onClickHeadDay(data: Timestamp) {
  console.info('onClickHeadDay', data)
}
</script>
