import { computed, type Ref } from 'vue'
import {
  createCalendarDayList,
  parseTime,
  updateCalendarDisabled,
  updateCalendarFormatted,
  type Timestamp,
} from '@timestamp-js/core'

import {
  getCalendarScopeData,
  isOutsideCalendarMonth,
  toCalendarTimestamp,
  type CalendarScopeData,
} from '../utils/calendarSystem'
import { resolveCssLength } from '../utils/helpers'
import { type CommonProps } from './useCommon'
import { type ColumnProps } from './useColumn'
import { type CellWidthProps } from './useCellWidth'
import { type MaxDaysProps } from './useMaxDays'

export interface Scope {
  scope: any
}

export interface ScopeForSlot extends CalendarScopeData {
  /** Timestamp represented by the slot. */
  timestamp: Timestamp
  /** Helper that returns the vertical start position for a time. */
  timeStartPos: (_time: string, _clamp?: boolean) => number | false
  /** Helper that returns the vertical height for a duration. */
  timeDurationHeight: (_minutes: number) => number
  /** Zero-based rendered column index. */
  columnIndex?: number
  /** Whether the timestamp is the active date. */
  activeDate?: boolean
  /** Whether the slot content is disabled. */
  disabled?: boolean
  /** Whether the timestamp is outside the active month. */
  outside?: boolean
  /** Whether weekday labels are rendered in short form. */
  shortWeekdayLabel?: boolean
  /** Whether the slot can accept dropped content. */
  droppable?: boolean
}

export interface CalendarDaysProps extends CommonProps, ColumnProps, CellWidthProps, MaxDaysProps {}

export interface UseCalendarDaysReturn {
  days: Ref<Timestamp[]>
  parsedCellWidth: Ref<number>
  styleDefault: (_scope: Scope) => {}
  getScopeForSlot: (_day: Timestamp, _columnIndex?: number) => ScopeForSlot
}

const DEFAULT_INTERVAL_START = 0
const DEFAULT_INTERVAL_MINUTES = 60
const DEFAULT_INTERVAL_COUNT = 24
const DEFAULT_INTERVAL_HEIGHT = 40

// Agenda historically exposes interval-like helpers in several slot scopes even
// though it does not expose interval props. Keep those helpers deterministic.
export default function useCalendarDays(
  props: CalendarDaysProps,
  {
    times,
    parsedStart,
    parsedEnd,
    activeDate,
    maxDays,
    size,
    headerColumnRef,
  }: {
    times: { today: Timestamp }
    parsedStart: Ref<Timestamp>
    parsedEnd: Ref<Timestamp>
    activeDate?: Ref<Timestamp>
    maxDays: Ref<number>
    size: { width: number }
    headerColumnRef: Ref<HTMLElement | null>
  },
): UseCalendarDaysReturn {
  const parsedCellWidth = computed(() => {
    let width = 0
    const columnCount = Number(props.columnCount)
    if (props.cellWidth) {
      width = resolveCssLength(props.cellWidth, headerColumnRef.value)
    } else if (size.width > 0 && headerColumnRef.value) {
      width = headerColumnRef.value.offsetWidth / (columnCount > 1 ? columnCount : maxDays.value)
    }
    return width
  })

  const days = computed(() => {
    return createCalendarDayList(
      parsedStart.value,
      parsedEnd.value,
      toCalendarTimestamp(times.today, props.calendarSystem),
      props.calendarSystem,
      {
        weekdays: props.weekdays,
        disabledBefore: props.disabledBefore,
        disabledAfter: props.disabledAfter,
        disabledWeekdays: props.disabledWeekdays,
        disabledDays: props.disabledDays,
        max: maxDays.value,
      },
    )
  })

  function styleDefault(_scope: Scope): {} {
    return {}
  }

  function timeDurationHeight(minutes: number): number {
    return (minutes / DEFAULT_INTERVAL_MINUTES) * DEFAULT_INTERVAL_HEIGHT
  }

  function timeStartPos(time: string, clamp = true): number | false {
    const minutes = parseTime(time)
    if (minutes === false) return false

    const min = DEFAULT_INTERVAL_START * DEFAULT_INTERVAL_MINUTES
    const gap = DEFAULT_INTERVAL_COUNT * DEFAULT_INTERVAL_MINUTES
    const bodyHeight = DEFAULT_INTERVAL_COUNT * DEFAULT_INTERVAL_HEIGHT
    const delta = (minutes - min) / gap
    let y = delta * bodyHeight

    if (clamp) {
      if (y < 0) {
        y = 0
      }
      if (y > bodyHeight) {
        y = bodyHeight
      }
    }

    return y
  }

  function isOutsideActiveMonth(timestamp: Timestamp): boolean {
    const reference = activeDate?.value ?? parsedStart.value
    return isOutsideCalendarMonth(timestamp, reference, props.calendarSystem)
  }

  function getScopeForSlot(timestamp: Timestamp, columnIndex?: number): ScopeForSlot {
    const calendarTimestamp = toCalendarTimestamp(timestamp, props.calendarSystem)
    const formattedTimestamp = updateCalendarFormatted(calendarTimestamp, props.calendarSystem)
    const disabledTimestamp = updateCalendarDisabled(
      formattedTimestamp,
      props.disabledBefore,
      props.disabledAfter,
      props.disabledWeekdays,
      props.disabledDays,
      props.calendarSystem,
    )
    const outside = isOutsideActiveMonth(formattedTimestamp)
    const scope: ScopeForSlot = {
      timestamp: disabledTimestamp,
      ...getCalendarScopeData(disabledTimestamp, props.calendarSystem),
      timeStartPos,
      timeDurationHeight,
      outside,
      disabled:
        disabledTimestamp.disabled === true ||
        (outside === true && (props as { enableOutsideDays?: boolean }).enableOutsideDays !== true),
    }
    if (columnIndex !== undefined) {
      scope.columnIndex = columnIndex
    }
    return scope
  }

  return {
    days,
    parsedCellWidth,
    styleDefault,
    getScopeForSlot,
  }
}
