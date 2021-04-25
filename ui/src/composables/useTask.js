import {
  computed
  // watch
} from 'vue'

import {
  DAYS_IN_WEEK,
  addToDate,
  copyTimestamp,
  createDayList,
  // createNativeLocaleFormatter,
  // getDayIdentifier,
  getEndOfWeek,
  getStartOfWeek,
  getEndOfMonth,
  getStartOfMonth,
  parseTimestamp,
  today,
  validateNumber,
  validateTimestamp
} from '../utils/Timestamp.js'

export const useTaskProps = {
  modelValue: { // v-model
    type: String,
    default: today(),
    validator: v => v === '' || validateTimestamp(v)
  },
  modelTasks: {
    type: Array,
    default: []
  },
  modelTitle: {
    type: Array,
    default: []
  },
  modelFooter: {
    type: Array,
    default: []
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
  dateHeader: {
    type: String,
    default: 'stacked',
    validator: v => [ 'stacked', 'inline', 'inverted' ].includes(v)
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
  view: {
    type: String,
    validator: v => [ 'day', 'week', 'month' ].includes(v)
    // default: 'month'
  },
  viewCount: {
    type: Number,
    default: 1,
    validator: v => validateNumber(v) && v > 0
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
  cellWidth: [ Number, String ],
  // cellWidth: {
  //   type: [ Number, String ],
  //   default: 75
  // },
  minWeekdayLabel: {
    type: [ Number, String ],
    default: 2
  },
  weekdayBreakpoints: {
    type: Array,
    default: () => [ 75, 35 ],
    validator: v => v.length === 2
  },
  locale: {
    type: String,
    default: 'en-US'
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
  weekdayClass: Function,
  dayClass: Function,
  footerDayClass: Function,
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
  hoverable: Boolean,
  focusable: Boolean,
  focusType: {
    type: Array,
    default: ['date'],
    validator: v => {
      let val = true
      v.forEach(type => {
        if ([ 'day', 'date', 'weekday', 'interval', 'resource', 'task' ].includes(type) !== true) {
          val = false
        }
      })
      return val
    }
  },
  taskWidth: {
    type: Number,
    default: 200,
    validator: v => validateNumber(v) && v > 0
  }
}

export default function (props, emit, {
  weekdaySkips,
  times
  // parsedStart,
  // parsedEnd,
  // size,
  // headerColumnRef
}) {
  const parsedStartDate = computed(() => {
    if (props.view === 'day') {
      return parseTimestamp(props.modelValue)
    }
    else if (props.view === 'week') {
      return getStartOfWeek(parseTimestamp(props.modelValue), props.weekdays, times.today)
    }
    else if (props.view === 'month') {
      return getStartOfMonth(parseTimestamp(props.modelValue), props.weekdays, times.today)
    }
    else {
      throw new Error(`QCalendarTask: unknown 'view' type (${ props.view })`)
    }
  })

  const parsedEndDate = computed(() => {
    if (props.view === 'day') {
      if (props.viewCount === 1) {
        return parsedStartDate.value
      }
      let end = copyTimestamp(parsedStartDate.value)
      end = addToDate(end, { day: props.viewCount - 1 })
      return end
    }
    else if (props.view === 'week') {
      if (props.viewCount === 1) {
        return getEndOfWeek(parseTimestamp(props.modelValue), props.weekdays, times.today)
      }
      else {
        let end = copyTimestamp(parsedStartDate.value)
        end = addToDate(end, { day: (props.viewCount - 1) * DAYS_IN_WEEK })
        return getEndOfWeek(end, props.weekdays, times.today)
      }
    }
    else if (props.view === 'month') {
      if (props.viewCount === 1) {
        return getEndOfMonth(parseTimestamp(props.modelValue), props.weekdays, times.today)
      }
      else {
        let end = copyTimestamp(parsedStartDate.value)
        end = addToDate(end, { month: props.viewCount })
        return getEndOfMonth(end, props.weekdays, times.today)
      }
    }
    else {
      throw new Error(`QCalendarTask: unknown 'view' type (${ props.view })`)
    }
  })

  const days = computed(() => {
    return createDayList(
      parsedStartDate.value,
      parsedEndDate.value,
      times.today,
      weekdaySkips.value,
      props.disabledBefore,
      props.disabledAfter,
      props.disabledWeekdays,
      props.disabledDays,
      Number.MAX_SAFE_INTEGER
      // parsedMinDays.value
    )
  })

  return {
    days,
    parsedStartDate,
    parsedEndDate
  }
}
