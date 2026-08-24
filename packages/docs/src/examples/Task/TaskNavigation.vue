<template>
  <div class="subcontent">
    <p class="text-body2 text-center q-mb-md">
      Focus a weekday header, then use the arrow keys, Home, End, Page Up, or Page Down to move
      through the calendar without scrolling the page.
    </p>

    <navigation-bar @today="onToday" @prev="onPrev" @next="onNext" />

    <div class="row justify-center">
      <div style="display: flex; max-width: 800px; width: 100%">
        <q-calendar-task
          ref="calendar"
          v-model="selectedDate"
          v-model:model-tasks="tasks"
          view="week"
          task-key="key"
          :focus-type="['weekday']"
          focusable
          hoverable
          use-navigation
          bordered
        >
          <template #head-tasks>
            <div class="q-pa-sm text-weight-bold">Tasks</div>
          </template>

          <template #task="{ scope }">
            <div class="q-pa-sm">{{ scope.task.title }}</div>
          </template>
        </q-calendar-task>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { today } from '@timestamp-js/core'
import { QCalendarTask } from '@quasar/quasar-ui-qcalendar'
import '@quasar/quasar-ui-qcalendar/index.css'

import NavigationBar from '@/components/NavigationBar.vue'

const calendar = ref<QCalendarTask>()
const selectedDate = ref(today())
const tasks = ref([
  { key: 'plan', title: 'Plan the release' },
  { key: 'verify', title: 'Verify the build' },
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
