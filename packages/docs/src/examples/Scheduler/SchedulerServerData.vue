<template>
  <div
    class="subcontent server-data-recipe q-pt-sm"
    :class="{ 'server-data-recipe--dark': $q.dark.isActive }"
  >
    <div class="server-data-recipe__panel">
      <div>
        <div class="text-h6">Load schedule rows on demand</div>
        <p>
          Click the button to simulate fetching resources and day assignments for the scheduler
          grid.
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
        <q-calendar-scheduler
          v-model="selectedDate"
          v-model:model-resources="resources"
          view="week"
          resource-key="id"
          resource-label="name"
          bordered
          animated
          no-active-date
        >
          <template #resource-days="{ scope }">
            <q-badge
              v-for="assignment in getAssignments(scope)"
              :key="assignment.id"
              color="primary"
              :label="assignment.title"
              class="server-assignment"
              :style="assignmentStyle(assignment, scope.cellWidth)"
            />
          </template>
        </q-calendar-scheduler>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { QCalendarScheduler } from '@quasar/quasar-ui-qcalendar'
import { today } from '@timestamp-js/core'
import '@quasar/quasar-ui-qcalendar/index.css'

import { useQuasar } from 'quasar'
import { computed, ref } from 'vue'

interface ResourceRow {
  id: string
  name: string
}

interface Assignment {
  id: number
  resourceId: string
  title: string
  dow: number
  range?: number
}

interface SchedulerScope {
  resource: ResourceRow
  cellWidth: string
}

const selectedDate = ref(today())
const $q = useQuasar()
const resources = ref<ResourceRow[]>([])
const assignments = ref<Assignment[]>([])
const loading = ref(false)
const loaded = ref(false)
const requestCount = ref(0)

const statusText = computed(() =>
  loaded.value
    ? `Loaded ${resources.value.length} resources and ${assignments.value.length} assignments from request #${requestCount.value}.`
    : 'No server data has been loaded yet.',
)

function waitForServer() {
  return new Promise((resolve) => setTimeout(resolve, 900))
}

async function loadServerData() {
  loading.value = true
  await waitForServer()
  requestCount.value += 1
  resources.value = [
    { id: 'alpha', name: 'Team Alpha' },
    { id: 'bravo', name: 'Team Bravo' },
    { id: 'charlie', name: 'Team Charlie' },
    { id: 'delta', name: 'Team Delta' },
  ]
  assignments.value = [
    { id: 1, resourceId: 'alpha', title: 'Discovery', dow: 1, range: 2 },
    { id: 2, resourceId: 'bravo', title: 'Implementation', dow: 2, range: 3 },
    { id: 3, resourceId: 'charlie', title: 'QA period', dow: 4, range: 2 },
    { id: 4, resourceId: 'delta', title: 'Support rotation', dow: 5 },
  ]
  loaded.value = true
  loading.value = false
}

function resetServerData() {
  resources.value = []
  assignments.value = []
  loaded.value = false
}

function getAssignments(scope: SchedulerScope) {
  return assignments.value.filter((assignment) => assignment.resourceId === scope.resource.id)
}

function getCellWidth(cellWidth: string, amount: number) {
  const value = Number.parseFloat(cellWidth)
  const unit = cellWidth.endsWith('%') ? '%' : 'px'
  return Number.isFinite(value) ? `${value * amount}${unit}` : undefined
}

function assignmentStyle(assignment: Assignment, cellWidth: string) {
  const range = assignment.range ?? 1

  return {
    position: 'absolute',
    left: getCellWidth(cellWidth, assignment.dow),
    width: getCellWidth(cellWidth, range),
  }
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

.server-assignment {
  box-sizing: border-box;
  min-width: 0;
  margin: 4px;
  overflow: hidden;
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
