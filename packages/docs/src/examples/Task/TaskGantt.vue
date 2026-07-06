<template>
  <div class="subcontent gantt-demo">
    <p class="text-body2 text-center q-mb-md">
      This recipe uses the task label column for work metadata and the
      <code>days</code> slot to draw continuous planning bars across the visible month.
    </p>

    <div class="gantt-demo__toolbar">
      <navigation-bar @today="onToday" @prev="onPrev" @next="onNext" />

      <div class="gantt-demo__legend" aria-label="Planning status legend">
        <span
          v-for="item in legend"
          :key="item.label"
          class="gantt-demo__legend-item"
          :style="{ '--gantt-color': item.color }"
        >
          <span class="gantt-demo__legend-dot" />
          {{ item.label }}
        </span>
      </div>
    </div>

    <div class="gantt-demo__period">
      <div class="gantt-demo__period-label">Delivery Plan</div>
      <strong>{{ monthTitle }}</strong>
      <span>{{ visibleRangeLabel }}</span>
    </div>

    <div class="row justify-center full-width">
      <div class="gantt-demo__calendar">
        <q-calendar-task
          ref="calendar"
          v-model="selectedDate"
          :model-tasks="tasks"
          view="month"
          :task-width="taskColumnWidth"
          :cell-width="dayCellWidth"
          :day-min-height="taskRowHeight"
          :min-weekday-label="2"
          :weekday-class="weekdayClass"
          :day-class="dayClass"
          :style="{ height: calendarHeight }"
          no-active-date
          animated
          bordered
          @change="onChange"
        >
          <template #head-tasks>
            <div class="gantt-demo__task-head">
              <span>Work item</span>
              <span>Owner</span>
              <span>Done</span>
            </div>
          </template>

          <template #task="{ scope }">
            <div class="gantt-demo__task-row">
              <div class="gantt-demo__task-main">
                <q-icon :name="scope.task.icon" size="18px" :style="{ color: scope.task.color }" />
                <div class="gantt-demo__task-copy">
                  <strong>{{ scope.task.title }}</strong>
                  <span>{{ scope.task.phase }}</span>
                </div>
              </div>
              <span class="gantt-demo__task-owner">{{ scope.task.owner }}</span>
              <span class="gantt-demo__task-progress">{{ scope.task.progress }}%</span>
            </div>
          </template>

          <template #days="{ scope }">
            <div class="gantt-demo__overlay" aria-hidden="true">
              <div
                v-if="getBarStyle(scope.timestamps, scope.task, scope.cellWidth)"
                class="gantt-demo__bar"
                :class="getBarClass(scope.timestamps, scope.task)"
                :style="getBarStyle(scope.timestamps, scope.task, scope.cellWidth)"
              >
                <span>{{ getBarLabel(scope.timestamps, scope.task, scope.cellWidth) }}</span>
              </div>

              <div
                v-for="milestone in getVisibleMilestones(
                  scope.timestamps,
                  scope.task,
                  scope.cellWidth,
                )"
                :key="milestone.label"
                class="gantt-demo__milestone"
                :style="milestone.style"
              >
                <span>{{ milestone.label }}</span>
              </div>
            </div>
          </template>
        </q-calendar-task>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { QCalendarTask } from '@quasar/quasar-ui-qcalendar'
import { type Timestamp, today } from '@timestamp-js/core'
import '@quasar/quasar-ui-qcalendar/index.css'

import { computed, ref } from 'vue'
import NavigationBar from '@/components/NavigationBar.vue'

interface Milestone {
  date: string
  label: string
}

interface GanttTask {
  id: string
  title: string
  phase: string
  owner: string
  icon: string
  color: string
  progress: number
  start: string
  end: string
  height: string
  milestones?: Milestone[]
}

interface VisibleMilestone {
  label: string
  style: Record<string, string>
}

interface CalendarChange {
  start: string
  end: string
}

interface ClassData {
  scope: {
    timestamp: Timestamp
  }
}

const calendar = ref<QCalendarTask>()
const selectedDate = ref('2026-06-15')
const visibleStart = ref('2026-06-01')
const visibleEnd = ref('2026-06-30')
const taskColumnWidth = 340
const dayCellWidth = 42
const taskHeaderHeight = 55
const taskRowHeight = 58

const legend = [
  { label: 'Planned', color: '#4f7cff' },
  { label: 'In progress', color: '#00a98f' },
  { label: 'At risk', color: '#f59f00' },
]

const tasks = computed<GanttTask[]>(() => {
  const date = createDateFactory(selectedDate.value)

  return [
    {
      id: 'discovery',
      title: 'Discovery workshop',
      phase: 'Scope',
      owner: 'Nia',
      icon: 'travel_explore',
      color: '#4f7cff',
      progress: 100,
      start: date(1),
      end: date(5),
      height: '58',
      milestones: [{ date: date(5), label: 'Scope locked' }],
    },
    {
      id: 'design',
      title: 'Experience design',
      phase: 'Design',
      owner: 'Ari',
      icon: 'draw',
      color: '#00a98f',
      progress: 75,
      start: date(4),
      end: date(12),
      height: '58',
      milestones: [{ date: date(12), label: 'Review' }],
    },
    {
      id: 'api',
      title: 'API integration',
      phase: 'Build',
      owner: 'Kai',
      icon: 'hub',
      color: '#00a98f',
      progress: 48,
      start: date(9),
      end: date(19),
      height: '58',
      milestones: [{ date: date(16), label: 'Contract' }],
    },
    {
      id: 'qa',
      title: 'QA and release checks',
      phase: 'Verify',
      owner: 'Mina',
      icon: 'fact_check',
      color: '#f59f00',
      progress: 28,
      start: date(17),
      end: date(25),
      height: '58',
      milestones: [{ date: date(24), label: 'Signoff' }],
    },
    {
      id: 'release',
      title: 'Release candidate',
      phase: 'Ship',
      owner: 'Owen',
      icon: 'rocket_launch',
      color: '#4f7cff',
      progress: 0,
      start: date(25),
      end: date(27),
      height: '58',
      milestones: [{ date: date(27), label: 'RC' }],
    },
  ]
})

const monthTitle = computed(() => {
  const [year, month] = selectedDate.value.split('-')
  const value = new Date(Number(year), Number(month) - 1, 1)
  return new Intl.DateTimeFormat('en-US', {
    month: 'long',
    year: 'numeric',
  }).format(value)
})

const visibleRangeLabel = computed(() => `${visibleStart.value} to ${visibleEnd.value}`)
const calendarHeight = computed(() => `${taskHeaderHeight + tasks.value.length * taskRowHeight}px`)

function createDateFactory(date: string): (day: number) => string {
  const [year, month] = date.split('-')

  return (day: number) => `${year}-${month}-${String(day).padStart(2, '0')}`
}

function getVisibleRange(
  timestamps: Timestamp[],
  task: GanttTask,
): { start: number; end: number } | null {
  const start = timestamps.findIndex((timestamp) => timestamp.date >= task.start)
  const endFromRight = [...timestamps]
    .reverse()
    .findIndex((timestamp) => timestamp.date <= task.end)

  if (start === -1 || endFromRight === -1) {
    return null
  }

  const end = timestamps.length - 1 - endFromRight

  return start <= end ? { start, end } : null
}

function getBarStyle(
  timestamps: Timestamp[],
  task: GanttTask,
  cellWidth: number,
): Record<string, string> | undefined {
  const range = getVisibleRange(timestamps, task)

  if (range === null) {
    return undefined
  }

  const left = range.start * cellWidth + 5
  const width = (range.end - range.start + 1) * cellWidth - 10

  return {
    '--gantt-color': task.color,
    '--gantt-progress': `${task.progress}%`,
    left: `${left}px`,
    width: `${Math.max(width, 16)}px`,
  }
}

function getBarClass(timestamps: Timestamp[], task: GanttTask): Record<string, boolean> {
  const range = getVisibleRange(timestamps, task)

  if (range === null) {
    return {}
  }

  return {
    'gantt-demo__bar--continues-before': timestamps[range.start]?.date !== task.start,
    'gantt-demo__bar--continues-after': timestamps[range.end]?.date !== task.end,
  }
}

function getBarLabel(timestamps: Timestamp[], task: GanttTask, cellWidth: number): string {
  const range = getVisibleRange(timestamps, task)

  if (range === null) {
    return ''
  }

  const width = (range.end - range.start + 1) * cellWidth

  return width > 110 ? `${task.phase} ${task.progress}%` : `${task.progress}%`
}

function getVisibleMilestones(
  timestamps: Timestamp[],
  task: GanttTask,
  cellWidth: number,
): VisibleMilestone[] {
  if (task.milestones === undefined) {
    return []
  }

  const visibleMilestones: VisibleMilestone[] = []

  task.milestones.forEach((milestone) => {
    const index = timestamps.findIndex((timestamp) => timestamp.date === milestone.date)

    if (index === -1) {
      return
    }

    visibleMilestones.push({
      label: milestone.label,
      style: {
        '--gantt-color': task.color,
        left: `${index * cellWidth + cellWidth / 2}px`,
      },
    })
  })

  return visibleMilestones
}

function isWeekend(timestamp: Timestamp): boolean {
  return timestamp.weekday === 0 || timestamp.weekday === 6
}

function weekdayClass(data: ClassData): Record<string, boolean> {
  return {
    'gantt-demo__weekend': isWeekend(data.scope.timestamp),
  }
}

function dayClass(data: ClassData): Record<string, boolean> {
  return {
    'gantt-demo__weekend': isWeekend(data.scope.timestamp),
  }
}

function onChange(data: CalendarChange) {
  visibleStart.value = data.start
  visibleEnd.value = data.end
}

function onToday() {
  selectedDate.value = today()
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
.gantt-demo {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: 14px;
  width: 100%;
  min-width: 0;
  max-width: 100%;
  overflow: hidden;
}

.gantt-demo > * {
  min-width: 0;
}

.gantt-demo__toolbar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.gantt-demo__legend {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px;
  font-size: 0.78rem;
  color: color-mix(in srgb, currentColor, transparent 18%);
}

.gantt-demo__legend-item {
  display: inline-flex;
  align-items: center;
  gap: 5px;
}

.gantt-demo__legend-dot {
  width: 9px;
  height: 9px;
  border-radius: 999px;
  background: var(--gantt-color);
}

.gantt-demo__period {
  display: grid;
  justify-items: center;
  gap: 2px;
}

.gantt-demo__period-label {
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: color-mix(in srgb, currentColor, transparent 45%);
}

.gantt-demo__period strong {
  font-size: 1.1rem;
}

.gantt-demo__period span {
  color: color-mix(in srgb, currentColor, transparent 36%);
  font-size: 0.82rem;
}

.gantt-demo__calendar {
  display: flex;
  width: 100%;
  max-width: 100%;
}

.gantt-demo__calendar :deep(.gantt-demo__weekend) {
  background: color-mix(in srgb, var(--q-primary), transparent 94%);
}

.gantt-demo__task-head,
.gantt-demo__task-row {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 62px 54px;
  align-items: center;
  gap: 8px;
  width: 100%;
  height: 100%;
  padding: 0 10px;
  font-size: 0.76rem;
}

.gantt-demo__task-head {
  font-weight: 700;
  color: color-mix(in srgb, currentColor, transparent 22%);
  background: color-mix(in srgb, var(--q-primary), transparent 94%);
}

.gantt-demo__task-main {
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
}

.gantt-demo__task-copy {
  display: grid;
  min-width: 0;
  line-height: 1.2;
}

.gantt-demo__task-copy strong,
.gantt-demo__task-copy span {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.gantt-demo__task-copy span,
.gantt-demo__task-owner {
  color: color-mix(in srgb, currentColor, transparent 38%);
}

.gantt-demo__task-owner,
.gantt-demo__task-progress {
  text-align: right;
}

.gantt-demo__task-progress {
  font-variant-numeric: tabular-nums;
  font-weight: 700;
}

.gantt-demo__overlay {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.gantt-demo__bar {
  position: absolute;
  top: 50%;
  height: 18px;
  border-radius: 999px;
  overflow: hidden;
  background: color-mix(in srgb, var(--gantt-color), transparent 72%);
  box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--gantt-color), transparent 44%);
  transform: translateY(-50%);
}

.gantt-demo__bar::before {
  content: '';
  position: absolute;
  inset: 0 auto 0 0;
  width: var(--gantt-progress);
  background: var(--gantt-color);
}

.gantt-demo__bar--continues-before {
  border-top-left-radius: 2px;
  border-bottom-left-radius: 2px;
}

.gantt-demo__bar--continues-after {
  border-top-right-radius: 2px;
  border-bottom-right-radius: 2px;
}

.gantt-demo__bar span {
  position: relative;
  z-index: 1;
  display: block;
  padding: 0 8px;
  color: #fff;
  font-size: 0.68rem;
  font-weight: 700;
  line-height: 18px;
  text-align: center;
  text-shadow: 0 1px 2px rgb(0 0 0 / 30%);
  white-space: nowrap;
}

.gantt-demo__milestone {
  position: absolute;
  top: 50%;
  width: 16px;
  height: 16px;
  background: var(--gantt-color);
  box-shadow:
    0 0 0 2px var(--q-calendar-background-current),
    0 0 0 3px color-mix(in srgb, var(--gantt-color), transparent 25%);
  transform: translate(-50%, -50%) rotate(45deg);
}

.gantt-demo__milestone span {
  position: absolute;
  top: -24px;
  left: 50%;
  min-width: max-content;
  padding: 2px 5px;
  border-radius: 4px;
  background: color-mix(in srgb, var(--gantt-color), transparent 12%);
  color: #fff;
  font-size: 0.64rem;
  font-weight: 700;
  transform: translateX(-50%) rotate(-45deg);
}

@media (max-width: 700px) {
  .gantt-demo__toolbar {
    justify-content: center;
  }

  .gantt-demo__legend {
    justify-content: center;
  }
}
</style>
