import {
  computed,
  watch
} from 'vue'

import {
  createDayList,
  createNativeLocaleFormatter,
  getDayIdentifier,
  getEndOfWeek,
  getStartOfWeek,
  getEndOfMonth,
  getStartOfMonth,
  validateNumber
} from '../utils/Timestamp.js'

export const useMonthProps = {
  view: {
    type: String,
    validator: v => [ 'month', 'picker', 'strip' ].includes(v),
    default: 'month'
  },
  dayHeight: {
    type: [ Number, String ],
    default: 0,
    validator: validateNumber
  },
  dayStyle: {
    type: Function,
    default: null
  },
  dayClass: {
    type: Function,
    default: null
  },
  dayPadding: String,
  minWeeks: {
    type: [ Number, String ],
    validator: validateNumber,
    default: 1
  },
  shortMonthLabel: Boolean,
  showWorkWeeks: Boolean,
  showMonthLabel: {
    type: Boolean,
    default: true
  },
  showDayOfYearLabel: Boolean,
  enableOutsideDays: Boolean,
  noOutsideDays: Boolean,
  hover: Boolean,
  miniMode: {
    type: [ Boolean, String ],
    validator: v => [ true, false, 'auto' ].includes(v)
  },
  breakpoint: {
    type: [ Number, String ],
    default: 'md',
    validator: v => [ 'xs', 'sm', 'md', 'lg', 'xl' ].includes(v) || validateNumber(v)
  },
  monthLabelSize: {
    type: String,
    default: 'sm',
    validator: v => [ 'xxs', 'xs', 'sm', 'md', 'lg', 'xl', 'xxl' ].includes(v) || (!!v && v.length > 0)
  },
  dayMinHeight: {
    type: [ Number, String ],
    default: 0,
    validator: validateNumber
  }
}

export default function (props, emit, {
  weekdaySkips,
  times,
  parsedStart,
  parsedEnd,
  size,
  headerColumnRef
}) {
  const parsedMinWeeks = computed(() => parseInt(props.minWeeks, 10))
  const parsedMinDays = computed(() => parsedMinWeeks.value * props.weekdays.length)
  const parsedMonthStart = computed(() => __getStartOfWeek(__getStartOfMonth(parsedStart.value)))
  const parsedMonthEnd = computed(() => __getEndOfWeek(__getEndOfMonth(parsedEnd.value)))
  const parsedCellWidth = computed(() => {
    let width = 0
    if (props.cellWidth) {
      width = props.cellWidth
    }
    else if (size.width > 0 && headerColumnRef.value) {
      width = headerColumnRef.value.offsetWidth / props.weekdays.length
    }
    return width + 1 // for border
  })

  /**
   * Returns the days of the specified month
   */
  const days = computed(() => {
    return createDayList(
      parsedMonthStart.value,
      parsedMonthEnd.value,
      times.today,
      weekdaySkips.value,
      props.disabledBefore,
      props.disabledAfter,
      props.disabledWeekdays,
      props.disabledDays,
      Number.MAX_SAFE_INTEGER,
      parsedMinDays.value
    )
  })

  /**
   * Returns the first week of the month for calcaulating the weekday headers
   */
  const todayWeek = computed(() => {
    const day = days.value[ 0 ]
    const start = __getStartOfWeek(day)
    const end = __getEndOfWeek(day)

    return createDayList(
      start,
      end,
      day,
      weekdaySkips,
      props.disabledBefore,
      props.disabledAfter,
      props.disabledWeekdays,
      props.disabledDays,
      props.weekdays.length,
      props.weekdays.length
    )
  })

  /**
   * Returns a function that uses the locale property
   * The function takes a timestamp and a boolean (to indicate short format)
   * and returns a formatted month name from the browser
   */
  const monthFormatter = computed(() => {
    const longOptions = { timeZone: 'UTC', month: 'long' }
    const shortOptions = { timeZone: 'UTC', month: 'short' }

    return createNativeLocaleFormatter(
      props.locale,
      (_tms, short) => (short ? shortOptions : longOptions)
    )
  })

  const parsedBreakpoint = computed(() => {
    switch (props.breakpoint) {
      case 'xs': return 300
      case 'sm': return 350
      case 'md': return 400
      case 'lg': return 450
      case 'xl': return 500
      default: return parseInt(props.breakpoint, 10)
    }
  })

  const parsedMonthLabelSize = computed(() => {
    switch (props.monthLabelSize) {
      case 'xxs': return '8px'
      case 'xs': return '10px'
      case 'sm': return '12px'
      case 'md': return '14px'
      case 'lg': return '16px'
      case 'xl': return '18px'
      case 'xxl': return '20px'
      default: return props.monthLabelSize
    }
  })

  let firstTime = true
  const isMiniMode = computed(() => {
    const val = props.miniMode === true
    || (
      props.miniMode === 'auto'
      && props.breakpoint !== void 0
      && size.width < parsedBreakpoint.value
    )
    if (firstTime === true) {
      firstTime = false
      emit('mini-mode', val)
    }
    return val
  })

  watch(isMiniMode, val => {
    emit('mini-mode', val)
  })

  /**
   * Returns a Timestamp of the start of the week
   * @param {Timestamp} day The day in which to find the start of the week
   */
  function __getStartOfWeek (day) {
    return getStartOfWeek(day, props.weekdays, times.today)
  }

  /**
   * Returns a Timestamp of the end of the week
   * @param {Timestamp} day The day in which to find the end of the week
   */
  function __getEndOfWeek (day) {
    return getEndOfWeek(day, props.weekdays, times.today)
  }

  /**
   * Returns a Timestamp of the start of the month
   * @param {Timestamp} day The day in which to find the start of the month
   */
  function __getStartOfMonth (day) {
    return getStartOfMonth(day)
  }

  /**
   * Returns a Timestamp of the end of the month
   * @param {Timestamp} day The day in which to find the end of the month
   */
  function __getEndOfMonth (day) {
    return getEndOfMonth(day)
  }

  /**
   * Returns boolean if the passed Timestamp is an outside day
   * @param {Timestamp} day The day to check if is deemed an outside day
   */
  function isOutside (day) {
    const dayIdentifier = getDayIdentifier(day)

    return dayIdentifier < getDayIdentifier(parsedStart.value)
      || dayIdentifier > getDayIdentifier(parsedEnd.value)
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
    isOutside
  }
}
