import { validateNumber, validateTimestamp } from './timestamp'
import { validateView } from './views'

/* public properties */
export default {
  base: {
    weekdays: {
      type: Array,
      default: () => [0, 1, 2, 3, 4, 5, 6]
    },
    hideHeader: Boolean,
    noScroll: Boolean,
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
      validator: validateNumber
    },
    intervalMinutes: {
      type: [Number, String],
      default: 60,
      validator: validateNumber
    },
    intervalStart: {
      type: [Number, String],
      default: 0,
      validator: validateNumber
    },
    intervalCount: {
      type: [Number, String],
      default: 24,
      validator: validateNumber
    },
    intervalStyle: {
      type: Function,
      default: null
    },
    showIntervalLabel: {
      type: Function,
      default: null
    },
    hour24Format: Boolean,
    columnHeaderBefore: Boolean,
    columnHeaderAfter: Boolean,
    columnCount: {
      type: [Number, String],
      default: 1,
      validator: validateNumber
    },
    columnIndexStart: {
      type: [Number, String],
      default: 0,
      validator: validateNumber
    }
  },
  weeks: {
    dayHeight: {
      type: [Number, String],
      default: 0,
      validator: validateNumber
    },
    dayPadding: String,
    minWeeks: {
      type: Number,
      validator: validateNumber,
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
  scheduler: {
    resources: Array,
    maxDays: {
      type: Number,
      default: 7
    },
    resourceHeight: {
      type: [Number, String],
      default: 70,
      validator: validateNumber
    },
    resourceStyle: {
      type: Function,
      default: null
    },
    columnHeaderBefore: Boolean,
    columnHeaderAfter: Boolean,
    columnCount: {
      type: [Number, String],
      default: 1,
      validator: validateNumber
    },
    columnIndexStart: {
      type: [Number, String],
      default: 0,
      validator: validateNumber
    }
  },
  calendar: {
    view: {
      type: String,
      default: 'month',
      validator: validateView
    },
    value: { // v-model
      type: String,
      validator: v => v === '' || validateTimestamp(v)
    }
  }
}
