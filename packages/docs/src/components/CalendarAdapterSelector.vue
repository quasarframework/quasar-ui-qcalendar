<template>
  <div class="calendar-adapter-selector" role="group" aria-label="Calendar adapter">
    <q-btn
      v-for="calendar in calendars"
      :key="calendar.id"
      class="calendar-adapter-selector__choice"
      :class="{ 'calendar-adapter-selector__choice--active': calendar.id === modelValue }"
      type="button"
      no-caps
      unelevated
      :outline="calendar.id !== modelValue"
      color="primary"
      :text-color="calendar.id === modelValue ? 'white' : 'primary'"
      :aria-pressed="calendar.id === modelValue"
      @click="selectCalendar(calendar.id)"
    >
      <span class="calendar-adapter-selector__choice-kicker">{{ calendar.shortLabel }}</span>
      <span>{{ calendar.label }}</span>
    </q-btn>
  </div>
</template>

<script setup lang="ts">
import type { CalendarExampleId } from '@/utils/calendarAdapterExamples'

interface CalendarChoice {
  id: CalendarExampleId
  label: string
  shortLabel: string
}

defineProps<{
  modelValue: CalendarExampleId
  calendars: CalendarChoice[]
}>()

const emit = defineEmits<{
  'update:modelValue': [value: CalendarExampleId]
}>()

function selectCalendar(value: CalendarExampleId) {
  emit('update:modelValue', value)
}
</script>

<style lang="scss" scoped>
.calendar-adapter-selector {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  justify-content: center;
  width: min(100%, 560px);
  min-width: 0;
}

.calendar-adapter-selector__choice {
  flex: 1 1 136px;
  min-width: 0;
  min-height: 68px;
  max-width: 180px;
  padding: 10px 12px;
  border-radius: 6px;
  text-align: start;
  transition:
    background-color 0.16s ease,
    color 0.16s ease,
    box-shadow 0.16s ease;
}

.calendar-adapter-selector__choice :deep(.q-btn__content) {
  display: grid;
  justify-items: start;
  width: 100%;
  text-align: start;
}

.calendar-adapter-selector__choice:hover,
.calendar-adapter-selector__choice:focus-visible {
  box-shadow: 0 0 0 2px color-mix(in srgb, var(--q-primary) 22%, transparent);
}

.calendar-adapter-selector__choice-kicker {
  display: block;
  font-size: 0.95rem;
}

.calendar-adapter-selector__choice span {
  pointer-events: none;
}

.calendar-adapter-selector__choice span:last-child {
  display: block;
  font-size: 0.78rem;
  line-height: 1.25;
}
</style>
