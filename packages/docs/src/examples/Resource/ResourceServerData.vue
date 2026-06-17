<template>
  <div class="subcontent server-data-recipe">
    <div class="server-data-recipe__panel">
      <div>
        <div class="text-h6">Load resources and bookings on demand</div>
        <p>
          Click the button to mimic fetching both resource rows and interval bookings from a server.
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
      <div style="display: flex; max-width: 900px; width: 100%">
        <q-calendar-resource
          v-model="selectedDate"
          v-model:model-resources="resources"
          resource-key="id"
          resource-label="name"
          bordered
          animated
          no-active-date
          :interval-start="8"
          :interval-count="10"
        >
          <template #resource-intervals="{ scope }">
            <q-badge
              v-for="booking in getBookings(scope)"
              :key="booking.id"
              color="primary"
              :label="booking.title"
              :style="bookingStyle(booking)"
            />
          </template>
        </q-calendar-resource>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { QCalendarResource } from '@quasar/quasar-ui-qcalendar'
import { today } from '@timestamp-js/core'
import '@quasar/quasar-ui-qcalendar/index.css'

import { computed, ref } from 'vue'

interface ResourceRow {
  id: string
  name: string
}

interface Booking {
  id: number
  resourceId: string
  title: string
  start: string
  duration: number
  left: number
  width: number
}

interface ResourceScope {
  resource: ResourceRow
  timeStartPosX: (_time: string) => number
  timeDurationWidth: (_duration: number) => number
}

const selectedDate = ref(today())
const resources = ref<ResourceRow[]>([])
const bookings = ref<Booking[]>([])
const loading = ref(false)
const loaded = ref(false)
const requestCount = ref(0)

const statusText = computed(() =>
  loaded.value
    ? `Loaded ${resources.value.length} resources and ${bookings.value.length} bookings from request #${requestCount.value}.`
    : 'No server data has been loaded yet.',
)

function waitForServer() {
  return new Promise((resolve) => window.setTimeout(resolve, 900))
}

async function loadServerData() {
  loading.value = true
  await waitForServer()
  requestCount.value += 1
  resources.value = [
    { id: 'room-a', name: 'Room A' },
    { id: 'room-b', name: 'Room B' },
    { id: 'lab', name: 'Workshop Lab' },
    { id: 'desk', name: 'Shared Desk' },
  ]
  bookings.value = [
    createBooking(1, 'room-a', 'Planning', '09:00', 120),
    createBooking(2, 'room-b', 'Interview block', '10:30', 90),
    createBooking(3, 'lab', 'Prototype review', '13:00', 180),
    createBooking(4, 'desk', 'Office hours', '15:00', 60),
  ]
  loaded.value = true
  loading.value = false
}

function createBooking(
  id: number,
  resourceId: string,
  title: string,
  start: string,
  duration: number,
): Booking {
  return { id, resourceId, title, start, duration, left: 0, width: 0 }
}

function resetServerData() {
  resources.value = []
  bookings.value = []
  loaded.value = false
}

function getBookings(scope: ResourceScope) {
  return bookings.value
    .filter((booking) => booking.resourceId === scope.resource.id)
    .map((booking) => ({
      ...booking,
      left: scope.timeStartPosX(booking.start),
      width: scope.timeDurationWidth(booking.duration),
    }))
}

function bookingStyle(booking: Booking) {
  return {
    position: 'absolute',
    boxSizing: 'border-box',
    overflow: 'hidden',
    left: `${booking.left}px`,
    width: `${booking.width}px`,
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
</style>
