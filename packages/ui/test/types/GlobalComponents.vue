<script setup lang="ts">
import { ref, useTemplateRef } from 'vue'
import type { QCalendar as QCalendarRef } from '@quasar/quasar-ui-qcalendar'

const date = ref('2026-09-29')
const calendarRef = useTemplateRef<QCalendarRef>('calendar')
</script>

<template>
  <q-calendar ref="calendar" v-model="date" :hour24-format="true" />
  <q-calendar-day v-model="date" :hour24-format="true">
    <template #column-header-after="{ scope: { timestamp } }">
      {{ timestamp.date.toUpperCase() }}
    </template>
  </q-calendar-day>
  <button @click="calendarRef?.prev()">Previous</button>
  <!-- @vue-expect-error Global components must reject invalid boolean props too. -->
  <q-calendar-day :hour24-format="'yes'" />
</template>
