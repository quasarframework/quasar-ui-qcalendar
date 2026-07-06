<template>
  <div class="subcontent calendar-adapter-wrapper">
    <p class="text-body2 text-center q-mb-md">
      The QCalendar wrapper forwards the calendar adapter to the selected view so date scopes stay
      native while Gregorian interop remains available when your app needs it.
    </p>

    <div class="calendar-adapter-wrapper__toolbar">
      <div class="calendar-adapter-wrapper__selector" role="group" aria-label="Calendar adapter">
        <q-btn
          v-for="calendarOption in calendarExamples"
          :key="calendarOption.id"
          class="calendar-adapter-wrapper__choice"
          :class="{
            'calendar-adapter-wrapper__choice--active': calendarOption.id === calendarId,
          }"
          type="button"
          no-caps
          unelevated
          :outline="calendarOption.id !== calendarId"
          color="primary"
          :text-color="calendarOption.id === calendarId ? 'white' : 'primary'"
          :aria-pressed="calendarOption.id === calendarId"
          @click="calendarId = calendarOption.id"
        >
          <span>{{ calendarOption.shortLabel }}</span>
          <small>{{ calendarOption.label }}</small>
        </q-btn>
      </div>

      <navigation-bar @today="onToday" @prev="onPrev" @next="onNext" />
    </div>

    <calendar-adapter-title
      :calendar-label="activeCalendar.label"
      :month-title="nativeMonthTitle"
      :range-label="nativeMonthRange"
      :direction="activeCalendar.direction"
    />

    <div class="row justify-center full-width">
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
              <small>Gregorian {{ timestamp.month }}/{{ timestamp.day }}</small>
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
import { computed, ref, watch } from 'vue'
import { QCalendar } from '@quasar/quasar-ui-qcalendar'
import '@quasar/quasar-ui-qcalendar/index.css'

import CalendarAdapterTitle from '@/components/CalendarAdapterTitle.vue'
import NavigationBar from '@/components/NavigationBar.vue'
import {
  calendarExampleDates,
  calendarExamples,
  getCalendarExample,
  getEquivalentNativeDate,
  getNativeBoundaryLabel,
  getNativeMonthRangeLabel,
  getNativeMonthTitleLabel,
  parseNativeDate,
  type CalendarExampleId,
} from '@/utils/calendarAdapterExamples'

const calendar = ref<QCalendar>()
const calendarId = ref<CalendarExampleId>('islamic-civil')
const selectedDates = ref<Record<CalendarExampleId, string>>({ ...calendarExampleDates })
const selectedDate = computed({
  get: () => selectedDates.value[calendarId.value],
  set: (value: string) => {
    selectedDates.value[calendarId.value] = value
  },
})

const activeCalendar = computed(() => getCalendarExample(calendarId.value))
const selectedTimestamp = computed(() => parseNativeDate(selectedDate.value, activeCalendar.value))
const nativeMonthRange = computed(() =>
  getNativeMonthRangeLabel(selectedTimestamp.value, activeCalendar.value),
)
const nativeMonthTitle = computed(() =>
  getNativeMonthTitleLabel(selectedTimestamp.value, activeCalendar.value),
)

watch(calendarId, (nextId, previousId) => {
  selectedDates.value[nextId] = getEquivalentNativeDate(
    selectedDates.value[previousId],
    getCalendarExample(previousId),
    getCalendarExample(nextId),
  )
})

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
  grid-template-columns: minmax(0, 1fr);
  gap: 16px;
  width: 100%;
  min-width: 0;
  max-width: 100%;
  overflow: hidden;
}

.calendar-adapter-wrapper > * {
  min-width: 0;
  max-width: 100%;
}

.calendar-adapter-wrapper__toolbar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  width: 100%;
}

.calendar-adapter-wrapper__selector {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.calendar-adapter-wrapper__choice {
  min-width: 150px;
  min-height: 68px;
  padding: 8px 12px;
  border-radius: 6px;
  text-align: left;
}

.calendar-adapter-wrapper__choice :deep(.q-btn__content) {
  display: grid;
  justify-items: start;
  width: 100%;
  text-align: start;
}

.calendar-adapter-wrapper__choice span,
.calendar-adapter-wrapper__choice small {
  display: block;
  pointer-events: none;
}

.calendar-adapter-wrapper__calendar {
  display: flex;
  width: 100%;
  max-width: 900px;
  min-width: 0;
}

.calendar-adapter-wrapper__cell {
  display: grid;
  gap: 4px;
  padding: 4px;
  font-size: 0.72rem;
}

.calendar-adapter-wrapper__cell small {
  color: color-mix(in srgb, currentColor 58%, transparent);
}

.calendar-adapter-wrapper__cell--outside {
  opacity: 0.55;
}

.calendar-adapter-wrapper__badge {
  width: fit-content;
  max-width: 100%;
  min-width: 0;
  padding: 1px 6px;
  border: 1px solid color-mix(in srgb, var(--q-primary), transparent 35%);
  border-radius: 999px;
  color: var(--q-primary);
  font-size: 0.65rem;
  line-height: 1.15;
  overflow-wrap: anywhere;
}
</style>
