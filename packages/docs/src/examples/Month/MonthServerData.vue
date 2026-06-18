<template>
  <div
    class="subcontent server-data-recipe q-pt-sm"
    :class="{ 'server-data-recipe--dark': $q.dark.isActive }"
  >
    <div class="server-data-recipe__panel">
      <div>
        <div class="text-h6">Load month summaries on demand</div>
        <p>
          Click the button to simulate fetching day-level summaries for the currently visible month.
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
      <q-banner
        v-else
        rounded
        class="server-data-recipe__status"
        :class="loaded ? 'server-data-recipe__status--loaded' : 'server-data-recipe__status--idle'"
      >
        {{ statusText }}
      </q-banner>
    </div>

    <div class="row justify-center">
      <div style="display: flex; max-width: 900px; width: 100%">
        <q-calendar-month
          v-model="selectedDate"
          bordered
          animated
          no-active-date
          :day-min-height="88"
          :day-height="0"
        >
          <template #day="{ scope: { timestamp } }">
            <div
              v-for="event in eventsMap[timestamp.date] || []"
              :key="event.id"
              class="server-event"
              :style="{ borderColor: event.color }"
            >
              <span class="server-event__dot" :style="{ backgroundColor: event.color }" />
              <span class="q-calendar__ellipsis">{{ event.title }}</span>
            </div>
          </template>
        </q-calendar-month>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { QCalendarMonth } from '@quasar/quasar-ui-qcalendar'
import { today } from '@timestamp-js/core'
import '@quasar/quasar-ui-qcalendar/index.css'

import { useQuasar } from 'quasar'
import { computed, ref } from 'vue'

interface CalendarEvent {
  id: number
  title: string
  date: string
  color: string
}

const selectedDate = ref(today())
const $q = useQuasar()
const loading = ref(false)
const loaded = ref(false)
const events = ref<CalendarEvent[]>([])
const requestCount = ref(0)

const statusText = computed(() =>
  loaded.value
    ? `Loaded ${events.value.length} day summaries from request #${requestCount.value}.`
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
    { id: 1, title: 'Content freeze', date: addDays(selectedDate.value, -10), color: '#1976d2' },
    { id: 2, title: 'Office hours', date: addDays(selectedDate.value, -3), color: '#00897b' },
    { id: 3, title: 'Partner review', date: addDays(selectedDate.value, 5), color: '#7b1fa2' },
    { id: 4, title: 'Ship readiness', date: addDays(selectedDate.value, 12), color: '#f57c00' },
  ]
  loaded.value = true
  loading.value = false
}

function resetServerData() {
  events.value = []
  loaded.value = false
}
</script>

<style>
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
  color: #102a43;
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

.server-data-recipe__status {
  border: 1px solid transparent;
}

.server-data-recipe__status--loaded {
  background: #e3f2fd;
  color: #0d47a1;
}

.server-data-recipe__status--idle {
  background: #eef2f6;
  color: #546e7a;
}

.server-event {
  box-sizing: border-box;
  display: flex;
  align-items: center;
  gap: 6px;
  min-width: 0;
  max-width: calc(100% - 8px);
  margin: 2px 4px;
  padding: 3px 6px;
  border-left: 3px solid;
  border-radius: 4px;
  background: #eef7ff;
  color: #17324d;
  font-size: 12px;
}

.server-event span:last-child {
  min-width: 0;
}

.server-event__dot {
  width: 7px;
  height: 7px;
  flex: 0 0 7px;
  border-radius: 999px;
}

.server-data-recipe--dark .server-data-recipe__panel {
  border-color: #4f5f6f;
  background: #1f2937;
  color: #f5f8fb;
}

.server-data-recipe--dark .server-data-recipe__panel p {
  color: #c8d6e5;
}

.server-data-recipe--dark .server-data-recipe__status--loaded {
  border-color: #1e4976;
  background: #102a43;
  color: #b7dcff;
}

.server-data-recipe--dark .server-data-recipe__status--idle {
  border-color: #45515e;
  background: #263241;
  color: #d4dee8;
}

.server-data-recipe--dark .server-event {
  background: #263241;
  color: #dce8f5;
}
</style>
