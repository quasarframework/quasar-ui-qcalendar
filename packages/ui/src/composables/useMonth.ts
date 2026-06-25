import { computed, watch, Ref, EmitFn, ComputedRef, PropType } from 'vue'
import {
  createDayList,
  createNativeLocaleFormatterUTC,
  getDayIdentifier,
  getEndOfWeek,
  getStartOfWeek,
  getEndOfMonth,
  getStartOfMonth,
  validateNumber,
  type Timestamp,
} from '@timestamp-js/core'

import { CommonProps } from './useCommon'
import { CellWidthProps } from './useCellWidth'
import { Scope } from './useInterval'

// Define props interface
export interface MonthProps {
  dayHeight: number | string
  dayMinHeight: number | string
  dayStyle?: (_scope: Scope) => any
  dayClass?: (_scope: Scope) => string
  weekdayStyle?: (_scope: Scope) => any
  weekdayClass?: (_scope: Scope) => string
  dayPadding?: string
  minWeeks: number | string
  shortMonthLabel: boolean
  showWorkWeeks: boolean
  showMonthLabel: boolean
  showDayOfYearLabel: boolean
  enableOutsideDays: boolean
  noOutsideDays: boolean
  hover: boolean
  miniMode?: boolean | 'auto'
  breakpoint: number | string
  monthLabelSize: string
}

// Define prop types with validators
export const useMonthProps = {
  /** Height in pixels or CSS units for each month day cell. */
  dayHeight: {
    type: [Number, String],
    default: 0,
    validator: (v: any): boolean => validateNumber(v),
  },
  /** Minimum height in pixels or CSS units for each month day cell. */
  dayMinHeight: {
    type: [Number, String],
    default: 0,
    validator: (v: any): boolean => validateNumber(v),
  },
  /** Function that returns inline styles for month day cells. */
  dayStyle: Function as PropType<MonthProps['dayStyle']>,
  /** Function that returns CSS classes for month day cells. */
  dayClass: Function as PropType<MonthProps['dayClass']>,
  /** Function that returns inline styles for weekday header cells. */
  weekdayStyle: Function as PropType<MonthProps['weekdayStyle']>,
  /** Function that returns CSS classes for weekday header cells. */
  weekdayClass: Function as PropType<MonthProps['weekdayClass']>,
  /** Padding applied inside month day cells. */
  dayPadding: String,
  /** Minimum number of weeks rendered by the month view. */
  minWeeks: {
    type: [Number, String],
    default: 1,
    validator: (v: any): boolean => validateNumber(v),
  },
  /** Uses shortened month labels. */
  shortMonthLabel: Boolean,
  /** Shows ISO work week labels. */
  showWorkWeeks: Boolean,
  /** Shows the month label. */
  showMonthLabel: {
    type: Boolean,
    default: true,
  },
  /** Shows the day-of-year label for each day. */
  showDayOfYearLabel: Boolean,
  /** Enables rendering days outside the active month. */
  enableOutsideDays: Boolean,
  /** Hides days outside the active month. */
  noOutsideDays: Boolean,
  /** Enables hover state tracking for month day cells. */
  hover: Boolean,
  /** Forces mini mode or lets mini mode follow the configured breakpoint. */
  miniMode: {
    type: [Boolean, String] as PropType<MonthProps['miniMode']>,
    validator: (v: any): boolean => [true, false, 'auto'].includes(v),
  },
  /** Breakpoint used when `mini-mode` is set to `auto`. */
  breakpoint: {
    type: [Number, String],
    default: 'md',
    validator: (v: any): boolean => ['xs', 'sm', 'md', 'lg', 'xl'].includes(v) || validateNumber(v),
  },
  /** Size token used for month labels. */
  monthLabelSize: {
    type: String,
    default: 'sm',
    validator: (v: any): boolean =>
      ['xxs', 'xs', 'sm', 'md', 'lg', 'xl', 'xxl'].includes(v) || (!!v && v.length > 0),
  },
}

interface UseMonthReturn {
  parsedCellWidth: ComputedRef<number>
  parsedMinWeeks: ComputedRef<number>
  parsedMinDays: ComputedRef<number>
  parsedMonthStart: ComputedRef<Timestamp>
  parsedMonthEnd: ComputedRef<Timestamp>
  parsedBreakpoint: ComputedRef<number>
  parsedMonthLabelSize: ComputedRef<string>
  days: Ref<Timestamp[]>
  todayWeek: Ref<Timestamp[]>
  isMiniMode: ComputedRef<boolean>
  monthFormatter: Ref<ReturnType<typeof createNativeLocaleFormatterUTC>>
  isOutside: (_timestamp: Timestamp) => boolean
}

// Define the function
export default function useMonth(
  props: MonthProps & CommonProps & CellWidthProps,
  emit: EmitFn<{ 'mini-mode': [boolean] }>,
  {
    times,
    parsedStart,
    parsedEnd,
    size,
    headerColumnRef,
  }: {
    times: { today: Timestamp }
    parsedStart: Ref<Timestamp>
    parsedEnd: Ref<Timestamp>
    size: { width: number }
    headerColumnRef: Ref<{ offsetWidth: number } | null>
  },
): UseMonthReturn {
  const parsedMinWeeks = computed((): number => parseInt(props.minWeeks as string, 10))
  const parsedMinDays = computed((): number => parsedMinWeeks.value * props.weekdays.length)
  const parsedMonthStart = computed(
    (): Timestamp => __getStartOfWeek(__getStartOfMonth(parsedStart.value)),
  )
  const parsedMonthEnd = computed((): Timestamp => __getEndOfWeek(__getEndOfMonth(parsedEnd.value)))

  const parsedCellWidth = computed((): number => {
    let width = 0
    if (props.cellWidth) {
      width = Number(props.cellWidth)
    } else if (size.width > 0 && headerColumnRef.value) {
      width = headerColumnRef.value.offsetWidth / props.weekdays.length
    }
    return width
  })

  /**
   * Returns the days of the specified month
   */
  const days = computed(() =>
    createDayList(
      parsedMonthStart.value,
      parsedMonthEnd.value,
      times.today,
      props.weekdays,
      props.disabledBefore,
      props.disabledAfter,
      props.disabledWeekdays,
      props.disabledDays,
      Number.MAX_SAFE_INTEGER,
      parsedMinDays.value,
    ),
  )

  /**
   * Returns the first week of the month for calculating the weekday headers
   */
  const todayWeek = computed(() => {
    const day = times.today
    const start = __getStartOfWeek(day)
    const end = __getEndOfWeek(day)

    return createDayList(
      start,
      end,
      day,
      props.weekdays,
      props.disabledBefore,
      props.disabledAfter,
      props.disabledWeekdays,
      props.disabledDays,
      props.weekdays.length,
      props.weekdays.length,
    )
  })

  /**
   * Returns a function that formats the month name using the locale
   */
  const monthFormatter = computed(() =>
    createNativeLocaleFormatterUTC(props.locale, (_tms, short) => ({
      timeZone: 'UTC',
      month: short ? 'short' : 'long',
    })),
  )

  const parsedBreakpoint = computed((): number => {
    switch (props.breakpoint) {
      case 'xs':
        return 300
      case 'sm':
        return 350
      case 'md':
        return 400
      case 'lg':
        return 450
      case 'xl':
        return 500
      default:
        return parseInt(props.breakpoint as string, 10)
    }
  })

  const parsedMonthLabelSize = computed((): string => {
    switch (props.monthLabelSize) {
      case 'xxs':
        return '.4em'
      case 'xs':
        return '.6em'
      case 'sm':
        return '.8em'
      case 'md':
        return '1.0em'
      case 'lg':
        return '1.2em'
      case 'xl':
        return '1.4em'
      case 'xxl':
        return '1.6em'
      default:
        return props.monthLabelSize
    }
  })

  let firstTime = true
  const isMiniMode = computed((): boolean => {
    const val =
      props.miniMode === true ||
      (props.miniMode === 'auto' &&
        props.breakpoint !== void 0 &&
        size.width < parsedBreakpoint.value)
    if (firstTime) {
      firstTime = false
      emit('mini-mode', val)
    }
    return val
  })

  watch(isMiniMode, (val) => {
    emit('mini-mode', val)
  })

  /**
   * Returns the start of the week for the given day.
   *
   * @param day - The day to get the start of the week for.
   * @returns The timestamp for the start of the week.
   */
  function __getStartOfWeek(day: Timestamp): Timestamp {
    return getStartOfWeek(day, props.weekdays, times.today)
  }

  /**
   * Returns the end of the week for the given day.
   *
   * @param day - The day to get the end of the week for.
   * @returns The timestamp for the end of the week.
   */
  function __getEndOfWeek(day: Timestamp): Timestamp {
    return getEndOfWeek(day, props.weekdays, times.today)
  }

  /**
   * Returns the start of the month for the given day.
   *
   * @param day - The day to get the start of the month for.
   * @returns The timestamp for the start of the month.
   */
  function __getStartOfMonth(day: Timestamp): Timestamp {
    return getStartOfMonth(day)
  }

  /**
   * Returns the end of the month for the given day.
   *
   * @param day - The day to get the end of the month for.
   * @returns The timestamp for the end of the month.
   */
  function __getEndOfMonth(day: Timestamp): Timestamp {
    return getEndOfMonth(day)
  }

  /**
   * Checks if the given day is outside the current month's range.
   *
   * @param day - The day to check.
   * @returns `true` if the day is outside the current month's range, `false` otherwise.
   */
  function isOutside(day: Timestamp): boolean {
    const dayIdentifier = getDayIdentifier(day)
    return (
      dayIdentifier < getDayIdentifier(parsedStart.value) ||
      dayIdentifier > getDayIdentifier(parsedEnd.value)
    )
  }

  return {
    parsedCellWidth,
    parsedMinWeeks,
    parsedMinDays,
    parsedMonthStart,
    parsedMonthEnd,
    parsedBreakpoint,
    parsedMonthLabelSize,
    days,
    todayWeek,
    isMiniMode,
    monthFormatter,
    isOutside,
  }
}
