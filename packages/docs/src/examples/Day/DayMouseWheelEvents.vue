<template>
  <div class="subcontent">
    <p class="text-body2 text-center q-mb-md">
      Choose a wheel mode, then wheel over the event to resize, move, or zoom the visible rows.
    </p>

    <navigation-bar @today="onToday" @prev="onPrev" @next="onNext" />

    <div class="q-mb-md text-caption text-center">
      Choose a wheel mode, then wheel over an event. Set the mode back to <kbd>Off</kbd> when you
      want normal page scrolling.
    </div>

    <div class="wheel-controls q-mb-md">
      <q-btn-toggle
        v-model="wheelAction"
        dense
        unelevated
        no-caps
        toggle-color="primary"
        color="grey-7"
        text-color="white"
        :options="wheelActionOptions"
      />
      <div class="wheel-controls__status text-caption">
        {{ wheelStatus }}
      </div>
    </div>

    <div class="row justify-center">
      <div style="display: flex; max-width: 800px; width: 100%; height: 420px">
        <q-calendar-day
          ref="calendar"
          v-model="selectedDate"
          view="day"
          no-active-date
          animated
          bordered
          :interval-start="intervalStart"
          :interval-minutes="intervalMinutes"
          :interval-count="intervalCount"
          :interval-height="intervalHeight"
          @wheel="onPanelWheel"
          @change="onChange"
          @moved="onMoved"
          @click-date="onClickDate"
          @click-time="onClickTime"
          @click-interval="onClickInterval"
          @click-head-intervals="onClickHeadIntervals"
          @click-head-day="onClickHeadDay"
        >
          <template #day-body="{ scope: { timestamp, timeStartPos, timeDurationHeight } }">
            <template v-for="event in getEvents(timestamp.date)" :key="event.id">
              <div
                class="wheel-event"
                :style="eventStyles(event, timeStartPos, timeDurationHeight)"
                @wheel="onEventWheel($event, event)"
              >
                <div class="wheel-event__title q-calendar__ellipsis">
                  {{ event.title }}
                </div>
                <div class="wheel-event__meta">{{ event.time }} - {{ event.duration }} mins</div>
                <q-tooltip>{{ event.tooltip || eventSummary(event) }}</q-tooltip>
              </div>
            </template>
          </template>
        </q-calendar-day>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { QCalendarDay } from '@quasar/quasar-ui-qcalendar'
import { parseTime, today, Timestamp } from '@timestamp-js/core'
import '@quasar/quasar-ui-qcalendar/index.css'

import { computed, ref } from 'vue'
import NavigationBar from '@/components/NavigationBar.vue'

interface Event {
  id: number
  title: string
  date: string
  time: string
  duration: number
  bgcolor: string
  tooltip?: string
}

type TimeStartPos = (_time: string) => number | false
type TimeDurationHeight = (_minutes: number) => number
type WheelAction = 'off' | 'resize' | 'resize-step' | 'move' | 'zoom'

const intervalRangeStart = '08:00'
const intervalRangeEnd = '18:00'
const intervalMinutes = 15
const intervalStartMinutes = toMinutes(intervalRangeStart)
const intervalEndMinutes = toMinutes(intervalRangeEnd)
const intervalStart = intervalStartMinutes / intervalMinutes
const intervalCount = (intervalEndMinutes - intervalStartMinutes) / intervalMinutes
const minDuration = 15
const maxDuration = 300

const calendar = ref<QCalendarDay>()
const selectedDate = ref(today())
const wheelAction = ref<WheelAction>('off')
const intervalHeight = ref(28)
const resizeTimeout = ref<ReturnType<typeof setTimeout>>()

const events = ref<Event[]>([
  {
    id: 1,
    title: 'Planning',
    date: today(),
    time: '09:00',
    duration: 60,
    bgcolor: '#1976d2',
  },
  {
    id: 2,
    title: 'Design Review',
    date: today(),
    time: '11:30',
    duration: 90,
    bgcolor: '#00897b',
  },
  {
    id: 3,
    title: 'Implementation',
    date: today(),
    time: '14:00',
    duration: 120,
    bgcolor: '#c10015',
  },
])

const wheelActionOptions: { label: string; value: WheelAction }[] = [
  { label: 'Off', value: 'off' },
  { label: 'Resize 1 min', value: 'resize' },
  { label: 'Resize 5 min', value: 'resize-step' },
  { label: 'Move 15 min', value: 'move' },
  { label: 'Zoom rows', value: 'zoom' },
]

const wheelStatus = computed(() => {
  const event = events.value[0]

  return event === undefined
    ? `Interval height: ${intervalHeight.value}px`
    : `${wheelActionLabel.value}: ${event.title} ${event.time} for ${event.duration} mins · interval height ${intervalHeight.value}px`
})

const wheelActionLabel = computed(
  () => wheelActionOptions.find((option) => option.value === wheelAction.value)?.label ?? 'Off',
)

function getEvents(date: string): Event[] {
  return events.value.filter((event) => event.date === date)
}

function eventStyles(
  event: Event,
  timeStartPos: TimeStartPos,
  timeDurationHeight: TimeDurationHeight,
): Record<string, string> {
  const top = timeStartPos(event.time)

  return {
    top: `${top === false ? 0 : top}px`,
    height: `${timeDurationHeight(event.duration)}px`,
    backgroundColor: event.bgcolor,
  }
}

function onEventWheel(evt: WheelEvent, event: Event): void {
  const action = getWheelAction(evt)

  if (action === false) {
    return
  }

  evt.preventDefault()
  evt.stopPropagation()

  const minutes = getWheelMinutes(evt)

  if (minutes === 0) {
    return
  }

  if (action === 'zoom') {
    adjustIntervalHeight(minutes)
    showActiveTooltip(event, `Interval height: ${intervalHeight.value}px`)
    return
  }

  if (action === 'move') {
    moveEvent(event, minutes * 15)
  } else {
    resizeEvent(event, action === 'resize-step' ? minutes * 5 : minutes)
  }

  showActiveTooltip(event)
}

function onPanelWheel(evt: WheelEvent): void {
  if (evt.ctrlKey !== true && evt.altKey !== true) {
    return
  }

  evt.preventDefault()
  evt.stopPropagation()

  if (evt.ctrlKey === true && evt.altKey === true) {
    adjustIntervalHeight(getWheelMinutes(evt))
  }
}

function getWheelAction(evt: WheelEvent): WheelAction | false {
  if (evt.ctrlKey === true && evt.altKey === true) {
    return 'zoom'
  }

  if (evt.altKey === true) {
    return 'move'
  }

  if (evt.shiftKey === true) {
    return 'resize-step'
  }

  if (evt.ctrlKey === true) {
    return 'resize'
  }

  return wheelAction.value === 'off' ? false : wheelAction.value
}

function adjustIntervalHeight(minutes: number): void {
  intervalHeight.value = clamp(intervalHeight.value + minutes, 18, 48)
}

function moveEvent(event: Event, minutes: number): void {
  const startMinutes = toMinutes(event.time)
  const maxStart = intervalEndMinutes - event.duration
  const nextStart = clamp(startMinutes + minutes, intervalStartMinutes, maxStart)

  event.time = toTime(nextStart)
}

function resizeEvent(event: Event, minutes: number): void {
  const startMinutes = toMinutes(event.time)
  const maxAvailableDuration = intervalEndMinutes - startMinutes
  const nextDuration = clamp(
    event.duration + minutes,
    minDuration,
    Math.min(maxDuration, maxAvailableDuration),
  )

  event.duration = nextDuration
}

function showActiveTooltip(event: Event, message = eventSummary(event)): void {
  clearTimeout(resizeTimeout.value)

  event.tooltip = message
  resizeTimeout.value = setTimeout(() => {
    event.tooltip = undefined
  }, 1000)
}

function eventSummary(event: Event): string {
  return `${event.time} - ${event.duration} mins`
}

function getWheelMinutes(evt: WheelEvent): number {
  if (evt.deltaY === 0) {
    return 0
  }

  return evt.deltaY > 0 ? 1 : -1
}

function toMinutes(time: string): number {
  const minutes = parseTime(time)

  return minutes === false ? 0 : minutes
}

function toTime(minutes: number): string {
  const hours = Math.floor(minutes / 60)
  const remainingMinutes = minutes % 60

  return `${String(hours).padStart(2, '0')}:${String(remainingMinutes).padStart(2, '0')}`
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max)
}

function onToday() {
  if (calendar.value) {
    calendar.value.moveToToday()
  }
}
function onPrev() {
  if (calendar.value) {
    calendar.value.prev()
  }
}
function onNext() {
  if (calendar.value) {
    calendar.value.next()
  }
}
function onMoved(data: Timestamp) {
  console.info('onMoved', data)
}
function onChange(data: { start: Timestamp; end: Timestamp; days: Timestamp[] }) {
  console.info('onChange', data)
}
function onClickDate(data: Timestamp) {
  console.info('onClickDate', data)
}
function onClickTime(data: Timestamp) {
  console.info('onClickTime', data)
}
function onClickInterval(data: Timestamp) {
  console.info('onClickInterval', data)
}
function onClickHeadIntervals(data: Timestamp) {
  console.info('onClickHeadIntervals', data)
}
function onClickHeadDay(data: Timestamp) {
  console.info('onClickHeadDay', data)
}
</script>

<style lang="scss" scoped>
.wheel-controls {
  display: grid;
  justify-items: center;
  gap: 8px;
}

.wheel-controls__status {
  opacity: 0.8;
}

.wheel-event {
  position: absolute;
  left: 4px;
  right: 4px;
  overflow: hidden;
  padding: 4px 6px;
  border-radius: 4px;
  color: white;
  cursor: ns-resize;
  box-shadow: 0 1px 4px rgb(0 0 0 / 25%);
}

.wheel-event__title {
  font-weight: 700;
  line-height: 1.2;
}

.wheel-event__meta {
  font-size: 11px;
  opacity: 0.9;
}
</style>
