<template>
  <div class="subcontent server-data-recipe">
    <div class="server-data-recipe__panel">
      <div>
        <div class="text-h6">Load week events on demand</div>
        <p>
          The calendar starts empty. Click the button to mimic a server request for the current week
          and render the returned timed events.
        </p>
      </div>
      <div class="server-data-recipe__actions">
        <q-btn
          color="primary"
          :loading="loading"
          :disable="loading"
          label="Load visible range"
          @click="loadServerData"
        />
        <q-btn flat color="primary" label="Reset" :disable="loading" @click="resetServerData" />
      </div>
      <q-linear-progress v-if="loading" indeterminate color="primary" />
      <q-banner v-else rounded :class="loaded ? 'bg-blue-1 text-blue-10' : 'bg-grey-2 text-grey-8'">
        {{ statusText }}
      </q-banner>
    </div>

    <div class="row justify-center">
      <div style="display: flex; max-width: 900px; width: 100%; height: 430px">
        <q-calendar-day
          v-model="selectedDate"
          view="week"
          bordered
          animated
          no-active-date
          :interval-start="8"
          :interval-count="10"
          :interval-height="38"
        >
          <template #day-body="{ scope: { timestamp, timeStartPos, timeDurationHeight } }">
            <div
              v-for="event in eventsMap[timestamp.date] || []"
              :key="event.id"
              class="server-event"
              :style="eventStyle(event, timeStartPos, timeDurationHeight)"
            >
              <strong>{{ event.title }}</strong>
              <span>{{ event.time }}</span>
            </div>
          </template>
        </q-calendar-day>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { QCalendarDay } from '@quasar/quasar-ui-qcalendar'
import { today } from '@timestamp-js/core'
import '@quasar/quasar-ui-qcalendar/index.css'

import { computed, ref } from 'vue'

interface CalendarEvent {
  id: number
  title: string
  date: string
  time: string
  duration: number
  color: string
}

const selectedDate = ref(today())
const loading = ref(false)
const loaded = ref(false)
const events = ref<CalendarEvent[]>([])
const requestCount = ref(0)

const statusText = computed(() =>
  loaded.value
    ? `Loaded ${events.value.length} events from request #${requestCount.value}.`
    : 'No server data has been loaded yet.',
)

const eventsMap = computed<Record<string, CalendarEvent[]>>(() => {
  return events.value.reduce<Record<string, CalendarEvent[]>>((map, event) => {
    if (!map[event.date]) {
      map[event.date] = []
    }
    map[event.date]!.push(event)
    return map
  }, {})
})

function addDays(date: string, amount: number) {
  const next = new Date(`${date}T00:00:00`)
  next.setDate(next.getDate() + amount)
  return [
    next.getFullYear(),
    String(next.getMonth() + 1).padStart(2, '0'),
    String(next.getDate()).padStart(2, '0'),
  ].join('-')
}

function waitForServer() {
  return new Promise((resolve) => window.setTimeout(resolve, 900))
}

async function loadServerData() {
  loading.value = true
  await waitForServer()
  requestCount.value += 1
  events.value = [
    {
      id: 1,
      title: 'Team standup',
      date: addDays(selectedDate.value, -2),
      time: '09:00',
      duration: 45,
      color: '#1976d2',
    },
    {
      id: 2,
      title: 'Customer follow-up',
      date: addDays(selectedDate.value, -1),
      time: '10:30',
      duration: 60,
      color: '#00897b',
    },
    {
      id: 3,
      title: 'Backlog review',
      date: addDays(selectedDate.value, 1),
      time: '13:00',
      duration: 90,
      color: '#7b1fa2',
    },
    {
      id: 4,
      title: 'Deployment window',
      date: addDays(selectedDate.value, 2),
      time: '15:00',
      duration: 60,
      color: '#f57c00',
    },
  ]
  loaded.value = true
  loading.value = false
}

function resetServerData() {
  events.value = []
  loaded.value = false
}

function eventStyle(
  event: CalendarEvent,
  timeStartPos: (_time: string) => number,
  timeDurationHeight: (_duration: number) => number,
) {
  return {
    top: `${timeStartPos(event.time)}px`,
    height: `${timeDurationHeight(event.duration)}px`,
    backgroundColor: event.color,
  }
}
</script>

<style scoped>
.server-data-recipe {
  display: grid;
  gap: 16px;
}

.server-data-recipe__panel {
  display: grid;
  gap: 12px;
  padding: 16px;
  border: 1px solid #d6e0ea;
  border-radius: 8px;
  background: #fbfdff;
}

.server-data-recipe__panel p {
  margin: 4px 0 0;
  color: #4f6780;
}

.server-data-recipe__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.server-event {
  position: absolute;
  box-sizing: border-box;
  min-width: 0;
  max-width: calc(100% - 8px);
  left: 4px;
  right: 4px;
  display: grid;
  align-content: start;
  gap: 2px;
  padding: 5px 7px;
  overflow: hidden;
  overflow-wrap: anywhere;
  border-radius: 6px;
  color: white;
  font-size: 11px;
  box-shadow: 0 2px 8px rgb(15 23 42 / 18%);
}

.server-event span {
  opacity: 0.9;
}
</style>
