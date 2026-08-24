<template>
  <div class="subcontent">
    <p class="text-body2 text-center q-mb-md">
      Focus a weekday header, then use the arrow keys, Home, End, Page Up, or Page Down to move
      through the calendar without scrolling the page.
    </p>

    <navigation-bar @today="onToday" @prev="onPrev" @next="onNext" />

    <div class="row justify-center">
      <div style="display: flex; max-width: 800px; width: 100%; max-height: 400px">
        <q-calendar-scheduler
          ref="calendar"
          v-model="selectedDate"
          v-model:model-resources="resources"
          resource-key="id"
          resource-label="name"
          view="week"
          :focus-type="['weekday']"
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
import { ref } from 'vue'
import { today } from '@timestamp-js/core'
import { QCalendarScheduler } from '@quasar/quasar-ui-qcalendar'
import '@quasar/quasar-ui-qcalendar/index.css'

import NavigationBar from '@/components/NavigationBar.vue'

const calendar = ref<QCalendarScheduler>()
const selectedDate = ref(today())
const resources = ref([
  { id: 'developer', name: 'Developer' },
  { id: 'designer', name: 'Designer' },
  { id: 'reviewer', name: 'Reviewer' },
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
