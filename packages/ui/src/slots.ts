import type { ColumnObject } from './composables/useColumn'
import type { Resource, ScopeForSlot } from './composables/useInterval'
import type { Task } from './composables/useTask'
import type { CalendarSystem, Timestamp } from '@timestamp-js/core'
import type { Ref } from 'vue'

type SlotProps<T> = { scope: T }

export interface CalendarSlotScope {
  /** Timestamp represented in the configured calendar system. */
  calendarTimestamp: Timestamp
  /** Calendar system used to create `calendarTimestamp`. */
  calendarSystem: CalendarSystem
}

export interface IntervalSlotScope extends ScopeForSlot, CalendarSlotScope {
  /** Zero-based interval index. */
  index?: number
  /** Formatted day label for the current timestamp. */
  dayLabel?: string
  /** Visible days rendered by the current view. */
  days?: Timestamp[]
  /** Whether the view is currently rendered in mini mode. */
  miniMode?: boolean
  /** Whether the slot timestamp is selected. */
  selectedDate?: boolean
}

export interface HeadDayButtonSlotScope extends CalendarSlotScope {
  /** Formatted day label displayed in the header button. */
  dayLabel: string
  /** Timestamp represented by the header button. */
  timestamp: Timestamp
  /** Whether the timestamp is the active date. */
  activeDate: boolean
  /** Whether the header button is disabled. */
  disabled?: boolean
}

export interface ColumnHeaderSlotScope extends CalendarSlotScope {
  /** Timestamp represented by the column. */
  timestamp: Timestamp
  /** Zero-based column index. */
  columnIndex: number
}

export interface TimestampMouseScope extends CalendarSlotScope {
  /** Timestamp represented by the event target. */
  timestamp: Timestamp
}

export interface SchedulerHeadDaySlotScope extends CalendarSlotScope {
  /** Timestamp represented by the scheduler header day. */
  timestamp: Timestamp
  /** Whether the timestamp is the active date. */
  activeDate: boolean
  /** Whether the header day can accept dropped content. */
  droppable: boolean
  /** Whether the header day is disabled. */
  disabled: boolean
  /** Zero-based scheduler column index. */
  columnIndex: number
}

export interface SchedulerHeadWeekdaySlotScope extends CalendarSlotScope {
  /** Timestamp represented by the scheduler weekday header. */
  timestamp: Timestamp
  /** Whether the weekday label is rendered in short form. */
  shortWeekdayLabel: boolean
}

export interface MonthWeekSlotScope {
  /** Timestamps in the rendered week. */
  week: Timestamp[]
  /** Weekday indexes included in the rendered week. */
  weekdays: number[]
  /** Whether the month view is currently rendered in mini mode. */
  miniMode: boolean
}

export interface MonthWorkweekSlotScope {
  /** Formatted workweek label. */
  workweekLabel: string
  /** Timestamps in the rendered workweek. */
  week: Timestamp[]
  /** Whether the month view is currently rendered in mini mode. */
  miniMode: boolean
}

export interface MonthHeadWorkweekSlotScope {
  /** First timestamp in the workweek. */
  start: Timestamp
  /** Last timestamp in the workweek. */
  end: Timestamp
  /** Whether the month view is currently rendered in mini mode. */
  miniMode: boolean
}

export interface MonthHeadDaySlotScope extends CalendarSlotScope {
  /** Whether the timestamp is the active date. */
  activeDate: boolean
  /** Weekday index for the header day. */
  weekday?: number
  /** Timestamp represented by the header day. */
  timestamp: Timestamp
  /** Visible days represented by the header. */
  days: Timestamp[]
  /** Zero-based header day index. */
  index: number
  /** Whether the month view is currently rendered in mini mode. */
  miniMode: boolean
  /** Whether the header day can accept dropped content. */
  droppable?: boolean
  /** Whether the header day is disabled. */
  disabled?: boolean
}

export interface MonthDaySlotScope extends CalendarSlotScope {
  /** Whether the day is outside the active month. */
  outside: boolean
  /** Timestamp represented by the day cell. */
  timestamp: Timestamp
  /** Whether the month view is currently rendered in mini mode. */
  miniMode: boolean
  /** Whether the timestamp is the active date. */
  activeDate: boolean
  /** Whether the timestamp belongs to the rendered month. */
  hasMonth: boolean
  /** Whether the day can accept dropped content. */
  droppable: boolean
  /** Whether the day is disabled. */
  disabled: boolean
}

export interface MonthDayLabelSlotScope extends CalendarSlotScope {
  /** Formatted day label. */
  dayLabel: string
  /** Timestamp represented by the day label. */
  timestamp: Timestamp
  /** Whether the day is outside the active month. */
  outside: boolean
  /** Whether the timestamp is the active date. */
  activeDate: boolean
  /** Whether the timestamp is selected. */
  selectedDate: boolean
  /** Whether the month view is currently rendered in mini mode. */
  miniMode: boolean
  /** Whether the day is disabled. */
  disabled: boolean
}

export interface MonthDayOfYearSlotScope extends CalendarSlotScope {
  /** Timestamp represented by the day-of-year label. */
  timestamp: Timestamp
}

export interface MonthLabelSlotScope extends CalendarSlotScope {
  /** Formatted month label. */
  monthLabel: string
  /** Timestamp represented by the month label. */
  timestamp: Timestamp
  /** Whether the month view is currently rendered in mini mode. */
  miniMode: boolean
}

export interface IntervalLabelSlotScope extends CalendarSlotScope {
  /** Timestamp represented by the interval. */
  timestamp: Timestamp
  /** Zero-based interval index. */
  index?: number
  /** Formatted interval label. */
  label?: string
  /** Whether the interval can accept dropped content. */
  droppable?: boolean
}

export interface HeadDaysEventsSlotScope {
  /** Visible days rendered by the current view. */
  days: Timestamp[]
  /** Visible timestamps rendered by the current view. */
  timestamps?: Timestamp[]
  /** Header events container reference. */
  ref: Ref<HTMLElement | undefined>
}

export interface HeadIntervalsSlotScope {
  /** Visible interval timestamps. */
  timestamps: Timestamp[]
  /** Visible days rendered by the current view. */
  days: Timestamp[]
  /** Date represented by the header intervals. */
  date: string
}

export interface DayContainerSlotScope {
  /** Visible days rendered by the day container. */
  days: Timestamp[]
}

export interface AgendaHeadColumnSlotScope {
  /** Column represented by the agenda header. */
  column: ColumnObject
  /** Zero-based column index. */
  index: number
  /** Visible days rendered by the agenda view. */
  days: Timestamp[]
}

export interface AgendaHeadColumnLabelSlotScope {
  /** Column represented by the agenda header label. */
  column: ColumnObject
}

export interface AgendaColumnSlotScope {
  /** Column represented by the agenda body. */
  column: ColumnObject
  /** Visible days rendered by the agenda column. */
  days: Timestamp[]
  /** Zero-based column index. */
  index: number
}

export interface ResourceHeadSlotScope {
  /** Visible interval timestamps for the resource header. */
  timestamps: Ref<Timestamp[][]> | Timestamp[]
  /** Visible days rendered by the resource view. */
  days?: Timestamp[]
  /** Date represented by the resource header. */
  date: string
  /** Resources rendered by the resource view. */
  resources?: Resource[]
}

export interface ResourceRowSlotScope {
  /** Resource represented by the row. */
  resource: Resource
  /** Zero-based resource index. */
  resourceIndex: number
  /** Nesting level for hierarchical resources. */
  indentLevel: number
  /** Whether the resource row is expanded. */
  expanded: boolean
}

export interface ResourceLabelSlotScope {
  /** Resource represented by the label. */
  resource: Resource
  /** Visible interval timestamps for the resource. */
  timestamps: Ref<Timestamp[][]> | Timestamp[]
  /** Visible days rendered by the resource view. */
  days?: Timestamp[]
  /** Zero-based resource index. */
  resourceIndex: number
  /** Nesting level for hierarchical resources. */
  indentLevel: number
  /** Rendered resource label value. */
  label: string | number
  /** Whether the resource label can accept dropped content. */
  droppable: boolean | string
}

export interface ResourceIntervalsSlotScope {
  /** Resource represented by the interval row. */
  resource: Resource
  /** Visible interval timestamps for the resource. */
  timestamps: Ref<Timestamp[][]>
  /** Zero-based resource index. */
  resourceIndex: number
  /** Helper that returns the horizontal start position for a time. */
  timeStartPosX: (_time: string, _clamp?: boolean) => number | false
  /** Helper that returns the horizontal width for a duration. */
  timeDurationWidth: (_minutes: number) => number
}

export interface ResourceIntervalSlotScope extends CalendarSlotScope {
  /** Whether the interval timestamp is the active date. */
  activeDate: boolean
  /** Resource represented by the interval. */
  resource: Resource
  /** Timestamp represented by the interval. */
  timestamp: Timestamp
  /** Zero-based resource index. */
  resourceIndex: number
  /** Whether the interval can accept dropped content. */
  droppable: boolean | string
}

export interface SchedulerResourceDaysSlotScope {
  /** Resource represented by the scheduler row. */
  resource: Resource
  /** Zero-based resource index. */
  resourceIndex: number
  /** Nesting level for hierarchical resources. */
  indentLevel: number
  /** Whether the scheduler resource row is expanded. */
  expanded: boolean
  /** Rendered scheduler cell width. */
  cellWidth?: string
  /** Visible interval timestamps. */
  timestamps: Timestamp[]
  /** Visible days rendered by the scheduler. */
  days: Timestamp[]
}

export interface SchedulerDaySlotScope extends CalendarSlotScope {
  /** Timestamp represented by the scheduler day cell. */
  timestamp: Timestamp
  /** Zero-based scheduler column index. */
  columnIndex: number
  /** Resource represented by the scheduler day cell. */
  resource: Resource
  /** Zero-based resource index. */
  resourceIndex: number
  /** Nesting level for hierarchical resources. */
  indentLevel: number
  /** Whether the timestamp is the active date. */
  activeDate: boolean
  /** Whether the day cell can accept dropped content. */
  droppable: boolean | string
}

export interface TaskHeadSlotScope {
  /** First timestamp rendered by the task view. */
  start: Timestamp | null
  /** Last timestamp rendered by the task view. */
  end: Timestamp | null
}

export interface TaskItemSlotScope extends TaskHeadSlotScope {
  /** Task represented by the slot. */
  task: Task
  /** Zero-based task index. */
  taskIndex: number
  /** Nesting level for hierarchical tasks. */
  indentLevel: number
  /** Whether the task is expanded. */
  expanded: boolean
  /** Whether the task can accept dropped content. */
  droppable: boolean | string
}

export interface TaskDaySlotScope extends CalendarSlotScope {
  /** Timestamp represented by the task day cell. */
  timestamp: Timestamp
  /** Task represented by the day cell. */
  task: Task
  /** Zero-based task index. */
  taskIndex: number
  /** Whether the timestamp is the active date. */
  activeDate: boolean
  /** Whether the task day can accept dropped content. */
  droppable: boolean | string
}

export interface TaskDaysSlotScope {
  /** Visible interval timestamps. */
  timestamps: Timestamp[]
  /** Visible days rendered by the task view. */
  days: Timestamp[]
  /** Task represented by the days row. */
  task: Task
  /** Zero-based task index. */
  taskIndex: number
  /** Rendered task cell width. */
  cellWidth: number
}

export interface TaskTitleSlotScope extends TaskHeadSlotScope {
  /** Rendered title cell width. */
  cellWidth?: string
  /** Title value represented by the slot. */
  title: string
  /** Zero-based title index. */
  index: number
}

export interface TaskTitleDaySlotScope extends CalendarSlotScope {
  /** Timestamp represented by the title day cell. */
  timestamp: Timestamp
  /** Title value represented by the title day cell. */
  title: string
  /** Zero-based title index. */
  index: number
  /** Rendered title day cell width. */
  cellWidth: number
}

export interface TaskFooterSlotScope extends TaskHeadSlotScope {
  /** Footer task represented by the slot. */
  footer: Task
  /** Zero-based footer index. */
  index: number
}

export interface TaskFooterDaySlotScope extends CalendarSlotScope {
  /** Timestamp represented by the footer day cell. */
  timestamp: Timestamp
  /** Footer task represented by the day cell. */
  footer: Task
  /** Zero-based footer index. */
  index: number
}

export interface TaskHeadDaySlotScope extends CalendarSlotScope {
  /** Timestamp represented by the task header day. */
  timestamp: Timestamp
  /** Whether the timestamp is the active date. */
  activeDate: boolean
  /** Whether the task header day can accept dropped content. */
  droppable: boolean | string
  /** Whether the task header day is disabled. */
  disabled: boolean
}

export interface TaskHeadWeekdayLabelSlotScope extends CalendarSlotScope {
  /** Whether the timestamp is the active date. */
  activeDate: boolean
  /** Timestamp represented by the weekday label. */
  timestamp: Timestamp
  /** Whether the weekday label is disabled. */
  disabled: boolean
}

export interface TaskHeadDayLabelSlotScope extends CalendarSlotScope {
  /** Formatted day label. */
  dayLabel: string
  /** Timestamp represented by the day label. */
  timestamp: Timestamp
  /** Whether the timestamp is the active date. */
  activeDate: boolean
}

export interface QCalendarDaySlots {
  /** Customize the interval header area. */
  'head-intervals'?: SlotProps<HeadIntervalsSlotScope>
  /** Render content in the day header events container. */
  'head-days-events'?: SlotProps<HeadDaysEventsSlotScope>
  /** Customize the full day header cell. */
  'head-day'?: SlotProps<IntervalSlotScope>
  /** Customize the date area inside the day header. */
  'head-date'?: SlotProps<IntervalSlotScope>
  /** Render event content inside the day header. */
  'head-day-event'?: SlotProps<IntervalSlotScope>
  /** Customize the weekday label in the day header. */
  'head-weekday-label'?: SlotProps<IntervalSlotScope>
  /** Customize the day label in the day header. */
  'head-day-label'?: SlotProps<HeadDayButtonSlotScope>
  /** Customize the day header button. */
  'head-day-button'?: SlotProps<HeadDayButtonSlotScope>
  /** Render content before a column header. */
  'column-header-before'?: SlotProps<ColumnHeaderSlotScope>
  /** Render content after a column header. */
  'column-header-after'?: SlotProps<ColumnHeaderSlotScope>
  /** Customize the container around rendered days. */
  'day-container'?: SlotProps<DayContainerSlotScope>
  /** Customize the day body area. */
  'day-body'?: SlotProps<IntervalSlotScope>
  /** Customize an individual day interval. */
  'day-interval'?: SlotProps<IntervalSlotScope>
  /** Customize an interval label. */
  'interval-label'?: SlotProps<IntervalLabelSlotScope>
}

export interface QCalendarAgendaSlots {
  /** Customize an agenda column header. */
  'head-column'?: SlotProps<AgendaHeadColumnSlotScope>
  /** Customize an agenda column header label. */
  'head-column-label'?: SlotProps<AgendaHeadColumnLabelSlotScope>
  /** Render content in the day header events container. */
  'head-days-events'?: SlotProps<HeadDaysEventsSlotScope>
  /** Customize the full day header cell. */
  'head-day'?: SlotProps<IntervalSlotScope>
  /** Customize the date area inside the day header. */
  'head-date'?: SlotProps<IntervalSlotScope>
  /** Render event content inside the day header. */
  'head-day-event'?: SlotProps<IntervalSlotScope>
  /** Customize the weekday label in the day header. */
  'head-weekday-label'?: SlotProps<IntervalSlotScope>
  /** Customize the day label in the day header. */
  'head-day-label'?: SlotProps<HeadDayButtonSlotScope>
  /** Customize the day header button. */
  'head-day-button'?: SlotProps<HeadDayButtonSlotScope>
  /** Customize the container around rendered days. */
  'day-container'?: SlotProps<DayContainerSlotScope>
  /** Customize an agenda body column. */
  column?: SlotProps<AgendaColumnSlotScope>
  /** Customize a rendered agenda day. */
  day?: SlotProps<IntervalSlotScope>
}

export interface QCalendarMonthSlots {
  /** Customize a rendered week row. */
  week?: SlotProps<MonthWeekSlotScope>
  /** Customize a rendered workweek row. */
  workweek?: SlotProps<MonthWorkweekSlotScope>
  /** Customize the workweek header. */
  'head-workweek'?: SlotProps<MonthHeadWorkweekSlotScope>
  /** Customize the month header day cell. */
  'head-day'?: SlotProps<MonthHeadDaySlotScope>
  /** Render event content inside the month header day. */
  'head-day-event'?: SlotProps<MonthHeadDaySlotScope>
  /** Customize the month header day label. */
  'head-day-label'?: SlotProps<MonthDayLabelSlotScope>
  /** Customize the month header day button. */
  'head-day-button'?: SlotProps<MonthDayLabelSlotScope>
  /** Customize a month day cell. */
  day?: SlotProps<MonthDaySlotScope>
  /** Customize the day-of-year label. */
  'day-of-year'?: SlotProps<MonthDayOfYearSlotScope>
  /** Customize the month label. */
  'month-label'?: SlotProps<MonthLabelSlotScope>
}

export interface QCalendarResourceSlots {
  /** Customize the resource header. Defaults to "Resources". */
  'head-resources'?: SlotProps<ResourceHeadSlotScope>
  /** Customize an interval label. */
  'interval-label'?: SlotProps<IntervalLabelSlotScope>
  /** Customize a resource row. */
  'resource-row'?: SlotProps<ResourceRowSlotScope>
  /** Customize a resource label. */
  'resource-label'?: SlotProps<ResourceLabelSlotScope>
  /** Customize the interval row for a resource. */
  'resource-intervals'?: SlotProps<ResourceIntervalsSlotScope>
  /** Customize an individual resource interval. */
  'resource-interval'?: SlotProps<ResourceIntervalSlotScope>
}

export interface QCalendarSchedulerSlots {
  /** Customize the scheduler resource header. Defaults to "Resources". */
  'head-resources'?: SlotProps<ResourceHeadSlotScope>
  /** Render content in the scheduler day header events container. */
  'head-days-events'?: SlotProps<HeadDaysEventsSlotScope>
  /** Customize the scheduler day header cell. */
  'head-day'?: SlotProps<SchedulerHeadDaySlotScope>
  /** Customize the date area inside the scheduler day header. */
  'head-date'?: SlotProps<SchedulerHeadDaySlotScope>
  /** Render event content inside the scheduler day header. */
  'head-day-event'?: SlotProps<SchedulerHeadDaySlotScope>
  /** Customize the scheduler weekday label. */
  'head-weekday-label'?: SlotProps<SchedulerHeadWeekdaySlotScope>
  /** Customize the scheduler day label. */
  'head-day-label'?: SlotProps<HeadDayButtonSlotScope>
  /** Customize the scheduler day header button. */
  'head-day-button'?: SlotProps<HeadDayButtonSlotScope>
  /** Render content before a scheduler column header. */
  'column-header-before'?: SlotProps<ColumnHeaderSlotScope>
  /** Render content after a scheduler column header. */
  'column-header-after'?: SlotProps<ColumnHeaderSlotScope>
  /** Customize a scheduler resource row. */
  'resource-row'?: SlotProps<ResourceRowSlotScope>
  /** Customize a scheduler resource label. */
  'resource-label'?: SlotProps<ResourceLabelSlotScope>
  /** Customize the rendered days for a scheduler resource. */
  'resource-days'?: SlotProps<SchedulerResourceDaysSlotScope>
  /** Customize a scheduler day cell. */
  day?: SlotProps<SchedulerDaySlotScope>
}

export interface QCalendarTaskSlots {
  /** Customize the task header. */
  'head-tasks'?: SlotProps<TaskHeadSlotScope>
  /** Customize a top-level task row. */
  task?: SlotProps<TaskItemSlotScope>
  /** Customize a nested task row. */
  subtask?: SlotProps<TaskItemSlotScope>
  /** Customize an individual task day cell. */
  day?: SlotProps<TaskDaySlotScope>
  /** Customize the days row for a task. */
  days?: SlotProps<TaskDaysSlotScope>
  /** Customize a task title row. */
  'title-task'?: SlotProps<TaskTitleSlotScope>
  /** Customize a task title day cell. */
  'title-day'?: SlotProps<TaskTitleDaySlotScope>
  /** Customize a task footer row. */
  'footer-task'?: SlotProps<TaskFooterSlotScope>
  /** Customize a task footer day cell. */
  'footer-day'?: SlotProps<TaskFooterDaySlotScope>
  /** Customize the task weekday header label. */
  'head-weekday-label'?: SlotProps<TaskHeadWeekdayLabelSlotScope>
  /** Customize the task day header label. */
  'head-day-label'?: SlotProps<TaskHeadDayLabelSlotScope>
  /** Customize the task day header button. */
  'head-day-button'?: SlotProps<TaskHeadDayLabelSlotScope>
  /** Customize the task header day cell. */
  'head-day'?: SlotProps<TaskHeadDaySlotScope>
  /** Customize the task header date area. */
  'head-date'?: SlotProps<TaskHeadDaySlotScope>
}
