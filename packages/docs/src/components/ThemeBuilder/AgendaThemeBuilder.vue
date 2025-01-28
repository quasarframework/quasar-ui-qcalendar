<template>
  <div>
    <div class="q-gutter-sm q-mb-sm">
      <q-checkbox v-model="noActiveDate" dense label="No active date" />
      <q-checkbox v-model="disabledDays" dense label="Disabled weekends" />
    </div>
    <q-calendar-agenda
      v-model="selectedDate"
      view="week"
      :disabled-weekdays="disabledWeekdays"
      :no-active-date="noActiveDate"
      bordered
      locale="en-US"
      style="height: 400px"
      :style="styles"
    >
      <template #day="{ scope: { timestamp } }">
        <template v-for="a in getAgenda(timestamp)" :key="timestamp.date + a.time">
          <div
            :label="a.time"
            class="justify-start q-ma-sm shadow-5 bg-grey-6"
            style="margin-top: 25px"
          >
            <div v-if="a.avatar" class="row justify-center" style="margin-top: 30px; width: 100%">
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
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch, onBeforeMount } from 'vue'

import { QCalendarAgenda, type Timestamp } from '@quasar/quasar-ui-qcalendar'
import '@quasar/quasar-ui-qcalendar/index.css'

interface Props {
  modelValue: string
  styles: Record<string, any>
}

interface AgendaItem {
  time: string
  avatar?: string
  desc?: string
}

const props = defineProps<Props>()

const selectedDate = ref('')
const noActiveDate = ref(false)
const disabledDays = ref(false)

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

const disabledWeekdays = computed(() => {
  return disabledDays.value === true ? [0, 6] : []
})

watch(
  () => props.modelValue,
  (val) => {
    selectedDate.value = val
  },
  { immediate: true },
)

onBeforeMount(() => {
  selectedDate.value = props.modelValue
})

function getAgenda(day: Timestamp): AgendaItem[] | undefined {
  return agenda[Number(day.weekday)]
}
</script>
