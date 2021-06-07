// interval composables
import { computed } from 'vue'
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
  updateMinutes,
  updateRelative,
  validateNumber
} from '../utils/Timestamp.js'

export const useIntervalProps = {
  view: {
    type: String,
    validator: v => [ 'day', 'week', 'month', 'month-interval' ].includes(v),
    default: 'day'
  },
  shortIntervalLabel: Boolean,
  intervalHeight: {
    type: [ Number, String ],
    default: 40,
    validator: validateNumber
  },
  intervalMinutes: {
    type: [ Number, String ],
    default: 60,
    validator: validateNumber
  },
  intervalStart: {
    type: [ Number, String ],
    default: 0,
    validator: validateNumber
  },
  intervalCount: {
    type: [ Number, String ],
    default: 24,
    validator: validateNumber
  },
  intervalStyle: {
    type: Function,
    default: null
  },
  intervalClass: {
    type: Function,
    default: null
  },
  weekdayStyle: {
    type: Function,
    default: null
  },
  weekdayClass: {
    type: Function,
    default: null
  },
  showIntervalLabel: {
    type: Function,
    default: null
  },
  hour24Format: Boolean,
  timeClicksClamped: Boolean,
  dateHeader: {
    type: String,
    default: 'stacked',
    validator: v => [ 'stacked', 'inline', 'inverted' ].includes(v)
  }
}

export const useSchedulerProps = {
  view: {
    type: String,
    validator: v => [ 'day', 'week', 'month', 'month-interval' ].includes(v),
    default: 'day'
  },
  modelResources: {
    type: Array
    // required: true
  },
  resourceKey: {
    type: [ String, Number ],
    default: 'id'
  },
  resourceLabel: {
    type: [ String, Number ],
    default: 'label'
  },
  resourceHeight: {
    type: [ Number, String ],
    default: 0,
    validator: validateNumber
  },
  resourceMinHeight: {
    type: [ Number, String ],
    default: 70,
    validator: validateNumber
  },
  resourceStyle: {
    type: Function,
    default: null
  },
  resourceClass: {
    type: Function,
    default: null
  },
  weekdayStyle: {
    type: Function,
    default: null
  },
  weekdayClass: {
    type: Function,
    default: null
  },
  dayStyle: {
    type: Function,
    default: null
  },
  dayClass: {
    type: Function,
    default: null
  },
  dateHeader: {
    type: String,
    default: 'stacked',
    validator: v => [ 'stacked', 'inline', 'inverted' ].includes(v)
  }
}

export const useAgendaProps = {
  view: {
    type: String,
    validator: v => [ 'day', 'week', 'month', 'month-interval' ].includes(v),
    default: 'day'
  },
  leftColumnOptions: {
    type: Array
  },
  rightColumnOptions: {
    type: Array
  },
  columnOptionsId: {
    type: String
  },
  columnOptionsLabel: {
    type: String
  },
  weekdayStyle: {
    type: Function,
    default: null
  },
  weekdayClass: {
    type: Function,
    default: null
  },
  dayStyle: {
    type: Function,
    default: null
  },
  dayClass: {
    type: Function,
    default: null
  },
  dateHeader: {
    type: String,
    default: 'stacked',
    validator: v => [ 'stacked', 'inline', 'inverted' ].includes(v)
  },
  dayHeight: {
    type: [ Number, String ],
    default: 0,
    validator: validateNumber
  },
  dayMinHeight: {
    type: [ Number, String ],
    default: 40,
    validator: validateNumber
  }
}

export const useResourceProps = {
  modelResources: {
    type: Array
    // required: true
  },
  resourceKey: {
    type: [ String, Number ],
    default: 'id'
  },
  resourceLabel: {
    type: [ String, Number ],
    default: 'label'
  },
  resourceHeight: {
    type: [ Number, String ],
    default: 0,
    validator: validateNumber
  },
  resourceMinHeight: {
    type: [ Number, String ],
    default: 70,
    validator: validateNumber
  },
  resourceStyle: {
    type: Function,
    default: null
  },
  resourceClass: {
    type: Function,
    default: null
  },
  cellWidth: {
    type: [ Number, String ],
    default: 100
  },
  intervalHeaderHeight: {
    type: [ Number, String ],
    default: 20,
    validator: validateNumber
  },
  noSticky: Boolean
}

export default function (props, {
  weekdaySkips,
  times,
  scrollArea,
  parsedStart,
  parsedEnd,
  maxDays,
  size,
  headerColumnRef
}) {
  const parsedIntervalStart = computed(() => parseInt(props.intervalStart, 10))
  const parsedIntervalMinutes = computed(() => parseInt(props.intervalMinutes, 10))
  const parsedIntervalCount = computed(() => parseInt(props.intervalCount, 10))
  const parsedIntervalHeight = computed(() => parseFloat(props.intervalHeight))
  const parsedCellWidth = computed(() => {
    let width = 0
    if (props.cellWidth) {
      width = props.cellWidth
    }
    else if (size.width > 0 && headerColumnRef.value) {
      width = headerColumnRef.value.offsetWidth / (props.columnCount > 1 ? props.columnCount : maxDays.value)
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
      weekdaySkips.value,
      props.disabledBefore,
      props.disabledAfter,
      props.disabledWeekdays,
      props.disabledDays,
      maxDays.value
    )
  })

  /**
   * Returns an interval list for each day
   */
  const intervals = computed(() => {
    return days.value.map(day => createIntervalList(
      day,
      parsedIntervalStart.value,
      parsedIntervalMinutes.value,
      parsedIntervalCount.value,
      times.now
    ))
  })

  function startOfWeek (timestamp) {
    return getStartOfWeek(timestamp, props.weekdays, times.today)
  }

  function endOfWeek (timestamp) {
    return getEndOfWeek(timestamp, props.weekdays, times.today)
  }

  /**
   * Returns true if Timestamp is within passed Array of Timestamps
   * @param {Array.<Timestamp>} arr
   * @param {Timestamp} timestamp
   */
  function arrayHasDateTime (arr, timestamp) {
    return arr && arr.length > 0 && arr.includes(getDateTime(timestamp))
  }

  /**
   * Takes an array of 2 Timestamps and validates the passed Timestamp (second param)
   * @param {Array.<Timestamp>} arr
   * @param {Timestamp} timestamp
   * @returns {Object.<{firstDay: Boolean, betweenDays: Boolean, lastDay: Boolean}>}
   */
  function checkIntervals (arr, timestamp) {
    const days = {
      firstDay: false,
      betweenDays: false,
      lastDay: false
    }

    // array must have two dates ('YYYY-MM-DD HH:MM') in it
    if (arr && arr.length === 2) {
      const current = getDayTimeIdentifier(timestamp)
      const first = getDayTimeIdentifier(parsed(arr[ 0 ]))
      const last = getDayTimeIdentifier(parsed(arr[ 1 ]))
      days.firstDay = first === current
      days.lastDay = last === current
      days.betweenDays = first < current && last > current
    }
    return days
  }

  function getIntervalClasses (interval, selectedDays = [], startEndDays = []) {
    const isSelected = arrayHasDateTime(selectedDays, interval)
    const { firstDay, lastDay, betweenDays } = checkIntervals(startEndDays, interval)

    return {
      'q-selected': isSelected,
      'q-range-first': firstDay === true,
      'q-range': betweenDays === true,
      'q-range-last': lastDay === true,
      'q-disabled-interval disabled': interval.disabled === true
    }
  }

  function getResourceClasses (interval, selectedDays = [], startEndDays = []) {
    return []
  }

  /**
   * Returns a function that uses the locale property
   * The function takes a timestamp and a boolean (to indicate short format)
   * and returns a formatted hour value from the browser
   */
  const intervalFormatter = computed(() => {
    const longOptions = { timeZone: 'UTC', hour12: !props.hour24Format, hour: '2-digit', minute: '2-digit' }
    const shortOptions = { timeZone: 'UTC', hour12: !props.hour24Format, hour: 'numeric', minute: '2-digit' }
    const shortHourOptions = { timeZone: 'UTC', hour12: !props.hour24Format, hour: 'numeric' }

    return createNativeLocaleFormatter(
      props.locale,
      (tms, short) => (short ? (tms.minute === 0 ? shortHourOptions : shortOptions) : longOptions)
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
    const longOptions = { timeZone: 'UTC', dateStyle: 'full', timeStyle: 'short' }

    return createNativeLocaleFormatter(
      props.locale,
      (_tms) => longOptions
    )
  })

  function showIntervalLabelDefault (interval) {
    const first = intervals.value[ 0 ][ 0 ]
    const isFirst = first.hour === interval.hour && first.minute === interval.minute
    return !isFirst && interval.minute === 0
  }

  function showResourceLabelDefault (resource) {
  }

  function styleDefault (interval) {
    return undefined
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
  function getTimestampAtEventInterval (e, day, clamp = false, now = undefined) {
    let timestamp = copyTimestamp(day)
    const bounds = (e.currentTarget).getBoundingClientRect()
    const baseMinutes = parsedStartMinute.value
    const touchEvent = e
    const mouseEvent = e
    const touches = touchEvent.changedTouches || touchEvent.touches
    const clientY = touches && touches[ 0 ] ? touches[ 0 ].clientY : mouseEvent.clientY
    const addIntervals = (clientY - bounds.top) / parsedIntervalHeight.value
    const addMinutes = Math.floor((clamp ? Math.floor(addIntervals) : addIntervals) * parsedIntervalMinutes.value)
    const minutes = baseMinutes + addMinutes

    if (minutes !== 0) {
      timestamp = addToDate(timestamp, { minute: minutes })
    }

    if (now) {
      updateRelative(timestamp, now, true)
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
  function getTimestampAtEvent (e, day, clamp = false, now = undefined) {
    const timestamp = copyTimestamp(day)
    const bounds = (e.currentTarget).getBoundingClientRect()
    const baseMinutes = parsedStartMinute.value
    const touchEvent = e
    const mouseEvent = e
    const touches = touchEvent.changedTouches || touchEvent.touches
    const clientY = touches && touches[ 0 ] ? touches[ 0 ].clientY : mouseEvent.clientY
    const addIntervals = (clientY - bounds.top) / parsedIntervalHeight.value
    const addMinutes = Math.floor((clamp ? Math.floor(addIntervals) : addIntervals) * parsedIntervalMinutes.value)
    const minutes = baseMinutes + addMinutes

    return updateMinutes(timestamp, minutes, now)
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
  function getTimestampAtEventX (e, day, clamp = false, now = undefined) {
    const timestamp = copyTimestamp(day)
    const bounds = (e.currentTarget).getBoundingClientRect()
    const touchEvent = e
    const mouseEvent = e
    const touches = touchEvent.changedTouches || touchEvent.touches
    const clientX = touches && touches[ 0 ] ? touches[ 0 ].clientX : mouseEvent.clientX
    const addIntervals = (clientX - bounds.left) / parsedCellWidth.value
    const addMinutes = Math.floor((clamp ? Math.floor(addIntervals) : addIntervals) * parsedIntervalMinutes.value)
    const minutes = addMinutes + (day.hour * 60 + day.minute)

    return updateMinutes(timestamp, minutes, now)
  }

  /**
   * Returns the scope for the associated Timestamp
   * This function is used for vertical intervals
   * @param {Timestamp} timestamp
   * @param {Number} columnIndex
   */
  function getScopeForSlot (timestamp, columnIndex) {
    const scope = { timestamp }
    scope.timeStartPos = timeStartPos
    scope.timeDurationHeight = timeDurationHeight
    if (columnIndex !== undefined) {
      scope.columnIndex = columnIndex
    }
    return scope
  }

  /**
   * Returns the scope for the associated Timestamp
   * This function is used for horizontal intervals
   * @param {Timestamp} timestamp
   * @param {Number} index
   * @param idx
   */
  function getScopeForSlotX (timestamp, idx) {
    const scope = { timestamp: copyTimestamp(timestamp) }
    scope.timeStartPosX = timeStartPosX
    scope.timeDurationWidth = timeDurationWidth
    if (idx !== undefined) {
      scope.index = idx
    }
    return scope
  }

  /**
   * Forces the browser to scroll to the specified time
   * This function is used for vertical intervals
   * @param {String} time in format HH:MM
   */
  function scrollToTime (time) {
    const y = timeStartPos(time)

    if (y === false || !scrollArea.value) {
      return false
    }

    scrollArea.value.scrollTop = y

    return true
  }

  /**
   * Forces the browser to scroll to the specified time
   * This function is used for horizontal intervals
   * @param {String} time in format HH:MM
   */
  function scrollToTimeX (time) {
    const x = timeStartPosX(time)

    if (x === false || !scrollArea.value) {
      return false
    }

    scrollArea.value.scrollLeft = x

    return true
  }

  function timeDurationHeight (minutes) {
    return minutes / parsedIntervalMinutes.value * parsedIntervalHeight.value
  }

  function timeDurationWidth (minutes) {
    return minutes / parsedIntervalMinutes.value * parsedCellWidth.value
  }

  function heightToMinutes (height) {
    return parseInt(height, 10) * parsedIntervalMinutes.value / parsedIntervalHeight.value
  }

  function widthToMinutes (width) {
    return parseInt(width, 10) * parsedIntervalMinutes.value / parsedCellWidth.value
  }

  function timeStartPos (time, clamp = true) {
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

  function timeStartPosX (time, clamp = true) {
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
    timeStartPosX
  }
}
