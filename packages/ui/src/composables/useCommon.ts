import { computed, type Ref, type PropType } from 'vue'
import {
  validateTimestamp,
  createCalendarLocaleFormatterUTC,
  createNativeLocaleFormatterUTC,
  getCalendarDirection,
  gregorianCalendar,
  getCalendarLocale,
  getCalendarWeekdays,
  getCalendarEndOfWeek,
  getCalendarSelectionState,
  getCalendarStartOfWeek,
  type CalendarSystem,
  type DisabledDays,
  type Timestamp,
  type TimestampClass,
  type TimestampStyle,
} from '@timestamp-js/core'

import {
  isGregorianCalendar,
  parseCalendarTimestampSafe,
  toCalendarTimestamp,
} from '../utils/calendarSystem'

// Define props interface
export interface CommonProps {
  modelValue: string
  calendarSystem: CalendarSystem
  weekdays: number[]
  dir: 'ltr' | 'rtl' | 'auto'
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

export interface CalendarDefaultProps {
  calendarSystem?: CalendarSystem
}

// Define prop types with validators
export const useCommonProps = {
  /**
   * Date value used by `v-model`, formatted as `YYYY-MM-DD`.
   *
   * @category model
   */
  modelValue: {
    type: String,
    default: '',
    validator: (v: string): boolean => v === '' || validateTimestamp(v),
  },
  /**
   * Calendar system used for calendar math and component date values. Defaults to Gregorian.
   *
   * When an adapter is provided, date-bearing values are native to that adapter, and the
   * `locale`, `dir`, and `weekdays` props default from the adapter unless the app passes them.
   *
   * @category behavior
   * @example :calendar-system="islamicCivilCalendar"
   */
  calendarSystem: {
    type: Object as PropType<CalendarSystem>,
    default: (): CalendarSystem => gregorianCalendar,
  },
  /**
   * Weekday indexes shown by the calendar, where `0` is Sunday and `6` is Saturday. Defaults to
   * the active calendar system's recommended weekday order.
   *
   * Pass this prop explicitly to override the adapter default, such as rendering a five-day
   * work week.
   *
   * @category display
   * @example :weekdays="[1, 2, 3, 4, 5]"
   */
  weekdays: {
    type: Array as PropType<number[]>,
    default: (props: CalendarDefaultProps): number[] => getCalendarWeekdays(props.calendarSystem),
    validator: isValidWeekdays,
  },
  /**
   * Text direction used by the rendered calendar root. Defaults to the active calendar system's
   * recommended direction.
   *
   * Pass this prop explicitly to override the adapter default.
   *
   * @category display
   * @example dir="rtl"
   * @example dir="ltr"
   * @example dir="auto"
   */
  dir: {
    type: String as PropType<'ltr' | 'rtl' | 'auto'>,
    default: (props: CalendarDefaultProps): 'ltr' | 'rtl' =>
      getCalendarDirection(props.calendarSystem),
    validator: (v: string): boolean => ['ltr', 'rtl', 'auto'].includes(v),
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
   * BCP 47 locale used for date and weekday formatting. Defaults to the active calendar system's
   * recommended locale.
   *
   * Pass this prop explicitly to override the adapter default.
   *
   * @category display
   * @example locale="en-US"
   * @example locale="ar"
   * @example locale="hi-IN"
   */
  locale: {
    type: String,
    default: (props: CalendarDefaultProps): string => getCalendarLocale(props.calendarSystem),
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
  const parsedToday = computed(
    (): Timestamp => toCalendarTimestamp(times.today, props.calendarSystem),
  )
  const parsedStart = computed(
    (): Timestamp =>
      parseCalendarTimestampSafe(startDate.value, props.calendarSystem, parsedToday.value) ??
      parsedToday.value,
  )
  const parsedEnd = computed((): Timestamp => {
    if (endDate.value === '0000-00-00') {
      return getCalendarEndOfWeek(
        parsedStart.value,
        props.weekdays,
        props.calendarSystem,
        parsedToday.value,
      )
    }
    return (
      parseCalendarTimestampSafe(endDate.value, props.calendarSystem, parsedToday.value) ||
      parsedStart.value
    )
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

      return String(timestamp.day)
    }
  })

  const weekdayFormatter = computed(() =>
    createCalendarLocaleFormatterUTC(props.calendarSystem, props.locale, (_tms, short) => ({
      timeZone: 'UTC',
      weekday: short ? 'short' : 'long',
    })),
  )

  const ariaDateFormatter = computed(() =>
    createCalendarLocaleFormatterUTC(props.calendarSystem, props.locale, () => ({
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
    const selection = getCalendarSelectionState(
      timestamp,
      { selectedStartEndDates: arr },
      props.calendarSystem,
    )

    return {
      firstDay: selection.rangeFirst,
      betweenDays: selection.range,
      lastDay: selection.rangeLast,
    }
  }

  function getRelativeClasses(
    timestamp: Timestamp,
    outside = false,
    selectedDays: string[] = [],
    startEndDays: string[] = [],
    hover = false,
  ): Record<string, boolean> {
    const selection = getCalendarSelectionState(
      timestamp,
      {
        selectedDates: selectedDays,
        selectedStartEndDates: startEndDays,
      },
      props.calendarSystem,
    )
    const isSelected = selection.selectedDate
    const firstDay = selection.rangeFirst
    const betweenDays = selection.range
    const lastDay = selection.rangeLast

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
    return getCalendarStartOfWeek(
      timestamp,
      props.weekdays,
      props.calendarSystem,
      parsedToday.value,
    )
  }

  /**
   * Calculates the end of the week for the given timestamp.
   *
   * @param timestamp - The timestamp to calculate the end of the week for.
   * @returns The timestamp representing the end of the week.
   */
  function endOfWeek(timestamp: Timestamp): Timestamp {
    return getCalendarEndOfWeek(timestamp, props.weekdays, props.calendarSystem, parsedToday.value)
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
      style['--calendar-disabled-date-background-dark'] =
        `color-mix(in srgb, ${timestamp.disabledColor} 54%, var(--calendar-background-dark))`
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
