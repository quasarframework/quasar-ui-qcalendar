<template>
  <div class="subcontent">
    <p class="text-body2 text-center q-mb-md">
      The selected date has an unavailable range from 09:00 to 11:00 and a blocked 14:00 cell. Click
      an available cell to select it.
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
import { computed, ref, useTemplateRef } from 'vue'
import { QCalendarDay, type DisabledInterval } from '@quasar/quasar-ui-qcalendar'
import type { Timestamp } from '@timestamp-js/core'
import '@quasar/quasar-ui-qcalendar/index.css'
import NavigationBar from '@/components/NavigationBar.vue'

const calendar = useTemplateRef<QCalendarDay>('calendar')
const selectedDate = ref('2026-11-02')
const lastSelection = ref('')

const disabledIntervals = computed<DisabledInterval[]>(() => [
  { date: selectedDate.value, start: '09:00', end: '11:00' },
  `${selectedDate.value} 14:00`,
])

function onClickTime({ scope }: { scope: { timestamp: Timestamp } }) {
  lastSelection.value = `${scope.timestamp.date} ${scope.timestamp.time}`
}
</script>
