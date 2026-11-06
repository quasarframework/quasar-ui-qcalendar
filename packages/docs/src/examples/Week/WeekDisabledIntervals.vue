<template>
  <div class="subcontent">
    <p class="text-body2 text-center q-mb-md">
      09:00–11:00 is unavailable on November 2–4, 2026. The 14:00 cell is blocked on November 2.
      Click an available cell to select it.
    </p>
    <navigation-bar
      @today="calendar?.moveToToday()"
      @prev="calendar?.prev()"
      @next="calendar?.next()"
    />
    <div class="row justify-center">
      <div style="display: flex; width: 100%; max-width: 900px; height: 400px">
        <q-calendar-day
          ref="calendar"
          v-model="selectedDate"
          view="week"
          :interval-minutes="30"
          :interval-start="16"
          :interval-count="18"
          :disabled-intervals="disabledIntervals"
          :focus-type="['interval', 'time']"
          focusable
          use-navigation
          bordered
          @click-time="onClickTime"
        />
      </div>
    </div>
    <p class="text-center q-mt-md">Selected time: {{ lastSelection || 'None' }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref, useTemplateRef } from 'vue'
import { QCalendarDay, type DisabledInterval } from '@quasar/quasar-ui-qcalendar'
import type { Timestamp } from '@timestamp-js/core'
import '@quasar/quasar-ui-qcalendar/index.css'
import NavigationBar from '@/components/NavigationBar.vue'

const calendar = useTemplateRef<QCalendarDay>('calendar')
const selectedDate = ref('2026-11-02')
const lastSelection = ref('')

const disabledIntervals: DisabledInterval[] = [
  { from: '2026-11-02', to: '2026-11-04', start: '09:00', end: '11:00' },
  '2026-11-02 14:00',
]

function onClickTime({ scope }: { scope: { timestamp: Timestamp } }) {
  lastSelection.value = `${scope.timestamp.date} ${scope.timestamp.time}`
}
</script>
