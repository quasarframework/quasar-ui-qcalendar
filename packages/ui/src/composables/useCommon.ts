import { computed, type Ref, type PropType } from 'vue'
import {
  validateTimestamp,
  parseTimestamp,
  parsed,
  createNativeLocaleFormatterUTC,
  gregorianCalendar,
  getStartOfWeek,
  getEndOfWeek,
  getDayIdentifier,
  today,
  type CalendarSystem,
  type DisabledDays,
  type Timestamp,
  type TimestampClass,
  type TimestampStyle,
} from '@timestamp-js/core'

import { isGregorianCalendar, toCalendarTimestamp } from '../utils/calendarSystem'

// Define props interface
export interface CommonProps {
  modelValue: string
  calendarSystem: CalendarSystem
  weekdays: number[]
  dateType: 'round' | 'rounded' | 'square'
  weekdayAlign: 'left' | 'center' | 'right'
  dateAlign: 'left' | 'center' | 'right'
  bordered: boolean
  dark: boolean
  noAria: boolean
  noActiveDate: boolean
  noHeader: boolean
  noScroll: boolean
  shortWeekdayLabel: boolean
  noDefaultHeaderText: boolean
  noDefaultHeaderBtn: boolean
  minWeekdayLabel: number | string
  weekdayBreakpoints: number[]
  locale: string
  animated: boolean
  transitionPrev: string
  transitionNext: string
  disabledDays?: DisabledDays
  disabledBefore?: string
  disabledAfter?: string
  disabledWeekdays?: number[]
  dragEnterFunc?: (_event: Event, _type: string, _scope: any) => boolean
  dragOverFunc?: (_event: Event, _type: string, _scope: any) => boolean
  dragLeaveFunc?: (_event: Event, _type: string, _scope: any) => boolean
  dropFunc?: (_event: Event, _type: string, _scope: any) => boolean
  selectedDates: string[] | Set<string>
  selectedStartEndDates: string[]
  hoverable: boolean
  focusable: boolean
  focusType: ('day' | 'date' | 'weekday' | 'interval' | 'time' | 'resource' | 'task')[]
}

export type FocusType = CommonProps['focusType'][number]

const isValidFocusType = (v: string[]): boolean =>
  v.every((type) =>
    ['day', 'date', 'weekday', 'interval', 'time', 'resource', 'task'].includes(type),
  )

export function isFocusableType(
  props: Pick<CommonProps, 'focusable' | 'focusType'>,
  type: FocusType,
  enabled = true,
): boolean {
  return enabled === true && props.focusable === true && props.focusType.includes(type)
}

export const isValidWeekdays = (v: unknown): boolean =>
  Array.isArray(v) === true &&
  v.length > 0 &&
  new Set(v).size === v.length &&
  v.every((weekday) => Number.isInteger(weekday) && weekday >= 0 && weekday <= 6)

// Define prop types with validators
export const useCommonProps = {
  /**
   * Date value used by `v-model`, formatted as `YYYY-MM-DD`.
   *
   * @category model
   */
  modelValue: {
    type: String,
    default: today(),
    validator: (v: string): boolean => v === '' || validateTimestamp(v),
  },
  /**
   * Calendar system used for month range math while keeping `model-value` and emitted dates Gregorian.
   *
   * @applicable month
   * @category behavior
   */
  calendarSystem: {
    type: Object as PropType<CalendarSystem>,
    default: (): CalendarSystem => gregorianCalendar,
  },
  /**
   * Weekday indexes shown by the calendar, where `0` is Sunday and `6` is Saturday.
   *
   * @category display
   */
  weekdays: {
    type: Array as PropType<number[]>,
    default: (): number[] => [0, 1, 2, 3, 4, 5, 6],
    validator: isValidWeekdays,
  },
  /**
   * Shape used for rendered date buttons.
   *
   * @category style
   */
  dateType: {
    type: String as () => 'round' | 'rounded' | 'square',
    default: 'round',
    validator: (v: string): boolean => ['round', 'rounded', 'square'].includes(v),
  },
  /**
   * Horizontal alignment for weekday labels.
   *
   * @category style
   */
  weekdayAlign: {
    type: String as () => 'left' | 'center' | 'right',
    default: 'center',
    validator: (v: string): boolean => ['left', 'center', 'right'].includes(v),
  },
  /**
   * Horizontal alignment for date labels.
   *
   * @category style
   */
  dateAlign: {
    type: String as () => 'left' | 'center' | 'right',
    default: 'center',
    validator: (v: string): boolean => ['left', 'center', 'right'].includes(v),
  },
  /**
   * Adds borders around calendar sections and cells.
   *
   * @category style
   */
  bordered: Boolean,
  /**
   * Forces dark mode styling.
   *
   * @category style
   */
  dark: Boolean,
  /**
   * Disables generated ARIA attributes.
   *
   * @category behavior
   */
  noAria: Boolean,
  /**
   * Hides the active date styling.
   *
   * @category behavior
   */
  noActiveDate: Boolean,
  /**
   * Hides the calendar header.
   *
   * @category display
   */
  noHeader: Boolean,
  /**
   * Disables internal scroll containers where supported.
   *
   * @category behavior
   */
  noScroll: Boolean,
  /**
   * Uses shortened weekday labels.
   *
   * @category display
   */
  shortWeekdayLabel: Boolean,
  /**
   * Hides the default header text.
   *
   * @category display
   */
  noDefaultHeaderText: Boolean,
  /**
   * Hides the default header button.
   *
   * @category display
   */
  noDefaultHeaderBtn: Boolean,
  /**
   * Minimum number of weekday label characters to display.
   *
   * @category display
   */
  minWeekdayLabel: {
    type: [Number, String] as PropType<number | string>,
    default: 1,
  },
  /**
   * Cell width breakpoints used to shorten weekday labels.
   *
   * @category layout
   */
  weekdayBreakpoints: {
    type: Array as () => number[],
    default: (): number[] => [75, 35],
    validator: (v: number[]): boolean => v.length === 2,
  },
  /**
   * BCP 47 locale used for date and weekday formatting.
   *
   * @category display
   */
  locale: {
    type: String,
    default: 'en-US',
  },
  /**
   * Enables animated transitions between calendar ranges.
   *
   * @category behavior
   */
  animated: Boolean,
  /**
   * Transition name used when moving to the previous range.
   *
   * @category behavior
   * @example transition-prev="slide-right"
   * @example transition-prev="fade"
   * @example transition-prev="jump-down"
   */
  transitionPrev: {
    type: String,
    default: 'slide-right',
  },
  /**
   * Transition name used when moving to the next range.
   *
   * @category behavior
   * @example transition-next="slide-left"
   * @example transition-next="fade"
   * @example transition-next="jump-up"
   */
  transitionNext: {
    type: String,
    default: 'slide-left',
  },
  /**
   * Explicit disabled day definitions.
   *
   * @category behavior
   */
  disabledDays: Array as PropType<DisabledDays>,
  /**
   * Disables dates before this `YYYY-MM-DD` value.
   *
   * @category behavior
   */
  disabledBefore: String,
  /**
   * Disables dates after this `YYYY-MM-DD` value.
   *
   * @category behavior
   */
  disabledAfter: String,
  /**
   * Weekday indexes that should be disabled.
   *
   * @category behavior
   */
  disabledWeekdays: {
    type: Array as () => number[],
    default: (): string[] | Set<string> => [],
  },
  /**
   * Drag-enter guard called before a dragged item enters a calendar target.
   *
   * @category behavior
   */
  dragEnterFunc: Function as PropType<(_event: Event, _type: string, _scope: any) => boolean>,
  /**
   * Drag-over guard called while a dragged item is over a calendar target.
   *
   * @category behavior
   */
  dragOverFunc: Function as PropType<(_event: Event, _type: string, _scope: any) => boolean>,
  /**
   * Drag-leave guard called before a dragged item leaves a calendar target.
   *
   * @category behavior
   */
  dragLeaveFunc: Function as PropType<(_event: Event, _type: string, _scope: any) => boolean>,
  /**
   * Drop guard called before a dragged item is dropped on a calendar target.
   *
   * @category behavior
   */
  dropFunc: Function as PropType<(_event: Event, _type: string, _scope: any) => boolean>,
  /**
   * Selected date strings highlighted by the calendar.
   *
   * @category model
   */
  selectedDates: {
    type: [Array, Set] as PropType<string[] | Set<string>>,
    default: (): string[] | Set<string> => [],
  },
  /**
   * Start and end date strings used to highlight a selected range.
   *
   * @category model
   */
  selectedStartEndDates: {
    type: Array as () => string[],
    default: (): string[] => [],
  },
  /**
   * Applies hover styling to interactive calendar cells.
   *
   * @category behavior
   */
  hoverable: Boolean,
  /**
   * Makes supported calendar cells keyboard focusable.
   *
   * @category behavior
   */
  focusable: Boolean,
  /**
   * Calendar target types that can receive keyboard focus.
   *
   * @category behavior
   */
  focusType: {
    type: Array as () => ('day' | 'date' | 'weekday' | 'interval' | 'time' | 'resource' | 'task')[],
    default: (): ('day' | 'date' | 'weekday' | 'interval' | 'time' | 'resource' | 'task')[] => [
      'date',
    ],
    validator: isValidFocusType,
  },
}

export interface CommonReturn {
  parsedStart: Ref<Timestamp>
  parsedEnd: Ref<Timestamp>
  dayFormatter: Ref<(_timestamp: Timestamp, _short?: boolean) => string>
  weekdayFormatter: Ref<ReturnType<typeof createNativeLocaleFormatterUTC>>
  ariaDateFormatter: Ref<ReturnType<typeof createNativeLocaleFormatterUTC>>
  arrayHasDate: (_arr: string[], _timestamp: Timestamp) => boolean
  checkDays: (
    _arr: string[],
    _timestamp: Timestamp,
  ) => { firstDay: boolean; betweenDays: boolean; lastDay: boolean }
  getRelativeClasses: (
    _timestamp: Timestamp,
    _outside?: boolean,
    _selectedDays?: string[],
    _startEndDays?: string[],
    _hover?: boolean,
  ) => Record<string, boolean>
  startOfWeek: (_timestamp: Timestamp) => Timestamp
  endOfWeek: (_timestamp: Timestamp) => Timestamp
  dayStyleDefault: ({ scope }: { scope: any }) => TimestampStyle
  getDisabledStyle: (_timestamp: Timestamp) => TimestampStyle
}

export default function useCommon(
  props: CommonProps,
  {
    startDate,
    endDate,
    times,
  }: {
    startDate: Ref<string>
    endDate: Ref<string>
    times: { today: Timestamp }
  },
): CommonReturn {
  const parsedStart = computed((): Timestamp => parseTimestamp(startDate.value) as Timestamp)
  const parsedEnd = computed((): Timestamp => {
    if (endDate.value === '0000-00-00') {
      return getEndOfWeek(parsedStart.value, props.weekdays, times.today)
    }
    return (parseTimestamp(endDate.value) as Timestamp) || parsedStart.value
  })

  const dayFormatter = computed(() => {
    const formatter = createNativeLocaleFormatterUTC(props.locale, () => ({
      timeZone: 'UTC',
      day: 'numeric',
    }))

    return (timestamp: Timestamp, short?: boolean): string => {
      if (isGregorianCalendar(props.calendarSystem) === true) {
        return formatter(timestamp, short === true)
      }

      return String(toCalendarTimestamp(timestamp, props.calendarSystem).day)
    }
  })

  const weekdayFormatter = computed(() =>
    createNativeLocaleFormatterUTC(props.locale, (_tms, short) => ({
      timeZone: 'UTC',
      weekday: short ? 'short' : 'long',
    })),
  )

  const ariaDateFormatter = computed(() =>
    createNativeLocaleFormatterUTC(props.locale, () => ({
      timeZone: 'UTC',
      dateStyle: 'full',
    })),
  )

  function arrayHasDate(arr: string[], timestamp: Timestamp): boolean {
    return arr && arr.length > 0 && arr.includes(timestamp.date)
  }

  function checkDays(
    arr: string[],
    timestamp: Timestamp,
  ): { firstDay: boolean; betweenDays: boolean; lastDay: boolean } {
    const days = { firstDay: false, betweenDays: false, lastDay: false }
    if (arr.length === 2) {
      const current = getDayIdentifier(timestamp)
      const first = getDayIdentifier(parsed(arr[0]!) as Timestamp)
      const last = getDayIdentifier(parsed(arr[1]!) as Timestamp)
      days.firstDay = first === current
      days.lastDay = last === current
      days.betweenDays = first < current && last > current
    }
    return days
  }

  function getRelativeClasses(
    timestamp: Timestamp,
    outside = false,
    selectedDays: string[] = [],
    startEndDays: string[] = [],
    hover = false,
  ): Record<string, boolean> {
    const isSelected = arrayHasDate(selectedDays, timestamp)
    const { firstDay, lastDay, betweenDays } = checkDays(startEndDays, timestamp)

    return {
      'q-past-day':
        !firstDay && !betweenDays && !lastDay && !isSelected && !outside && !!timestamp.past,
      'q-future-day':
        !firstDay && !betweenDays && !lastDay && !isSelected && !outside && !!timestamp.future,
      'q-outside': outside,
      'q-current-day': !!timestamp.current,
      'q-selected': isSelected,
      'q-range-first': firstDay,
      'q-range': betweenDays,
      'q-range-last': lastDay,
      'q-range-hover': hover && (firstDay || lastDay || betweenDays),
      'q-disabled-day behavior': timestamp.disabled === true,
      ...normalizeClass(timestamp.disabledClass),
    }
  }

  /**
   * Calculates the start of the week for the given timestamp.
   *
   * @param timestamp - The timestamp to calculate the start of the week for.
   * @returns The timestamp representing the start of the week.
   */
  function startOfWeek(timestamp: Timestamp): Timestamp {
    return getStartOfWeek(timestamp, props.weekdays, times.today)
  }

  /**
   * Calculates the end of the week for the given timestamp.
   *
   * @param timestamp - The timestamp to calculate the end of the week for.
   * @returns The timestamp representing the end of the week.
   */
  function endOfWeek(timestamp: Timestamp): Timestamp {
    return getEndOfWeek(timestamp, props.weekdays, times.today)
  }

  /**
   * Provides the default style for a day in the calendar.
   *
   * This function applies behavior-day metadata styles when present.
   */
  function dayStyleDefault({ scope }: { scope: { timestamp?: Timestamp } }): TimestampStyle {
    return scope.timestamp !== undefined ? getDisabledStyle(scope.timestamp) : {}
  }

  function normalizeClass(className?: TimestampClass): Record<string, boolean> {
    if (typeof className === 'string') {
      return { [className]: true }
    }

    if (Array.isArray(className) === true) {
      return className.reduce<Record<string, boolean>>((classes, name) => {
        classes[name] = true

        return classes
      }, {})
    }

    return className ?? {}
  }

  function getDisabledStyle(timestamp: Timestamp): TimestampStyle {
    const style: TimestampStyle = { ...timestamp.disabledStyle }

    if (timestamp.disabledColor !== undefined) {
      style['--calendar-disabled-date-background'] = timestamp.disabledColor
      style['--calendar-disabled-date-background-dark'] = timestamp.disabledColor
    }

    if (timestamp.disabledTextColor !== undefined) {
      style['--calendar-disabled-date-color'] = timestamp.disabledTextColor
      style['--calendar-disabled-date-color-dark'] = timestamp.disabledTextColor
    }

    return style
  }

  return {
    parsedStart,
    parsedEnd,
    dayFormatter,
    weekdayFormatter,
    ariaDateFormatter,
    arrayHasDate,
    checkDays,
    getRelativeClasses,
    startOfWeek,
    endOfWeek,
    dayStyleDefault,
    getDisabledStyle,
  }
}
