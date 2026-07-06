import { computed, watch, Ref, EmitFn, ComputedRef, PropType } from 'vue'
import {
  createCalendarDayList,
  getCalendarMonthFormatter,
  getCalendarEndOfMonth,
  getCalendarEndOfWeek,
  getCalendarStartOfMonth,
  getCalendarStartOfWeek,
  isOutsideCalendarMonth,
  validateNumber,
  type Timestamp,
} from '@timestamp-js/core'

import { CommonProps } from './useCommon'
import { CellWidthProps } from './useCellWidth'
import { Scope } from './useInterval'
import { toCalendarTimestamp } from '../utils/calendarSystem'

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
  /**
   * Height in pixels or CSS units for each month day cell.
   *
   * @category layout
   */
  dayHeight: {
    type: [Number, String],
    default: 0,
    validator: (v: any): boolean => validateNumber(v),
  },
  /**
   * Minimum height in pixels or CSS units for each month day cell.
   *
   * @category layout
   */
  dayMinHeight: {
    type: [Number, String],
    default: 0,
    validator: (v: any): boolean => validateNumber(v),
  },
  /**
   * Function that returns inline styles for month day cells.
   *
   * @category style
   */
  dayStyle: Function as PropType<MonthProps['dayStyle']>,
  /**
   * Function that returns CSS classes for month day cells.
   *
   * @category style
   */
  dayClass: Function as PropType<MonthProps['dayClass']>,
  /**
   * Function that returns inline styles for weekday header cells.
   *
   * @category style
   */
  weekdayStyle: Function as PropType<MonthProps['weekdayStyle']>,
  /**
   * Function that returns CSS classes for weekday header cells.
   *
   * @category style
   */
  weekdayClass: Function as PropType<MonthProps['weekdayClass']>,
  /**
   * Padding applied inside month day cells.
   *
   * @category layout
   */
  dayPadding: String,
  /**
   * Minimum number of weeks rendered by the month display.
   *
   * @category layout
   */
  minWeeks: {
    type: [Number, String],
    default: 1,
    validator: (v: any): boolean => validateNumber(v),
  },
  /**
   * Uses shortened month labels.
   *
   * @category display
   */
  shortMonthLabel: Boolean,
  /**
   * Shows ISO work week labels.
   *
   * @category display
   */
  showWorkWeeks: Boolean,
  /**
   * Shows the month label.
   *
   * @category display
   */
  showMonthLabel: {
    type: Boolean,
    default: true,
  },
  /**
   * Shows the day-of-year label for each day.
   *
   * @category display
   */
  showDayOfYearLabel: Boolean,
  /**
   * Enables rendering days outside the active month.
   *
   * @category display
   */
  enableOutsideDays: Boolean,
  /**
   * Hides days outside the active month.
   *
   * @category display
   */
  noOutsideDays: Boolean,
  /**
   * Enables hover behavior tracking for month day cells.
   *
   * @category behavior
   */
  hover: Boolean,
  /**
   * Forces mini mode or lets mini mode follow the configured breakpoint.
   *
   * @category layout
   */
  miniMode: {
    type: [Boolean, String] as PropType<MonthProps['miniMode']>,
    validator: (v: any): boolean => [true, false, 'auto'].includes(v),
  },
  /**
   * Breakpoint used when `mini-mode` is set to `auto`.
   *
   * @category layout
   */
  breakpoint: {
    type: [Number, String],
    default: 'md',
    validator: (v: any): boolean => ['xs', 'sm', 'md', 'lg', 'xl'].includes(v) || validateNumber(v),
  },
  /**
   * Size token used for month labels.
   *
   * @category style
   */
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
  monthFormatter: Ref<(_timestamp: Timestamp, _short?: boolean) => string>
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
  const calendarToday = computed(() => toCalendarTimestamp(times.today, props.calendarSystem))
  const parsedMonthStart = computed((): Timestamp => {
    const calendarStart = getCalendarStartOfMonth(parsedStart.value, props.calendarSystem)

    return getCalendarStartOfWeek(
      calendarStart,
      props.weekdays,
      props.calendarSystem,
      calendarToday.value,
    )
  })
  const parsedMonthEnd = computed((): Timestamp => {
    const calendarEnd = getCalendarEndOfMonth(parsedEnd.value, props.calendarSystem)

    return getCalendarEndOfWeek(
      calendarEnd,
      props.weekdays,
      props.calendarSystem,
      calendarToday.value,
    )
  })

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
    createCalendarDayList(
      parsedMonthStart.value,
      parsedMonthEnd.value,
      calendarToday.value,
      props.calendarSystem,
      {
        weekdays: props.weekdays,
        disabledBefore: props.disabledBefore,
        disabledAfter: props.disabledAfter,
        disabledWeekdays: props.disabledWeekdays,
        disabledDays: props.disabledDays,
        max: Number.MAX_SAFE_INTEGER,
        min: parsedMinDays.value,
      },
    ),
  )

  /**
   * Returns the first week of the month for calculating the weekday headers
   */
  const todayWeek = computed(() => {
    const day = calendarToday.value
    const start = getCalendarStartOfWeek(day, props.weekdays, props.calendarSystem, day)
    const end = getCalendarEndOfWeek(day, props.weekdays, props.calendarSystem, day)

    return createCalendarDayList(start, end, day, props.calendarSystem, {
      weekdays: props.weekdays,
      disabledBefore: props.disabledBefore,
      disabledAfter: props.disabledAfter,
      disabledWeekdays: props.disabledWeekdays,
      disabledDays: props.disabledDays,
      max: props.weekdays.length,
      min: props.weekdays.length,
    })
  })

  /**
   * Returns a function that formats the month name using the locale
   */
  const monthFormatter = computed(() => {
    const formatter = getCalendarMonthFormatter(props.calendarSystem)

    return (timestamp: Timestamp, short?: boolean): string =>
      formatter(timestamp.month, short === true ? 'short' : 'long', props.locale, timestamp.year)
  })

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
   * Checks if the given day is outside the current month's range.
   *
   * @param day - The day to check.
   * @returns `true` if the day is outside the current month's range, `false` otherwise.
   */
  function isOutside(day: Timestamp): boolean {
    return isOutsideCalendarMonth(day, parsedStart.value, props.calendarSystem)
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
