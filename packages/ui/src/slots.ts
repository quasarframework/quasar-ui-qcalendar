import type { ColumnObject } from './composables/useColumn'
import type { Resource, ScopeForSlot } from './composables/useInterval'
import type { Task } from './composables/useTask'
import type { Timestamp } from '@timestamp-js/core'

type SlotProps<T> = { scope: T }

export interface IntervalSlotScope extends ScopeForSlot {
  index?: number
  dayLabel?: string
  days?: Timestamp[]
  miniMode?: boolean
  selectedDate?: boolean
}

export interface HeadDayButtonSlotScope {
  dayLabel: string
  timestamp: Timestamp
  activeDate: boolean
  disabled?: boolean
}

export interface ColumnHeaderSlotScope {
  timestamp: Timestamp
  columnIndex: number
}

export interface SchedulerHeadDaySlotScope {
  timestamp: Timestamp
  activeDate: boolean
  droppable: boolean
  disabled: boolean
  columnIndex: number
}

export interface SchedulerHeadWeekdaySlotScope {
  timestamp: Timestamp
  shortWeekdayLabel: boolean
}

export interface MonthWeekSlotScope {
  week: Timestamp[]
  weekdays: number[]
  miniMode: boolean
}

export interface MonthWorkweekSlotScope {
  workweekLabel: string
  week: Timestamp[]
  miniMode: boolean
}

export interface MonthHeadWorkweekSlotScope {
  start: Timestamp
  end: Timestamp
  miniMode: boolean
}

export interface MonthHeadDaySlotScope {
  activeDate: boolean
  weekday?: number
  timestamp: Timestamp
  days: Timestamp[]
  index: number
  miniMode: boolean
  droppable?: boolean
  disabled?: boolean
}

export interface MonthDaySlotScope {
  outside: boolean
  timestamp: Timestamp
  miniMode: boolean
  activeDate: boolean
  hasMonth: boolean
  droppable: boolean
  disabled: boolean
}

export interface MonthDayLabelSlotScope {
  dayLabel: string
  timestamp: Timestamp
  outside: boolean
  activeDate: boolean
  selectedDate: boolean
  miniMode: boolean
  disabled: boolean
}

export interface IntervalLabelSlotScope {
  timestamp: Timestamp
  index?: number
  label?: string
  droppable?: boolean
}

export interface HeadDaysEventsSlotScope {
  days: Timestamp[]
  timestamps?: Timestamp[]
  ref: unknown
}

export interface HeadIntervalsSlotScope {
  timestamps: Timestamp[]
  days: Timestamp[]
  date: string
}

export interface DayContainerSlotScope {
  days: Timestamp[]
}

export interface AgendaHeadColumnSlotScope {
  column: ColumnObject
  index: number
  days: Timestamp[]
}

export interface AgendaHeadColumnLabelSlotScope {
  column: ColumnObject
}

export interface AgendaColumnSlotScope {
  column: ColumnObject
  days: Timestamp[]
  index: number
}

export interface ResourceHeadSlotScope {
  timestamps: unknown
  days?: Timestamp[]
  date: string
  resources?: Resource[]
}

export interface ResourceRowSlotScope {
  resource: Resource
  resourceIndex: number
  indentLevel: number
  expanded: boolean
}

export interface ResourceLabelSlotScope {
  resource: Resource
  timestamps: unknown
  resourceIndex: number
  indentLevel: number
  label: unknown
  droppable: boolean | string
}

export interface ResourceIntervalsSlotScope {
  resource: Resource
  timestamps: unknown
  resourceIndex: number
  timeStartPosX: (_time: string, _clamp?: boolean) => number | false
  timeDurationWidth: (_minutes: number) => number
}

export interface ResourceIntervalSlotScope {
  activeDate: boolean
  resource: Resource
  timestamp: Timestamp
  resourceIndex: number
  droppable: boolean | string
}

export interface SchedulerResourceDaysSlotScope {
  resource: Resource
  resourceIndex: number
  indentLevel: number
  expanded: boolean
  cellWidth?: string
  timestamps: Timestamp[]
  days: Timestamp[]
}

export interface SchedulerDaySlotScope {
  timestamp: Timestamp
  columnIndex: number
  resource: Resource
  resourceIndex: number
  indentLevel: number
  activeDate: boolean
  droppable: boolean | string
}

export interface TaskHeadSlotScope {
  start: Timestamp | null
  end: Timestamp | null
}

export interface TaskItemSlotScope extends TaskHeadSlotScope {
  task: Task
  taskIndex: number
  indentLevel: number
  expanded: boolean
  droppable: boolean | string
}

export interface TaskDaySlotScope {
  timestamp: Timestamp
  task: Task
  taskIndex: number
  activeDate: boolean
  droppable: boolean | string
}

export interface TaskDaysSlotScope {
  timestamps: Timestamp[]
  days: Timestamp[]
  task: Task
  taskIndex: number
  cellWidth: number
}

export interface TaskTitleSlotScope extends TaskHeadSlotScope {
  cellWidth?: string
  title: unknown
  index: number
}

export interface TaskTitleDaySlotScope {
  timestamp: Timestamp
  title: string
  index: number
  cellWidth: number
}

export interface TaskFooterSlotScope extends TaskHeadSlotScope {
  footer: Task
  index: number
}

export interface TaskFooterDaySlotScope {
  timestamp: Timestamp
  footer: Task
  index: number
}

export interface TaskHeadDaySlotScope {
  timestamp: Timestamp
  activeDate: boolean
  droppable: boolean | string
  disabled: boolean
}

export interface QCalendarDaySlots {
  'head-intervals'?: SlotProps<HeadIntervalsSlotScope>
  'head-days-events'?: SlotProps<HeadDaysEventsSlotScope>
  'head-day'?: SlotProps<IntervalSlotScope>
  'head-date'?: SlotProps<IntervalSlotScope>
  'head-day-event'?: SlotProps<IntervalSlotScope>
  'head-weekday-label'?: SlotProps<IntervalSlotScope>
  'head-day-label'?: SlotProps<HeadDayButtonSlotScope>
  'head-day-button'?: SlotProps<HeadDayButtonSlotScope>
  'column-header-before'?: SlotProps<ColumnHeaderSlotScope>
  'column-header-after'?: SlotProps<ColumnHeaderSlotScope>
  'day-container'?: SlotProps<DayContainerSlotScope>
  'day-body'?: SlotProps<IntervalSlotScope>
  'day-interval'?: SlotProps<IntervalSlotScope>
  'interval-label'?: SlotProps<IntervalLabelSlotScope>
}

export interface QCalendarAgendaSlots {
  'head-column'?: AgendaHeadColumnSlotScope
  'head-column-label'?: SlotProps<AgendaHeadColumnLabelSlotScope>
  'head-days-events'?: SlotProps<HeadDaysEventsSlotScope>
  'head-day'?: SlotProps<IntervalSlotScope>
  'head-date'?: SlotProps<IntervalSlotScope>
  'head-day-event'?: SlotProps<IntervalSlotScope>
  'head-weekday-label'?: SlotProps<IntervalSlotScope>
  'head-day-label'?: SlotProps<HeadDayButtonSlotScope>
  'head-day-button'?: SlotProps<HeadDayButtonSlotScope>
  'day-container'?: SlotProps<DayContainerSlotScope>
  column?: SlotProps<AgendaColumnSlotScope>
  day?: SlotProps<IntervalSlotScope>
}

export interface QCalendarMonthSlots {
  week?: SlotProps<MonthWeekSlotScope>
  workweek?: SlotProps<MonthWorkweekSlotScope>
  'head-workweek'?: SlotProps<MonthHeadWorkweekSlotScope>
  'head-day'?: SlotProps<MonthHeadDaySlotScope>
  'head-day-event'?: SlotProps<MonthHeadDaySlotScope>
  'head-day-label'?: SlotProps<MonthDayLabelSlotScope>
  'head-day-button'?: SlotProps<MonthDayLabelSlotScope>
  day?: SlotProps<MonthDaySlotScope>
  'day-of-year'?: SlotProps<{ timestamp: Timestamp }>
  'month-label'?: SlotProps<{ monthLabel: string; timestamp: Timestamp; miniMode: boolean }>
}

export interface QCalendarResourceSlots {
  'head-resources'?: SlotProps<ResourceHeadSlotScope>
  'interval-label'?: SlotProps<IntervalLabelSlotScope>
  'resource-row'?: SlotProps<ResourceRowSlotScope>
  'resource-label'?: SlotProps<ResourceLabelSlotScope>
  'resource-intervals'?: SlotProps<ResourceIntervalsSlotScope>
  'resource-interval'?: SlotProps<ResourceIntervalSlotScope>
}

export interface QCalendarSchedulerSlots {
  'head-resources'?: SlotProps<ResourceHeadSlotScope>
  'head-days-events'?: SlotProps<HeadDaysEventsSlotScope>
  'head-day'?: SlotProps<SchedulerHeadDaySlotScope>
  'head-date'?: SlotProps<SchedulerHeadDaySlotScope>
  'head-day-event'?: SlotProps<SchedulerHeadDaySlotScope>
  'head-weekday-label'?: SlotProps<SchedulerHeadWeekdaySlotScope>
  'head-day-label'?: SlotProps<HeadDayButtonSlotScope>
  'head-day-button'?: SlotProps<HeadDayButtonSlotScope>
  'column-header-before'?: SlotProps<ColumnHeaderSlotScope>
  'column-header-after'?: SlotProps<ColumnHeaderSlotScope>
  'resource-row'?: SlotProps<ResourceRowSlotScope>
  'resource-label'?: SlotProps<ResourceLabelSlotScope>
  'resource-days'?: SlotProps<SchedulerResourceDaysSlotScope>
  day?: SlotProps<SchedulerDaySlotScope>
}

export interface QCalendarTaskSlots {
  'head-tasks'?: SlotProps<TaskHeadSlotScope>
  task?: SlotProps<TaskItemSlotScope>
  subtask?: SlotProps<TaskItemSlotScope>
  day?: SlotProps<TaskDaySlotScope>
  days?: SlotProps<TaskDaysSlotScope>
  'title-task'?: SlotProps<TaskTitleSlotScope>
  'title-day'?: SlotProps<TaskTitleDaySlotScope>
  'footer-task'?: SlotProps<TaskFooterSlotScope>
  'footer-day'?: SlotProps<TaskFooterDaySlotScope>
  'head-weekday-label'?: SlotProps<{ activeDate: boolean; timestamp: Timestamp; disabled: boolean }>
  'head-day-label'?: SlotProps<{ dayLabel: string; timestamp: Timestamp; activeDate: boolean }>
  'head-day-button'?: SlotProps<{ dayLabel: string; timestamp: Timestamp; activeDate: boolean }>
  'head-day'?: SlotProps<TaskHeadDaySlotScope>
  'head-date'?: SlotProps<TaskHeadDaySlotScope>
}
