// interval composables
import { computed, Ref, PropType } from 'vue'
import {
  addToDate,
  createDayList,
  createIntervalList,
  createNativeLocaleFormatter,
  copyTimestamp,
  getDateTime,
  getDayTimeIdentifier,
  getStartOfWeek,
  getEndOfWeek,
  parsed,
  parseTime,
  // updateMinutes,
  updateRelative,
  validateNumber,
  Timestamp,
} from '../utils/Timestamp'

import { animVerticalScrollTo, animHorizontalScrollTo } from '../utils/scroll'
import { type CommonProps } from './useCommon'
import { type ColumnProps } from './useColumn'
import { type CellWidthProps } from './useCellWidth'
import { type TimesProps } from './useTimes'
import { type MaxDaysProps } from './useMaxDays'
import { type NavigationProps } from './useKeyboard'

export interface Scope {
  scope: any
}

export interface Resource {
  [key: string]: any
}

export interface ScopeForSlot {
  timestamp: Timestamp
  timeStartPos: (_time: string, _clamp?: boolean) => number | false
  timeDurationHeight: (_minutes: number) => number
  columnIndex?: number
  activeDate?: boolean
  disabled?: boolean
  shortWeekdayLabel?: boolean
  droppable?: boolean
}

export interface ScopeForSlotX {
  timestamp: Timestamp
  timeStartPosX: (_time: string, _clamp?: boolean) => number | false
  timeDurationWidth: (_minutes: number) => number
  index?: number
}

export interface IntervalProps
  extends CommonProps,
    ColumnProps,
    CellWidthProps,
    MaxDaysProps,
    TimesProps,
    NavigationProps {
  view: 'day' | 'week' | 'month' | 'month-interval'
  shortIntervalLabel?: boolean
  intervalHeight: number | string
  intervalMinutes: number | string
  intervalStart: number | string
  intervalCount: number | string
  intervalStyle?: (_scope: Scope) => any
  intervalClass?: (_scope: Scope) => string
  weekdayStyle?: (_scope: Scope) => any
  weekdayClass?: (_scope: Scope) => string
  showIntervalLabel?: (_timestamp: Timestamp) => any
  hour24Format?: boolean
  timeClicksClamped?: boolean
  dateHeader: 'stacked' | 'inline' | 'inverted'
}

export const useIntervalProps = {
  view: {
    type: String as PropType<IntervalProps['view']>,
    validator: (v: string) => ['day', 'week', 'month', 'month-interval'].includes(v),
    default: 'day',
  },
  shortIntervalLabel: Boolean,
  intervalHeight: {
    type: [Number, String] as PropType<IntervalProps['intervalHeight']>,
    default: 40,
    validator: validateNumber,
  },
  intervalMinutes: {
    type: [Number, String] as PropType<IntervalProps['intervalMinutes']>,
    default: 60,
    validator: validateNumber,
  },
  intervalStart: {
    type: [Number, String] as PropType<IntervalProps['intervalStart']>,
    default: 0,
    validator: validateNumber,
  },
  intervalCount: {
    type: [Number, String] as PropType<IntervalProps['intervalCount']>,
    default: 24,
    validator: validateNumber,
  },
  intervalStyle: {
    type: Function as PropType<IntervalProps['intervalStyle']>,
    default: null,
  },
  intervalClass: {
    type: Function as PropType<IntervalProps['intervalClass']>,
    default: null,
  },
  weekdayStyle: {
    type: Function as PropType<IntervalProps['weekdayStyle']>,
    default: null,
  },
  weekdayClass: {
    type: Function as PropType<IntervalProps['weekdayClass']>,
    default: null,
  },
  showIntervalLabel: {
    type: Function as PropType<IntervalProps['showIntervalLabel']>,
    default: null,
  },
  hour24Format: Boolean,
  timeClicksClamped: Boolean,
  dateHeader: {
    type: String as PropType<IntervalProps['dateHeader']>,
    default: 'stacked',
    validator: (v: string) => ['stacked', 'inline', 'inverted'].includes(v),
  },
} as const

export interface SchedulerProps extends IntervalProps {
  view: 'day' | 'week' | 'month' | 'month-interval'
  modelResources?: Resource[]
  resourceKey: string
  resourceLabel: string
  resourceHeight: number | string
  resourceMinHeight: number | string
  resourceStyle?: (_timestamp: Timestamp) => any
  resourceClass?: (_scope: Scope) => string
  weekdayStyle?: (_scope: Scope) => any
  weekdayClass?: (_scope: Scope) => string
  dayStyle?: (_scope: Scope) => any
  dayClass?: (_scope: Scope) => string
  dateHeader: 'stacked' | 'inline' | 'inverted'
}

export const useSchedulerProps = {
  view: {
    type: String as PropType<SchedulerProps['view']>,
    validator: (v: string) => ['day', 'week', 'month', 'month-interval'].includes(v),
    default: 'day',
  },
  modelResources: {
    type: Array as PropType<SchedulerProps['modelResources']>,
  },
  resourceKey: {
    type: String as PropType<SchedulerProps['resourceKey']>,
    default: 'id',
  },
  resourceLabel: {
    type: String as PropType<SchedulerProps['resourceLabel']>,
    default: 'label',
  },
  resourceHeight: {
    type: [Number, String] as PropType<SchedulerProps['resourceHeight']>,
    default: 0,
    validator: validateNumber,
  },
  resourceMinHeight: {
    type: [Number, String] as PropType<SchedulerProps['resourceMinHeight']>,
    default: 70,
    validator: validateNumber,
  },
  resourceStyle: {
    type: Function as PropType<SchedulerProps['resourceStyle']>,
    default: null,
  },
  resourceClass: {
    type: Function as PropType<SchedulerProps['resourceClass']>,
    default: null,
  },
  weekdayStyle: {
    type: Function as PropType<SchedulerProps['weekdayStyle']>,
    default: null,
  },
  weekdayClass: {
    type: Function as PropType<SchedulerProps['weekdayClass']>,
    default: null,
  },
  dayStyle: {
    type: Function as PropType<SchedulerProps['dayStyle']>,
    default: null,
  },
  dayClass: {
    type: Function as PropType<SchedulerProps['dayClass']>,
    default: null,
  },
  dateHeader: {
    type: String as PropType<SchedulerProps['dateHeader']>,
    default: 'stacked',
    validator: (v: string) => ['stacked', 'inline', 'inverted'].includes(v),
  },
} as const

export interface AgendaProps extends IntervalProps {
  view: 'day' | 'week' | 'month' | 'month-interval'
  leftColumnOptions?: any[] // Consider replacing `any[]` with a more specific type.
  rightColumnOptions?: any[]
  columnOptionsId?: string
  columnOptionsLabel?: string
  dayStyle?: (_scope: Scope) => any
  dayClass?: (_scope: Scope) => string
  dayHeight: number | string
  dayMinHeight: number | string
}

export const useAgendaProps = {
  view: {
    type: String as PropType<AgendaProps['view']>,
    validator: (v: string) => ['day', 'week', 'month', 'month-interval'].includes(v),
    default: 'day',
  },
  leftColumnOptions: {
    type: Array as PropType<AgendaProps['leftColumnOptions']>,
  },
  rightColumnOptions: {
    type: Array as PropType<AgendaProps['rightColumnOptions']>,
  },
  columnOptionsId: {
    type: String as PropType<AgendaProps['columnOptionsId']>,
  },
  columnOptionsLabel: {
    type: String as PropType<AgendaProps['columnOptionsLabel']>,
  },
  weekdayStyle: {
    type: Function as PropType<AgendaProps['weekdayStyle']>,
    default: null,
  },
  weekdayClass: {
    type: Function as PropType<AgendaProps['weekdayClass']>,
    default: null,
  },
  dayStyle: {
    type: Function as PropType<AgendaProps['dayStyle']>,
    default: null,
  },
  dayClass: {
    type: Function as PropType<AgendaProps['dayClass']>,
    default: null,
  },
  dateHeader: {
    type: String as PropType<AgendaProps['dateHeader']>,
    default: 'stacked',
    validator: (v: string) => ['stacked', 'inline', 'inverted'].includes(v),
  },
  dayHeight: {
    type: [Number, String] as PropType<AgendaProps['dayHeight']>,
    default: 0,
    validator: validateNumber,
  },
  dayMinHeight: {
    type: [Number, String] as PropType<AgendaProps['dayMinHeight']>,
    default: 40,
    validator: validateNumber,
  },
} as const

export interface ResourceProps extends IntervalProps {
  modelResources?: Resource[]
  resourceKey: string
  resourceLabel: string
  resourceHeight: number | string
  resourceMinHeight: number | string
  resourceStyle?: (_scope: any) => any
  resourceClass?: (_scope: any) => string
  cellWidth: number | string
  intervalHeaderHeight: number | string
  noSticky?: boolean
}

export const useResourceProps = {
  modelResources: {
    type: Array as PropType<ResourceProps['modelResources']>,
  },
  resourceKey: {
    type: String as PropType<ResourceProps['resourceKey']>,
    default: 'id',
  },
  resourceLabel: {
    type: String as PropType<ResourceProps['resourceLabel']>,
    default: 'label',
  },
  resourceHeight: {
    type: [Number, String] as PropType<ResourceProps['resourceHeight']>,
    default: 0,
    validator: validateNumber,
  },
  resourceMinHeight: {
    type: [Number, String] as PropType<ResourceProps['resourceMinHeight']>,
    default: 70,
    validator: validateNumber,
  },
  resourceStyle: {
    type: Function as PropType<ResourceProps['resourceStyle']>,
    default: null,
  },
  resourceClass: {
    type: Function as PropType<ResourceProps['resourceClass']>,
    default: null,
  },
  cellWidth: {
    type: [Number, String] as PropType<ResourceProps['cellWidth']>,
    default: 100,
  },
  intervalHeaderHeight: {
    type: [Number, String] as PropType<ResourceProps['intervalHeaderHeight']>,
    default: 20,
    validator: validateNumber,
  },
  noSticky: Boolean as PropType<ResourceProps['noSticky']>,
} as const

export interface UseIntervalReturn {
  parsedIntervalStart: Ref<number>
  parsedIntervalMinutes: Ref<number>
  parsedIntervalCount: Ref<number>
  parsedIntervalHeight: Ref<number>
  parsedCellWidth: Ref<number>
  parsedStartMinute: Ref<number>
  bodyHeight: Ref<number>
  bodyWidth: Ref<number>
  parsedWeekStart: Ref<Timestamp>
  parsedWeekEnd: Ref<Timestamp>
  days: Ref<Timestamp[]>
  intervals: Ref<Timestamp[][]>
  intervalFormatter: Ref<(_tms: Timestamp, _short: boolean) => string>
  ariaDateTimeFormatter: Ref<ReturnType<typeof createNativeLocaleFormatter>>
  arrayHasDateTime: (_arr: string[], _timestamp: Timestamp) => boolean
  checkIntervals: (
    _arr: string[],
    _timestamp: Timestamp,
  ) => { firstDay: boolean; betweenDays: boolean; lastDay: boolean }
  getIntervalClasses: (
    _interval: Timestamp,
    _selectedDays?: string[],
    _startEndDays?: string[],
  ) => Record<string, boolean>
  getResourceClasses: (
    _interval: Timestamp,
    _selectedDays: string[],
    _startEndDays: string[],
  ) => string[]
  showIntervalLabelDefault: (_interval: Timestamp) => boolean
  showResourceLabelDefault: (_resource: any) => void
  // eslint-disable-next-line no-unused-vars
  styleDefault: ({ scope }: { scope: any }) => {}
  getTimestampAtEventInterval: (
    _e: MouseEvent & TouchEvent,
    _day: Timestamp,
    _clamp?: boolean,
    _now?: Timestamp,
  ) => Timestamp
  getTimestampAtEvent: (
    _e: MouseEvent & TouchEvent,
    _day: Timestamp,
    _clamp?: boolean,
    _now?: Timestamp,
  ) => Timestamp
  getTimestampAtEventX: (
    _e: MouseEvent & TouchEvent,
    _day: Timestamp,
    _clamp?: boolean,
    _now?: Timestamp,
  ) => Timestamp
  getScopeForSlot: (_day: Timestamp, _columnIndex: number) => ScopeForSlot
  getScopeForSlotX: (_day: Timestamp, _columnIndex: number) => ScopeForSlotX
  scrollToTime: (_time: string, _duration?: number) => boolean
  scrollToTimeX: (_time: string, _duration?: number) => boolean
  timeDurationHeight: (_minutes: number) => number
  timeDurationWidth: (_minutes: number) => number
  heightToMinutes: (_height: number) => number
  widthToMinutes: (_width: number) => number
  timeStartPos: (_time: string, _clamp?: boolean) => number | false
  timeStartPosX: (_time: string, _clamp?: boolean) => number | false
}

export default function useInterval(
  props: IntervalProps & AgendaProps & SchedulerProps & ResourceProps & ColumnProps & CommonProps,
  {
    times,
    scrollArea,
    parsedStart,
    parsedEnd,
    maxDays,
    size,
    headerColumnRef,
  }: {
    times: { now: Timestamp; today: Timestamp }
    scrollArea: Ref<HTMLElement | null>
    parsedStart: Ref<Timestamp>
    parsedEnd: Ref<Timestamp>
    maxDays: Ref<number>
    size: { width: number; height: number }
    headerColumnRef: Ref<HTMLElement | null>
  },
): UseIntervalReturn {
  const parsedIntervalStart = computed(() => parseInt(String(props.intervalStart), 10))
  const parsedIntervalMinutes = computed(() => parseInt(String(props.intervalMinutes), 10))
  const parsedIntervalCount = computed(() => parseInt(String(props.intervalCount), 10))
  const parsedIntervalHeight = computed(() => parseFloat(String(props.intervalHeight)))
  const parsedCellWidth = computed(() => {
    let width = 0
    const columnCount = Number(props.columnCount)
    if (props.cellWidth) {
      width = Number(props.cellWidth)
    } else if (size.width > 0 && headerColumnRef.value) {
      width = headerColumnRef.value.offsetWidth / (columnCount > 1 ? columnCount : maxDays.value)
    }
    return width
  })
  const parsedStartMinute = computed(() => parsedIntervalStart.value * parsedIntervalMinutes.value)
  const bodyHeight = computed(() => parsedIntervalCount.value * parsedIntervalHeight.value)
  const bodyWidth = computed(() => parsedIntervalCount.value * parsedCellWidth.value)

  const parsedWeekStart = computed(() => startOfWeek(parsedStart.value))
  const parsedWeekEnd = computed(() => endOfWeek(parsedEnd.value))

  /**
   * Returns the days of the specified week
   */
  const days = computed(() => {
    return createDayList(
      parsedStart.value,
      parsedEnd.value,
      times.today,
      props.weekdays,
      props.disabledBefore,
      props.disabledAfter,
      props.disabledWeekdays,
      props.disabledDays,
      maxDays.value,
    )
  })

  /**
   * Returns an interval list for each day
   */
  const intervals = computed(() => {
    return days.value.map((day) =>
      createIntervalList(
        day,
        parsedIntervalStart.value,
        parsedIntervalMinutes.value,
        parsedIntervalCount.value,
        times.now,
      ),
    )
  })

  function startOfWeek(timestamp: Timestamp): Timestamp {
    return getStartOfWeek(timestamp, props.weekdays, times.today)
  }

  function endOfWeek(timestamp: Timestamp): Timestamp {
    return getEndOfWeek(timestamp, props.weekdays, times.today)
  }

  /**
   * Returns true if Timestamp is within passed Array of Timestamps
   * @param {Array.<Timestamp>} arr
   * @param {Timestamp} timestamp
   */
  function arrayHasDateTime(arr: string[], timestamp: Timestamp): boolean {
    return arr && arr.length > 0 && arr.includes(getDateTime(timestamp))
  }

  /**
   * Takes an array of 2 Timestamps and validates the passed Timestamp (second param)
   * @param {Array.<Timestamp>} arr
   * @param {Timestamp} timestamp
   * @returns {Object.<{firstDay: Boolean, betweenDays: Boolean, lastDay: Boolean}>}
   */
  function checkIntervals(
    arr: string[],
    timestamp: Timestamp,
  ): { firstDay: boolean; betweenDays: boolean; lastDay: boolean } {
    const days = {
      firstDay: false,
      betweenDays: false,
      lastDay: false,
    }

    // array must have two dates ('YYYY-MM-DD HH:MM') in it
    if (arr && arr.length === 2) {
      const current = getDayTimeIdentifier(timestamp)
      const first = getDayTimeIdentifier(parsed(arr[0]!) as Timestamp)
      const last = getDayTimeIdentifier(parsed(arr[1]!) as Timestamp)
      days.firstDay = first === current
      days.lastDay = last === current
      days.betweenDays = first < current && last > current
    }
    return days
  }

  function getIntervalClasses(
    interval: Timestamp,
    selectedDays: string[] = [],
    startEndDays: string[] = [],
  ): Record<string, boolean> {
    const isSelected = arrayHasDateTime(selectedDays, interval)
    const { firstDay, lastDay, betweenDays } = checkIntervals(startEndDays, interval)

    return {
      'q-selected': isSelected,
      'q-range-first': firstDay === true,
      'q-range': betweenDays === true,
      'q-range-last': lastDay === true,
      'q-disabled-interval disabled': interval.disabled === true,
    }
  }

  function getResourceClasses(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _interval: Timestamp,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _selectedDays: string[],
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _startEndDays: string[],
  ): string[] {
    return []
  }

  /**
   * Returns a function that uses the locale property
   * The function takes a timestamp and a boolean (to indicate short format)
   * and returns a formatted hour value from the browser
   */
  const intervalFormatter = computed(() => {
    const longOptions = {
      timeZone: 'UTC',
      hour12: !props.hour24Format,
      hour: '2-digit',
      minute: '2-digit',
    } as const
    const shortOptions = {
      timeZone: 'UTC',
      hour12: !props.hour24Format,
      hour: 'numeric',
      minute: '2-digit',
    } as const
    const shortHourOptions = {
      timeZone: 'UTC',
      hour12: !props.hour24Format,
      hour: 'numeric',
    } as const

    return createNativeLocaleFormatter(props.locale, (tms, short) =>
      short ? (tms.minute === 0 ? shortHourOptions : shortOptions) : longOptions,
    )
  })

  /**
   * Returns a function that uses the locale property
   * The function takes a timestamp and a boolean (to indicate short format)
   * and returns a fully formatted timestamp string from the browser
   * that can be read with screen readers.
   * Note: This value also contains the time.
   */
  const ariaDateTimeFormatter = computed(() => {
    const longOptions = { timeZone: 'UTC', dateStyle: 'full', timeStyle: 'short' } as const

    return createNativeLocaleFormatter(props.locale, (/*_tms*/) => longOptions)
  })

  /**
   * Determines whether the interval label should be displayed for the given timestamp.
   * The label is displayed if the timestamp is not the first interval and the minute is 0.
   * @param interval - The timestamp to check.
   * @returns `true` if the interval label should be displayed, `false` otherwise.
   */
  function showIntervalLabelDefault(interval: Timestamp): boolean {
    const first = intervals.value[0]![0]
    const isFirst = first!.hour === interval.hour && first!.minute === interval.minute
    return !isFirst && interval.minute === 0
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  function showResourceLabelDefault(_resource: any): void {
    //
  }

  /**
   * Returns an empty object.
   * This is a default style function that does not apply any styles.
   * @returns An empty object.
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  function styleDefault(_scope: Scope): {} {
    return {}
  }

  /**
   * Returns a Timestamp based on mouse click position on the calendar
   * Also handles touch events
   * This function is used for vertical intervals
   * @param {MouseEvent} e Browser MouseEvent
   * @param {Timestamp} day Timestamp associated with event
   * @param {Boolean} clamp Whether to clamp values to nearest interval
   * @param {Timestamp*} now Optional Timestamp for now date/time
   */
  function getTimestampAtEventInterval(
    e: MouseEvent & TouchEvent,
    day: Timestamp,
    clamp = false,
    now?: Timestamp,
  ): Timestamp {
    let timestamp = copyTimestamp(day)
    if (!e.currentTarget) {
      return timestamp
    }
    const bounds = (e.currentTarget as HTMLElement).getBoundingClientRect()
    const touchEvent = e
    const mouseEvent = e
    const touches = touchEvent.changedTouches || touchEvent.touches
    const clientY = touches && touches[0] ? touches[0].clientY : mouseEvent.clientY
    const addIntervals = (clientY - bounds.top) / parsedIntervalHeight.value
    const addMinutes = Math.floor(
      (clamp ? Math.floor(addIntervals) : addIntervals) * parsedIntervalMinutes.value,
    )

    if (addMinutes !== 0) {
      timestamp = addToDate(timestamp, { minute: addMinutes })
    }

    if (now) {
      timestamp = updateRelative(timestamp, now, true)
    }

    return timestamp
  }

  /**
   * Returns a Timestamp based on mouse click position on the calendar
   * Also handles touch events
   * This function is used for vertical intervals
   * @param {MouseEvent} e Browser MouseEvent
   * @param {Timestamp} day Timestamp associated with event
   * @param {Boolean} clamp Whether to clamp values to nearest interval
   * @param {Timestamp*} now Optional Timestamp for now date/time
   */
  function getTimestampAtEvent(
    e: MouseEvent & TouchEvent,
    day: Timestamp,
    clamp = false,
    now?: Timestamp,
  ): Timestamp {
    let timestamp = copyTimestamp(day)
    const bounds = (e.currentTarget as HTMLElement).getBoundingClientRect()
    const touchEvent = e
    const mouseEvent = e
    const touches = touchEvent.changedTouches || touchEvent.touches
    const clientY = touches && touches[0] ? touches[0].clientY : mouseEvent.clientY
    const addIntervals = (clientY - bounds.top) / parsedIntervalHeight.value
    const addMinutes = Math.floor(
      (clamp ? Math.floor(addIntervals) : addIntervals) * parsedIntervalMinutes.value,
    )

    if (addMinutes !== 0) {
      timestamp = addToDate(timestamp, { minute: addMinutes })
    }

    if (now) {
      timestamp = updateRelative(timestamp, now, true)
    }

    return timestamp
  }

  /**
   * Returns a Timestamp based on mouse click position on the calendar
   * Also handles touch events
   * This function is used for horizontal intervals
   * @param {MouseEvent} e Browser MouseEvent
   * @param {Timestamp} day Timestamp associated with event
   * @param {Boolean} clamp Whether to clamp values to nearest interval
   * @param {Timestamp*} now Optional Timestamp for now date/time
   */
  function getTimestampAtEventX(
    e: MouseEvent & TouchEvent,
    day: Timestamp,
    clamp = false,
    now?: Timestamp,
  ): Timestamp {
    let timestamp = copyTimestamp(day)
    if (!e.currentTarget) {
      return timestamp
    }
    const bounds = (e.currentTarget as HTMLElement).getBoundingClientRect()
    const touchEvent = e
    const mouseEvent = e
    const touches = touchEvent.changedTouches || touchEvent.touches
    const clientX = touches && touches[0] ? touches[0].clientX : mouseEvent.clientX
    const addIntervals = (clientX - bounds.left) / parsedCellWidth.value
    const addMinutes = Math.floor(
      (clamp ? Math.floor(addIntervals) : addIntervals) * parsedIntervalMinutes.value,
    )

    if (addMinutes !== 0) {
      timestamp = addToDate(timestamp, { minute: addMinutes })
    }

    if (now) {
      timestamp = updateRelative(timestamp, now, true)
    }

    return timestamp
  }

  /**
   * Returns the scope for the associated Timestamp
   * This function is used for vertical intervals
   * @param {Timestamp} timestamp
   * @param {Number} columnIndex
   */
  function getScopeForSlot(timestamp: Timestamp, columnIndex?: number): ScopeForSlot {
    const scope: {
      timestamp: Timestamp
      timeStartPos: (_time: string, _clamp?: boolean) => number | false
      timeDurationHeight: (_minutes: number) => number
      columnIndex?: number
    } = { timestamp, timeStartPos, timeDurationHeight }
    if (columnIndex !== undefined) {
      scope.columnIndex = columnIndex
    }
    return scope
  }

  /**
   * Returns the scope for the associated Timestamp
   * This function is used for horizontal intervals
   * @param {Timestamp} timestamp
   * @param {Number*} index
   */
  function getScopeForSlotX(timestamp: Timestamp, index: number): ScopeForSlotX {
    const scope: {
      timestamp: Timestamp
      timeStartPosX: (_time: string, _clamp?: boolean) => number | false
      timeDurationWidth: (_minutes: number) => number
      index?: number
    } = { timestamp: copyTimestamp(timestamp), timeStartPosX, timeDurationWidth }
    if (index !== undefined) {
      scope.index = index
    }
    return scope
  }

  /**
   * Forces the browser to scroll to the specified time
   * This function is used for vertical intervals
   * @param {String} time in format HH:MM
   * @param {Number} duration in milliseconds
   * @returns {boolean} Whether the scroll operation was successful
   */
  function scrollToTime(time: string, duration = 0): boolean {
    const y = timeStartPos(time)

    if (y === false || !scrollArea.value) {
      return false
    }

    animVerticalScrollTo(scrollArea.value, y, duration)

    return true
  }

  /**
   * Forces the browser to scroll to the specified time horizontally.
   * This function is used for horizontal intervals.
   * @param {String} time - The time to scroll to, in the format HH:MM.
   * @param {Number} [duration=0] - The duration of the scroll animation in milliseconds.
   * @returns {boolean} Whether the scroll operation was successful.
   */
  function scrollToTimeX(time: string, duration = 0): boolean {
    const x = timeStartPosX(time)

    if (x === false || !scrollArea.value) {
      return false
    }

    animHorizontalScrollTo(scrollArea.value, x, duration)

    return true
  }

  /**
   * Calculates the height of a time duration in the interval view.
   * @param {number} minutes - The number of minutes to calculate the height for.
   * @returns {number} The height of the time duration in pixels.
   */
  function timeDurationHeight(minutes: number): number {
    return (minutes / parsedIntervalMinutes.value) * parsedIntervalHeight.value
  }

  /**
   * Calculates the width of a time duration in the interval view.
   * @param {number} minutes - The number of minutes to calculate the width for.
   * @returns {number} The width of the time duration in pixels.
   */
  function timeDurationWidth(minutes: number): number {
    return (minutes / parsedIntervalMinutes.value) * parsedCellWidth.value
  }

  /**
   * Calculates the number of minutes represented by a given height in the interval view.
   * @param {number} height - The height in pixels to calculate the minutes for.
   * @returns {number} The number of minutes represented by the given height.
   */
  function heightToMinutes(height: number): number {
    return (height * parsedIntervalMinutes.value) / parsedIntervalHeight.value
  }

  /**
   * Calculates the number of minutes represented by a given width in the interval view.
   * @param {number} width - The width in pixels to calculate the minutes for.
   * @returns {number} The number of minutes represented by the given width.
   */
  function widthToMinutes(width: number): number {
    return (width * parsedIntervalMinutes.value) / parsedCellWidth.value
  }

  /**
   * Calculates the starting position (y-coordinate) of a time value in the interval view.
   * @param {string} time - The time value to calculate the starting position for.
   * @param {boolean} [clamp=true] - Whether to clamp the calculated position to the bounds of the interval view.
   * @returns {number|false} The starting position (y-coordinate) of the time value, or `false` if the time value is invalid.
   */
  function timeStartPos(time: string, clamp = true): number | false {
    const minutes = parseTime(time)
    if (minutes === false) return false

    const min = parsedStartMinute.value
    const gap = parsedIntervalCount.value * parsedIntervalMinutes.value
    const delta = (minutes - min) / gap
    let y = delta * bodyHeight.value

    if (clamp) {
      if (y < 0) {
        y = 0
      }
      if (y > bodyHeight.value) {
        y = bodyHeight.value
      }
    }

    return y
  }

  /**
   * Calculates the starting position (x-coordinate) of a time value in the interval view.
   * @param {string} time - The time value to calculate the starting position for.
   * @param {boolean} [clamp=true] - Whether to clamp the calculated position to the bounds of the interval view.
   * @returns {number|false} The starting position (x-coordinate) of the time value, or `false` if the time value is invalid.
   */
  function timeStartPosX(time: string, clamp = true): number | false {
    const minutes = parseTime(time)
    if (minutes === false) return false

    const min = parsedStartMinute.value
    const gap = parsedIntervalCount.value * parsedIntervalMinutes.value
    const delta = (minutes - min) / gap
    let x = delta * bodyWidth.value

    if (clamp) {
      if (x < 0) {
        x = 0
      }
      if (x > bodyWidth.value) {
        x = bodyWidth.value
      }
    }

    return x
  }

  return {
    parsedIntervalStart,
    parsedIntervalMinutes,
    parsedIntervalCount,
    parsedIntervalHeight,
    parsedCellWidth,
    parsedStartMinute,
    bodyHeight,
    bodyWidth,
    parsedWeekStart,
    parsedWeekEnd,
    days,
    intervals,
    intervalFormatter,
    ariaDateTimeFormatter,
    arrayHasDateTime,
    checkIntervals,
    getIntervalClasses,
    getResourceClasses,
    showIntervalLabelDefault,
    showResourceLabelDefault,
    styleDefault,
    getTimestampAtEventInterval,
    getTimestampAtEvent,
    getTimestampAtEventX,
    getScopeForSlot,
    getScopeForSlotX,
    scrollToTime,
    scrollToTimeX,
    timeDurationHeight,
    timeDurationWidth,
    heightToMinutes,
    widthToMinutes,
    timeStartPos,
    timeStartPosX,
  }
}
