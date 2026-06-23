<template>
  <div
    class="subcontent server-data-recipe q-pt-sm"
    :class="{ 'server-data-recipe--dark': $q.dark.isActive }"
  >
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
      <div class="agenda-calendar-frame">
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

import { useQuasar } from 'quasar'
import { computed, ref } from 'vue'

interface AgendaItem {
  id: number
  title: string
  owner: string
  date: string
  time: string
}

const selectedDate = ref(today())
const $q = useQuasar()
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
  return new Promise((resolve) => setTimeout(resolve, 900))
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

.agenda-calendar-frame {
  display: flex;
  max-width: 900px;
  width: 100%;
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
  border-color: #d6e0ea;
  background: #f8fbff;
  color: #102a43;
}

.agenda-card .q-card__section {
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

.server-data-recipe--dark .agenda-card {
  border-color: #4f5f6f;
  background: #1f2937;
  color: #f5f8fb;
}

.server-data-recipe--dark .agenda-card .text-caption {
  color: #c8d6e5 !important;
}

.server-data-recipe--dark .agenda-empty {
  color: #9fb3c8;
}
</style>
