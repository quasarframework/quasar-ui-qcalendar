<template>
  <div class="subcontent server-data-recipe">
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
      <q-banner v-else rounded :class="loaded ? 'bg-blue-1 text-blue-10' : 'bg-grey-2 text-grey-8'">
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
</style>
