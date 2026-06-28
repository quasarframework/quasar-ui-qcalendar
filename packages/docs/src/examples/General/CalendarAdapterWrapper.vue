<template>
  <div class="subcontent calendar-adapter-wrapper">
    <p class="text-body2 text-center q-mb-md">
      The QCalendar wrapper forwards the calendar adapter to the selected view while your app keeps
      stable Gregorian model values.
    </p>

    <div class="calendar-adapter-wrapper__toolbar">
      <div class="calendar-adapter-wrapper__selector" role="group" aria-label="Calendar adapter">
        <button
          v-for="calendarOption in calendarExamples"
          :key="calendarOption.id"
          class="calendar-adapter-wrapper__choice"
          :class="{
            'calendar-adapter-wrapper__choice--active': calendarOption.id === calendarId,
          }"
          type="button"
          :aria-pressed="calendarOption.id === calendarId"
          @click="calendarId = calendarOption.id"
        >
          <span>{{ calendarOption.shortLabel }}</span>
          <small>{{ calendarOption.label }}</small>
        </button>
      </div>

      <navigation-bar @today="onToday" @prev="onPrev" @next="onNext" />
    </div>

    <q-banner rounded class="calendar-adapter-wrapper__banner">
      <strong>{{ activeCalendar.label }}</strong>
      <span>Native month: {{ nativeMonthRange }}</span>
    </q-banner>

    <div class="row justify-center">
      <div class="calendar-adapter-wrapper__calendar" :dir="activeCalendar.direction">
        <q-calendar
          ref="calendar"
          v-model="selectedDate"
          mode="month"
          animated
          bordered
          focusable
          hoverable
          no-active-date
          :calendar-system="activeCalendar.calendar"
          :locale="activeCalendar.locale"
          :weekdays="activeCalendar.weekdays"
          :dir="activeCalendar.direction"
          :day-min-height="78"
          :day-height="0"
        >
          <template #day="{ scope: { timestamp, calendarTimestamp, outside } }">
            <div
              class="calendar-adapter-wrapper__cell"
              :class="{ 'calendar-adapter-wrapper__cell--outside': outside }"
            >
              <span>
                {{ getNativeMonthShort(calendarTimestamp, activeCalendar) }}
                · Gregorian {{ timestamp.month }}/{{ timestamp.day }}
              </span>
              <span v-if="outside" class="calendar-adapter-wrapper__badge">
                Outside {{ activeCalendar.shortLabel }} month
              </span>
              <span
                v-if="getNativeBoundaryLabel(calendarTimestamp, activeCalendar)"
                class="calendar-adapter-wrapper__badge"
              >
                {{ getNativeBoundaryLabel(calendarTimestamp, activeCalendar) }}
              </span>
            </div>
          </template>
        </q-calendar>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { QCalendar } from '@quasar/quasar-ui-qcalendar'
import '@quasar/quasar-ui-qcalendar/index.css'

import NavigationBar from '@/components/NavigationBar.vue'
import {
  calendarExamples,
  getNativeBoundaryLabel,
  getNativeMonthRangeLabel,
  getNativeMonthShort,
  parseGregorianDate,
  type CalendarExampleId,
} from '@/utils/calendarAdapterExamples'

const calendar = ref<QCalendar>()
const calendarId = ref<CalendarExampleId>('islamic-civil')
const selectedDate = ref('2024-03-25')

const activeCalendar = computed(
  () => calendarExamples.find((entry) => entry.id === calendarId.value) ?? calendarExamples[0]!,
)
const selectedTimestamp = computed(() => parseGregorianDate(selectedDate.value))
const nativeMonthRange = computed(() =>
  getNativeMonthRangeLabel(selectedTimestamp.value, activeCalendar.value),
)

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

<style lang="scss" scoped>
.calendar-adapter-wrapper {
  display: grid;
  gap: 16px;
}

.calendar-adapter-wrapper__toolbar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.calendar-adapter-wrapper__selector {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.calendar-adapter-wrapper__choice {
  min-width: 150px;
  padding: 8px 12px;
  border: 1px solid var(--q-primary);
  border-radius: 6px;
  color: var(--q-primary);
  background: transparent;
  text-align: left;
  cursor: pointer;
}

.calendar-adapter-wrapper__choice span,
.calendar-adapter-wrapper__choice small {
  display: block;
}

.calendar-adapter-wrapper__choice--active {
  color: white;
  background: var(--q-primary);
}

.calendar-adapter-wrapper__banner {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.calendar-adapter-wrapper__calendar {
  display: flex;
  width: 100%;
  max-width: 900px;
}

.calendar-adapter-wrapper__cell {
  display: grid;
  gap: 4px;
  padding: 4px;
  font-size: 0.72rem;
}

.calendar-adapter-wrapper__cell--outside {
  opacity: 0.55;
}

.calendar-adapter-wrapper__badge {
  width: max-content;
  max-width: 100%;
  padding: 1px 6px;
  border: 1px solid color-mix(in srgb, var(--q-primary), transparent 35%);
  border-radius: 999px;
  color: var(--q-primary);
  font-size: 0.65rem;
}
</style>
