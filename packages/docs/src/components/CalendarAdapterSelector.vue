<template>
  <div class="calendar-adapter-selector" role="group" aria-label="Calendar adapter">
    <button
      v-for="calendar in calendars"
      :key="calendar.id"
      class="calendar-adapter-selector__choice"
      :class="{ 'calendar-adapter-selector__choice--active': calendar.id === modelValue }"
      type="button"
      :aria-pressed="calendar.id === modelValue"
      @click="$emit('update:modelValue', calendar.id)"
    >
      <span class="calendar-adapter-selector__choice-kicker">{{ calendar.shortLabel }}</span>
      <span>{{ calendar.label }}</span>
    </button>
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

defineEmits<{
  'update:modelValue': [value: CalendarExampleId]
}>()
</script>

<style lang="scss" scoped>
.calendar-adapter-selector {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.calendar-adapter-selector__choice {
  min-width: 150px;
  padding: 10px 12px;
  border: 1px solid var(--q-primary);
  border-radius: 6px;
  background: transparent;
  color: var(--q-primary);
  text-align: start;
  cursor: pointer;
  transition:
    background-color 0.16s ease,
    color 0.16s ease,
    box-shadow 0.16s ease;
}

.calendar-adapter-selector__choice:hover,
.calendar-adapter-selector__choice:focus-visible {
  box-shadow: 0 0 0 2px color-mix(in srgb, var(--q-primary) 22%, transparent);
}

.calendar-adapter-selector__choice--active {
  background: var(--q-primary);
  color: white;
}

.calendar-adapter-selector__choice-kicker {
  display: block;
  margin-bottom: 4px;
  font-size: 0.95rem;
}

.calendar-adapter-selector__choice span:last-child {
  display: block;
  font-size: 0.78rem;
  line-height: 1.25;
}
</style>
