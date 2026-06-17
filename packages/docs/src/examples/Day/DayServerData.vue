<template>
  <div class="subcontent server-data-recipe">
    <div class="server-data-recipe__panel">
      <div>
        <div class="text-h6">Load day events on demand</div>
        <p>
          Start with an empty schedule, then click the button to simulate an API request for the
          visible day.
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
      <div style="display: flex; max-width: 800px; width: 100%; height: 420px">
        <q-calendar-day
          v-model="selectedDate"
          view="day"
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
              <span>{{ event.time }} for {{ event.duration }} minutes</span>
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
      title: 'Planning sync',
      date: selectedDate.value,
      time: '09:00',
      duration: 60,
      color: '#1976d2',
    },
    {
      id: 2,
      title: 'Design review',
      date: selectedDate.value,
      time: '11:30',
      duration: 90,
      color: '#00897b',
    },
    {
      id: 3,
      title: 'Release checklist',
      date: selectedDate.value,
      time: '14:00',
      duration: 75,
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
  left: 6px;
  right: 6px;
  display: grid;
  align-content: start;
  gap: 2px;
  padding: 6px 8px;
  overflow: hidden;
  overflow-wrap: anywhere;
  border-radius: 6px;
  color: white;
  font-size: 12px;
  box-shadow: 0 2px 8px rgb(15 23 42 / 18%);
}

.server-event span {
  opacity: 0.9;
}
</style>
