// common composables
import { computed } from 'vue'
import {
  validateTimestamp,
  parseTimestamp,
  parsed,
  getWeekdaySkips,
  // createDayList,
  createNativeLocaleFormatter,
  getStartOfWeek,
  getEndOfWeek,
  getDayIdentifier,
  today
} from '../utils/Timestamp.js'

export const useCommonProps = {
  modelValue: { // v-model
    type: String,
    default: today(),
    validator: v => v === '' || validateTimestamp(v)
  },
  weekdays: {
    type: Array,
    default: () => [ 0, 1, 2, 3, 4, 5, 6 ]
  },
  dateType: {
    type: String,
    default: 'round',
    validator: v => [ 'round', 'square' ].includes(v)
  },
  weekdayAlign: {
    type: String,
    default: 'center',
    validator: v => [ 'left', 'center', 'right' ].includes(v)
  },
  dateAlign: {
    type: String,
    default: 'center',
    validator: v => [ 'left', 'center', 'right' ].includes(v)
  },
  bordered: Boolean,
  dark: Boolean,
  noActiveDate: Boolean,
  disabledDays: Array,
  disabledBefore: String,
  disabledAfter: String,
  disabledWeekdays: {
    type: Array,
    default: () => []
  },
  noHeader: Boolean,
  noScroll: Boolean,
  shortWeekdayLabel: Boolean,
  noDefaultHeaderText: Boolean,
  noDefaultHeaderBtn: Boolean,
  minLabelLength: {
    type: [ Number, String ],
    default: 1
  },
  labelBreakpoints: {
    type: Array,
    default: () => [ 75, 35 ],
    validator: v => v.length === 2
  },
  locale: {
    type: String,
    default: 'en-us'
  },
  animated: Boolean,
  transitionPrev: {
    type: String,
    default: 'slide-right'
  },
  transitionNext: {
    type: String,
    default: 'slide-left'
  },
  dragEnterFunc: {
    type: Function
    // event, timestamp
  },
  dragOverFunc: {
    type: Function
    // event, timestamp
  },
  dragLeaveFunc: {
    type: Function
    // event, timestamp
  },
  dropFunc: {
    type: Function
    // event, timestamp
  },
  selectedDates: {
    type: Array,
    default: () => []
  },
  selectedStartEndDates: {
    type: Array,
    default: () => []
  },
  hoverable: Boolean,
  focusable: Boolean,
  focusType: {
    type: Array,
    default: [ 'date' ],
    validator: v => {
      let val = true
      v.forEach(type => {
        if ([ 'day', 'date', 'weekday', 'resource' ].includes(type) !== true) {
          val = false
        }
      })
      return val      
    }
  }
}

export default function (props, {
  startDate,
  endDate,
  times
}) {
  const weekdaySkips = computed(() => getWeekdaySkips(props.weekdays))
  const parsedStart = computed(() => parseTimestamp(startDate.value))
  const parsedEnd = computed(() => {
    if (endDate.value === '0000-00-00') {
      return endOfWeek(parsedStart.value)
    }
    return parseTimestamp(endDate.value)
  })

  // different from 'createDayList' in useIntervals
  // const days = computed(() => createDayList(
  //   parsedStart.value,
  //   parsedEnd.value,
  //   times.today,
  //   weekdaySkips.value,
  //   props.disabledBefore,
  //   props.disabledAfter,
  //   props.disabledWeekdays,
  //   props.disabledDays
  // ))

  const dayFormatter = computed(() => {
    const options = { timeZone: 'UTC', day: 'numeric' }

    return createNativeLocaleFormatter(
      props.locale,
      (_tms, _short) => options
    )
  })

  const weekdayFormatter = computed(() => {
    const longOptions = { timeZone: 'UTC', weekday: 'long' }
    const shortOptions = { timeZone: 'UTC', weekday: 'short' }

    return createNativeLocaleFormatter(
      props.locale,
      (_tms, short) => (short ? shortOptions : longOptions)
    )
  })

  const ariaDateFormatter = computed(() => {
    const longOptions = { timeZone: 'UTC', dateStyle: 'full' }

    return createNativeLocaleFormatter(
      props.locale,
      (_tms) => longOptions
    )
  })

  function arrayHasDate (arr, timestamp) {
    return arr && arr.length > 0 && arr.includes(timestamp.date)
  }

  function checkDays (arr, timestamp) {
    const days = {
      firstDay: false,
      betweenDays: false,
      lastDay: false
    }

    // array must have two dates ('YYYY-MM-DD') in it
    if (arr && arr.length === 2) {
      const current = getDayIdentifier(timestamp)
      const first = getDayIdentifier(parsed(arr[ 0 ]))
      const last = getDayIdentifier(parsed(arr[ 1 ]))
      days.firstDay = first === current
      days.lastDay = last === current
      days.betweenDays = first < current && last > current
    }
    return days
  }

  function getRelativeClasses (timestamp, outside = false, selectedDays = [], startEndDays = [], hover = false) {
    const isSelected = arrayHasDate(selectedDays, timestamp)
    const { firstDay, lastDay, betweenDays } = checkDays(startEndDays, timestamp)

    return {
      'q-past-day': firstDay !== true && betweenDays !== true && lastDay !== true && isSelected !== true && outside !== true && timestamp.past,
      'q-future-day': firstDay !== true && betweenDays !== true && lastDay !== true && isSelected !== true && outside !== true && timestamp.future,
      'q-outside': outside, // outside the current month
      'q-current-day': timestamp.current,
      'q-selected': isSelected,
      'q-range-first': firstDay === true,
      'q-range': betweenDays === true,
      'q-range-last': lastDay === true,
      'q-range-hover': hover === true && (firstDay === true || lastDay === true || betweenDays === true),
      'q-disabled-day disabled': timestamp.disabled === true
    }
  }

  function startOfWeek (timestamp) {
    return getStartOfWeek(timestamp, props.weekdays, times.today)
  }

  function endOfWeek (timestamp) {
    return getEndOfWeek(timestamp, props.weekdays, times.today)
  }

  function dayStyleDefault (timestamp) {
    return undefined
  }

  return {
    weekdaySkips,
    parsedStart,
    parsedEnd,
    // days,
    dayFormatter,
    weekdayFormatter,
    ariaDateFormatter,
    arrayHasDate,
    checkDays,
    getRelativeClasses,
    startOfWeek,
    endOfWeek,
    dayStyleDefault
  }
}
