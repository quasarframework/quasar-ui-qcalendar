import { computed, Ref, PropType } from 'vue'
import {
  validateTimestamp,
  parseTimestamp,
  parsed,
  createNativeLocaleFormatter,
  getStartOfWeek,
  getEndOfWeek,
  getDayIdentifier,
  today,
  Timestamp,
} from '../utils/Timestamp'

// Define props interface
export interface CommonProps {
  modelValue: string
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
  disabledDays?: string[]
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

const isValidFocusType = (v: string[]): boolean =>
  v.every((type) =>
    ['day', 'date', 'weekday', 'interval', 'time', 'resource', 'task'].includes(type),
  )

// Define prop types with validators
export const useCommonProps = {
  modelValue: {
    type: String,
    default: today(),
    validator: (v: string): boolean => v === '' || validateTimestamp(v),
  },
  weekdays: {
    type: Array as () => number[],
    default: (): number[] => [0, 1, 2, 3, 4, 5, 6],
  },
  dateType: {
    type: String as () => 'round' | 'rounded' | 'square',
    default: 'round',
    validator: (v: string): boolean => ['round', 'rounded', 'square'].includes(v),
  },
  weekdayAlign: {
    type: String as () => 'left' | 'center' | 'right',
    default: 'center',
    validator: (v: string): boolean => ['left', 'center', 'right'].includes(v),
  },
  dateAlign: {
    type: String as () => 'left' | 'center' | 'right',
    default: 'center',
    validator: (v: string): boolean => ['left', 'center', 'right'].includes(v),
  },
  bordered: Boolean,
  dark: Boolean,
  noAria: Boolean,
  noActiveDate: Boolean,
  noHeader: Boolean,
  noScroll: Boolean,
  shortWeekdayLabel: Boolean,
  noDefaultHeaderText: Boolean,
  noDefaultHeaderBtn: Boolean,
  minWeekdayLabel: {
    type: [Number, String] as PropType<number | string>,
    default: 1,
  },
  weekdayBreakpoints: {
    type: Array as () => number[],
    default: (): number[] => [75, 35],
    validator: (v: number[]): boolean => v.length === 2,
  },
  locale: {
    type: String,
    default: 'en-US',
  },
  animated: Boolean,
  transitionPrev: {
    type: String,
    default: 'slide-right',
  },
  transitionNext: {
    type: String,
    default: 'slide-left',
  },
  disabledDays: Array as () => string[],
  disabledBefore: String,
  disabledAfter: String,
  disabledWeekdays: {
    type: Array as () => number[],
    default: (): string[] | Set<string> => [],
  },
  dragEnterFunc: Function as PropType<(_event: Event, _type: string, _scope: any) => boolean>,
  dragOverFunc: Function as PropType<(_event: Event, _type: string, _scope: any) => boolean>,
  dragLeaveFunc: Function as PropType<(_event: Event, _type: string, _scope: any) => boolean>,
  dropFunc: Function as PropType<(_event: Event, _type: string, _scope: any) => boolean>,
  selectedDates: {
    type: [Array, Set] as PropType<string[] | Set<string>>,
    default: (): string[] | Set<string> => [],
  },
  selectedStartEndDates: {
    type: Array as () => string[],
    default: (): string[] => [],
  },
  hoverable: Boolean,
  focusable: Boolean,
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
  dayFormatter: Ref<ReturnType<typeof createNativeLocaleFormatter>>
  weekdayFormatter: Ref<ReturnType<typeof createNativeLocaleFormatter>>
  ariaDateFormatter: Ref<ReturnType<typeof createNativeLocaleFormatter>>
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
  // eslint-disable-next-line no-unused-vars
  dayStyleDefault: ({ scope }: { scope: any }) => {}
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

  const dayFormatter = computed(() =>
    createNativeLocaleFormatter(props.locale, () => ({
      timeZone: 'UTC',
      day: 'numeric',
    })),
  )

  const weekdayFormatter = computed(() =>
    createNativeLocaleFormatter(props.locale, (_tms, short) => ({
      timeZone: 'UTC',
      weekday: short ? 'short' : 'long',
    })),
  )

  const ariaDateFormatter = computed(() =>
    createNativeLocaleFormatter(props.locale, () => ({
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
      'q-disabled-day disabled': timestamp.disabled === true,
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
   * This function returns `undefined`, which means that no additional styles will be applied to the day.
   */
  function dayStyleDefault(): {} {
    return {}
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
  }
}
