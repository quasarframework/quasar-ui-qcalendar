<template>
  <div
    class="subcontent server-data-recipe q-pt-sm"
    :class="{ 'server-data-recipe--dark': $q.dark.isActive }"
  >
    <div class="server-data-recipe__panel">
      <div>
        <div class="text-h6">Load compact availability on demand</div>
        <p>
          The mini calendar starts without any selected days. Click the button to simulate fetching
          available dates for the visible range.
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

    <div class="server-data-recipe__mini-layout">
      <div style="display: flex; max-width: 300px; width: 100%">
        <q-calendar-month
          v-model="selectedDate"
          mini-mode
          bordered
          animated
          no-active-date
          :selected-dates="selectedDates"
        />
      </div>

      <q-card flat bordered class="server-data-recipe__list">
        <q-card-section>
          <div class="text-subtitle2">Loaded dates</div>
          <div v-if="selectedDates.length === 0" class="text-grey-7">
            No availability loaded yet.
          </div>
          <q-chip
            v-for="date in selectedDates"
            :key="date"
            square
            color="primary"
            text-color="white"
          >
            {{ date }}
          </q-chip>
        </q-card-section>
      </q-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { QCalendarMonth } from '@quasar/quasar-ui-qcalendar'
import { today } from '@timestamp-js/core'
import '@quasar/quasar-ui-qcalendar/index.css'

import { useQuasar } from 'quasar'
import { computed, ref } from 'vue'

const selectedDate = ref(today())
const $q = useQuasar()
const selectedDates = ref<string[]>([])
const loading = ref(false)
const loaded = ref(false)
const requestCount = ref(0)

const statusText = computed(() =>
  loaded.value
    ? `Loaded ${selectedDates.value.length} available dates from request #${requestCount.value}.`
    : 'No server data has been loaded yet.',
)

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
  selectedDates.value = [
    addDays(selectedDate.value, 1),
    addDays(selectedDate.value, 4),
    addDays(selectedDate.value, 8),
    addDays(selectedDate.value, 13),
  ]
  loaded.value = true
  loading.value = false
}

function resetServerData() {
  selectedDates.value = []
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

.server-data-recipe__actions,
.server-data-recipe__mini-layout {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  align-items: flex-start;
}

.server-data-recipe__list {
  min-width: 240px;
  max-width: 100%;
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
</style>
