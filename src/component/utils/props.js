import { validateNumber, validateTimestamp } from './timestamp'

/* public properties */
export default {
  base: {
    weekdays: {
      type: Array,
      default: () => [0, 1, 2, 3, 4, 5, 6]
    },
    hideHeader: Boolean,
    shortWeekdayLabel: Boolean,
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
    dragOverFunc: {
      type: Function
      // event, timestamp
    },
    dropFunc: {
      type: Function
      // event, timestamp
    }
  },
  intervals: {
    maxDays: {
      type: Number,
      default: 7
    },
    shortIntervalLabel: Boolean,
    intervalHeight: {
      type: [Number, String],
      default: 40,
      validate: validateNumber
    },
    intervalMinutes: {
      type: [Number, String],
      default: 60,
      validate: validateNumber
    },
    intervalStart: {
      type: [Number, String],
      default: 0,
      validate: validateNumber
    },
    intervalCount: {
      type: [Number, String],
      default: 24,
      validate: validateNumber
    },
    intervalStyle: {
      type: Function,
      default: null
    },
    showIntervalLabel: {
      type: Function,
      default: null
    },
    hour24Format: Boolean
  },
  weeks: {
    dayHeight: {
      type: [Number, String],
      default: 50,
      validate: validateNumber
    },
    dayPadding: String,
    minWeeks: {
      type: Number,
      validate: validateNumber,
      default: 1
    },
    shortMonthLabel: Boolean,
    showWorkWeeks: Boolean,
    showMonthLabel: {
      type: Boolean,
      default: true
    },
    showDayOfYearLabel: Boolean
  },
  calendar: {
    view: {
      type: String,
      default: 'month',
      validator: v => ['month', 'week', 'day', '2day', '3day', '4day', '5day', '6day'].includes(v)
    },
    value: { // v-model
      type: String,
      validate: validateTimestamp
    }
  }
}
