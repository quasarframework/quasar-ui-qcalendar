<template>
  <div class="subcontent">
    <p class="text-body2 text-center q-mb-md">
      Focus an interval label or resource time cell. Use Up and Down to move by one interval, and
      Left and Right to move between dates without scrolling the page.
    </p>

    <navigation-bar @today="onToday" @prev="onPrev" @next="onNext" />

    <div class="text-h6 text-center q-mb-sm" aria-live="polite">
      {{ formattedDate }}
    </div>

    <div class="row justify-center">
      <div style="display: flex; max-width: 800px; width: 100%; max-height: 400px">
        <q-calendar-resource
          ref="calendar"
          v-model="selectedDate"
          v-model:model-resources="resources"
          resource-key="id"
          resource-label="name"
          :focus-type="['interval', 'time']"
          :interval-count="10"
          :interval-start="8"
          focusable
          hoverable
          use-navigation
          bordered
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { today } from '@timestamp-js/core'
import { QCalendarResource } from '@quasar/quasar-ui-qcalendar'
import '@quasar/quasar-ui-qcalendar/index.css'

import NavigationBar from '@/components/NavigationBar.vue'

const calendar = ref<QCalendarResource>()
const selectedDate = ref(today())
const formattedDate = computed(() =>
  new Intl.DateTimeFormat(undefined, {
    dateStyle: 'full',
    timeZone: 'UTC',
  }).format(new Date(`${selectedDate.value}T00:00:00Z`)),
)
const resources = ref([
  { id: 'room-1', name: 'Room 1' },
  { id: 'room-2', name: 'Room 2' },
  { id: 'room-3', name: 'Room 3' },
])

function onToday() {
  calendar.value?.moveToToday()
}

function onPrev() {
  calendar.value?.prev()
}

function onNext() {
  calendar.value?.next()
}
</script>
