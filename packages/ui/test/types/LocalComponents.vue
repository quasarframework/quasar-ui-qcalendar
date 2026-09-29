<script setup lang="ts">
import { ref, useTemplateRef } from 'vue'
import { QCalendar, QCalendarDay } from '@quasar/quasar-ui-qcalendar'
import { QCalendarDay as SubpathDay } from '@quasar/quasar-ui-qcalendar/QCalendarDay'

const date = ref('2026-09-29')
const rootRef = useTemplateRef<InstanceType<typeof QCalendar>>('calendar')
const subpathRef = useTemplateRef<InstanceType<typeof SubpathDay>>('day')
</script>

<template>
  <QCalendar ref="calendar" v-model="date" :hour24-format="true" />
  <QCalendarDay v-model="date" :hour24-format="true">
    <template #column-header-after="{ scope: { timestamp } }">
      {{ timestamp.date.toUpperCase() }}
    </template>
  </QCalendarDay>
  <SubpathDay ref="day" v-model="date" :hour24-format="true">
    <template #day-body="{ scope }">{{ scope.timestamp.date.toUpperCase() }}</template>
  </SubpathDay>
  <button @click="rootRef?.prev()">Previous</button>
  <button @click="subpathRef?.scrollToTime('09:00')">Morning</button>
  <!-- @vue-expect-error Boolean prop validation must work for root imports. -->
  <QCalendarDay :hour24-format="'yes'" />
  <!-- @vue-expect-error Date models must be strings through component subpaths. -->
  <SubpathDay :model-value="123" />
</template>
