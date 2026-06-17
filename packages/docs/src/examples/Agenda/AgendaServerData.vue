<template>
  <div class="subcontent server-data-recipe">
    <div class="server-data-recipe__panel">
      <div>
        <div class="text-h6">Load agenda items on demand</div>
        <p>
          Click the button to simulate waiting for the server before agenda items are rendered into
          each visible day.
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
      <div style="display: flex; max-width: 900px; width: 100%; height: 420px">
        <q-calendar-agenda
          v-model="selectedDate"
          view="week"
          bordered
          animated
          no-active-date
          :day-min-height="260"
        >
          <template #day="{ scope: { timestamp } }">
            <div class="agenda-column">
              <q-card
                v-for="item in itemsMap[timestamp.date] || []"
                :key="item.id"
                flat
                bordered
                class="agenda-card"
              >
                <q-card-section>
                  <q-badge color="primary" :label="item.time" />
                  <div class="text-subtitle2 q-mt-sm">{{ item.title }}</div>
                  <div class="text-caption text-grey-7">{{ item.owner }}</div>
                </q-card-section>
              </q-card>
              <div v-if="loaded && !itemsMap[timestamp.date]" class="agenda-empty">No items</div>
            </div>
          </template>
        </q-calendar-agenda>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { QCalendarAgenda } from '@quasar/quasar-ui-qcalendar'
import { today } from '@timestamp-js/core'
import '@quasar/quasar-ui-qcalendar/index.css'

import { computed, ref } from 'vue'

interface AgendaItem {
  id: number
  title: string
  owner: string
  date: string
  time: string
}

const selectedDate = ref(today())
const loading = ref(false)
const loaded = ref(false)
const items = ref<AgendaItem[]>([])
const requestCount = ref(0)

const statusText = computed(() =>
  loaded.value
    ? `Loaded ${items.value.length} agenda items from request #${requestCount.value}.`
    : 'No server data has been loaded yet.',
)

const itemsMap = computed<Record<string, AgendaItem[]>>(() => {
  return items.value.reduce<Record<string, AgendaItem[]>>((map, item) => {
    if (!map[item.date]) {
      map[item.date] = []
    }
    map[item.date]!.push(item)
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
  items.value = [
    {
      id: 1,
      title: 'Intake review',
      owner: 'Operations',
      date: addDays(selectedDate.value, -2),
      time: '09:00',
    },
    {
      id: 2,
      title: 'Draft approvals',
      owner: 'Content',
      date: addDays(selectedDate.value, 0),
      time: '11:00',
    },
    {
      id: 3,
      title: 'Training block',
      owner: 'Enablement',
      date: addDays(selectedDate.value, 2),
      time: '14:00',
    },
  ]
  loaded.value = true
  loading.value = false
}

function resetServerData() {
  items.value = []
  loaded.value = false
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

.agenda-column {
  display: grid;
  gap: 8px;
  min-width: 0;
  padding: 8px;
  overflow: hidden;
}

.agenda-card {
  box-sizing: border-box;
  width: 100%;
  min-width: 0;
  max-width: 100%;
  background: #f8fbff;
}

.agenda-card :deep(.q-card__section) {
  min-width: 0;
  padding: 8px;
}

.agenda-card .text-subtitle2,
.agenda-card .text-caption {
  overflow-wrap: anywhere;
}

.agenda-empty {
  color: #78909c;
  font-size: 12px;
}
</style>
