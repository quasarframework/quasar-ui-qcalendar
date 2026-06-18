<template>
  <div
    class="subcontent server-data-recipe q-pt-sm"
    :class="{ 'server-data-recipe--dark': $q.dark.isActive }"
  >
    <div class="server-data-recipe__panel">
      <div>
        <div class="text-h6">Load task rows on demand</div>
        <p>
          Click the button to simulate fetching task rows, day values, and footer totals from a
          server before the task calendar renders data.
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
      <div style="display: flex; max-width: 100%; width: 100%">
        <q-calendar-task
          v-model="selectedDate"
          v-model:model-tasks="tasks"
          v-model:model-footer="footerRows"
          view="week"
          bordered
          animated
          no-active-date
          :task-width="280"
          :cell-width="110"
        >
          <template #task="{ scope }">
            <div class="task-row">
              <strong>{{ scope.task.title }}</strong>
              <span>{{ scope.task.key }}</span>
            </div>
          </template>

          <template #day="{ scope }">
            <div class="task-cell">
              {{ getLoggedHours(scope.timestamp.date, scope.task.logged) }}
            </div>
          </template>

          <template #footer-task="{ scope }">
            <div class="task-footer">{{ scope.footer.label }}</div>
          </template>

          <template #footer-day="{ scope }">
            <div class="task-cell task-cell--total">
              {{ dayTotal(scope.timestamp.date) }}
            </div>
          </template>
        </q-calendar-task>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { QCalendarTask } from '@quasar/quasar-ui-qcalendar'
import { today } from '@timestamp-js/core'
import '@quasar/quasar-ui-qcalendar/index.css'

import { useQuasar } from 'quasar'
import { computed, ref } from 'vue'

interface Logged {
  date: string
  logged: number
}

interface TaskRow {
  title: string
  key: string
  logged: Logged[]
}

interface FooterRow {
  label: string
}

const selectedDate = ref(today())
const $q = useQuasar()
const tasks = ref<TaskRow[]>([])
const footerRows = ref<FooterRow[]>([])
const loading = ref(false)
const loaded = ref(false)
const requestCount = ref(0)

const statusText = computed(() =>
  loaded.value
    ? `Loaded ${tasks.value.length} task rows from request #${requestCount.value}.`
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
  return new Promise((resolve) => window.setTimeout(resolve, 900))
}

async function loadServerData() {
  loading.value = true
  await waitForServer()
  requestCount.value += 1
  tasks.value = [
    {
      title: 'Requirements review',
      key: 'PLN-101',
      logged: [
        { date: addDays(selectedDate.value, -2), logged: 2 },
        { date: addDays(selectedDate.value, 0), logged: 1.5 },
      ],
    },
    {
      title: 'Prototype polish',
      key: 'PLN-202',
      logged: [
        { date: addDays(selectedDate.value, -1), logged: 3 },
        { date: addDays(selectedDate.value, 1), logged: 2.5 },
      ],
    },
    {
      title: 'Release notes',
      key: 'DOC-303',
      logged: [
        { date: addDays(selectedDate.value, 2), logged: 1 },
        { date: addDays(selectedDate.value, 3), logged: 1 },
      ],
    },
  ]
  footerRows.value = [{ label: 'Total hours' }]
  loaded.value = true
  loading.value = false
}

function resetServerData() {
  tasks.value = []
  footerRows.value = []
  loaded.value = false
}

function getLoggedHours(date: string, logged: Logged[] = []) {
  return logged.find((item) => item.date === date)?.logged ?? ''
}

function dayTotal(date: string) {
  const total = tasks.value.reduce((sum, task) => {
    return sum + (task.logged.find((item) => item.date === date)?.logged ?? 0)
  }, 0)
  return total === 0 ? '' : total
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

.task-row {
  display: grid;
  min-width: 0;
  gap: 2px;
  padding: 6px 8px;
}

.task-row span {
  color: #607d8b;
  font-size: 12px;
}

.task-cell {
  display: grid;
  min-height: 100%;
  place-items: center;
}

.task-cell--total,
.task-footer {
  font-weight: 700;
}

.task-footer {
  padding: 6px 8px;
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
