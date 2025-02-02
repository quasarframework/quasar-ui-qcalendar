import { computed, watch, Ref, EmitFn, ComputedRef } from 'vue'
import {
  createDayList,
  createNativeLocaleFormatter,
  getDayIdentifier,
  getEndOfWeek,
  getStartOfWeek,
  getEndOfMonth,
  getStartOfMonth,
  validateNumber,
  Timestamp,
} from '../utils/Timestamp'

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
  miniMode: boolean | 'auto'
  breakpoint: number | string
  monthLabelSize: string
}

// Define prop types with validators
export const useMonthProps = {
  dayHeight: {
    type: [Number, String],
    default: 0,
    validator: (v: any): boolean => validateNumber(v),
  },
  dayMinHeight: {
    type: [Number, String],
    default: 0,
    validator: (v: any): boolean => validateNumber(v),
  },
  dayStyle: Function,
  dayClass: Function,
  weekdayStyle: Function,
  weekdayClass: Function,
  dayPadding: String,
  minWeeks: {
    type: [Number, String],
    default: 1,
    validator: (v: any): boolean => validateNumber(v),
  },
  shortMonthLabel: Boolean,
  showWorkWeeks: Boolean,
  showMonthLabel: {
    type: Boolean,
    default: true,
  },
  showDayOfYearLabel: Boolean,
  enableOutsideDays: Boolean,
  noOutsideDays: Boolean,
  hover: Boolean,
  miniMode: {
    type: [Boolean, String],
    validator: (v: any): boolean => [true, false, 'auto'].includes(v),
  },
  breakpoint: {
    type: [Number, String],
    default: 'md',
    validator: (v: any): boolean => ['xs', 'sm', 'md', 'lg', 'xl'].includes(v) || validateNumber(v),
  },
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
  monthFormatter: Ref<ReturnType<typeof createNativeLocaleFormatter>>
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
    createNativeLocaleFormatter(props.locale, (_tms, short) => ({
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
