<template>
  <div class="subcontent calendar-adapter-mini">
    <p class="text-body2 text-center q-mb-md">
      Mini-mode can use the same native month adapter, making compact pickers line up with the
      selected non-Gregorian month.
    </p>

    <div class="calendar-adapter-mini__toolbar">
      <calendar-adapter-selector v-model="calendarId" :calendars="calendarExamples" />
      <navigation-bar @today="onToday" @prev="onPrev" @next="onNext" />
    </div>

    <div class="row justify-center full-width">
      <div class="calendar-adapter-mini__shell">
        <calendar-adapter-title
          :calendar-label="activeCalendar.label"
          :month-title="nativeMonthTitle"
          :range-label="nativeMonthRange"
          :direction="activeCalendar.direction"
        />

        <q-calendar-month
          ref="calendar"
          v-model="selectedDate"
          mini-mode
          animated
          bordered
          hoverable
          focusable
          no-active-date
          :calendar-system="activeCalendar.calendar"
          :locale="activeCalendar.locale"
          :weekdays="activeCalendar.weekdays"
          :dir="activeCalendar.direction"
          :min-weeks="6"
        >
          <template #day="{ scope: { calendarTimestamp, outside } }">
            <div
              class="calendar-adapter-mini__day"
              :class="{ 'calendar-adapter-mini__day--outside': outside }"
            >
              <small>{{ getNativeMonthShort(calendarTimestamp, activeCalendar) }}</small>
            </div>
          </template>
        </q-calendar-month>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { QCalendarMonth } from '@quasar/quasar-ui-qcalendar'
import '@quasar/quasar-ui-qcalendar/index.css'

import CalendarAdapterSelector from '@/components/CalendarAdapterSelector.vue'
import CalendarAdapterTitle from '@/components/CalendarAdapterTitle.vue'
import NavigationBar from '@/components/NavigationBar.vue'
import {
  calendarExamples,
  getCalendarExample,
  getNativeMonthRangeLabel,
  getNativeMonthShort,
  getNativeMonthTitleLabel,
  parseGregorianDate,
  type CalendarExampleId,
} from '@/utils/calendarAdapterExamples'

const calendar = ref<QCalendarMonth>()
const calendarId = ref<CalendarExampleId>('islamic-civil')
const selectedDate = ref('2024-03-25')

const activeCalendar = computed(() => getCalendarExample(calendarId.value))
const selectedTimestamp = computed(() => parseGregorianDate(selectedDate.value))
const nativeMonthRange = computed(() =>
  getNativeMonthRangeLabel(selectedTimestamp.value, activeCalendar.value),
)
const nativeMonthTitle = computed(() =>
  getNativeMonthTitleLabel(selectedTimestamp.value, activeCalendar.value),
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
.calendar-adapter-mini {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: 16px;
  width: 100%;
  min-width: 0;
  max-width: 100%;
  overflow: hidden;
}

.calendar-adapter-mini > * {
  min-width: 0;
  max-width: 100%;
}

.calendar-adapter-mini__toolbar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  width: 100%;
}

.calendar-adapter-mini__shell {
  display: grid;
  gap: 10px;
  width: min(100%, 380px);
}

.calendar-adapter-mini__day {
  display: inline-grid;
  justify-items: center;
  line-height: 1;
}

.calendar-adapter-mini__day small {
  margin-top: 2px;
  font-size: 0.62rem;
  opacity: 0.72;
}

.calendar-adapter-mini__day--outside {
  opacity: 0.45;
}
</style>
