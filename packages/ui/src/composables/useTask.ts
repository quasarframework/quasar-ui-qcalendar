import { computed, PropType, Ref, EmitFn, ComputedRef } from 'vue'
import {
  TIME_CONSTANTS,
  addToDate,
  copyTimestamp,
  createDayList,
  getEndOfWeek,
  getStartOfWeek,
  getEndOfMonth,
  getStartOfMonth,
  parseTimestamp,
  today,
  validateNumber,
  validateTimestamp,
  type DisabledDays,
  type Timestamp,
} from '@timestamp-js/core'
import { isValidWeekdays } from './useCommon'

export interface Task {
  [key: string]: any
}

export const useTaskProps = {
  /** Date value used by `v-model`, formatted as `YYYY-MM-DD`. */
  modelValue: {
    type: String,
    default: today(),
    validator: (v: string): boolean => v === '' || validateTimestamp(v),
  },
  /** Task rows rendered by the task view. */
  modelTasks: {
    type: Array as () => Array<any>,
    default: (): any[] => [],
  },
  /** Title rows rendered above task rows. */
  modelTitle: {
    type: Array as () => Array<any>,
    default: (): any[] => [],
  },
  /** Footer rows rendered below task rows. */
  modelFooter: {
    type: Array as () => Array<any>,
    default: (): any[] => [],
  },
  /** Task field used as the unique key. */
  taskKey: {
    type: [String, Number] as PropType<string | number>,
    default: 'id',
  },
  /** Weekday indexes shown by the task view, where `0` is Sunday and `6` is Saturday. */
  weekdays: {
    type: Array as PropType<number[]>,
    default: (): number[] => [0, 1, 2, 3, 4, 5, 6],
    validator: isValidWeekdays,
  },
  /** Shape used for rendered date buttons. */
  dateType: {
    type: String as () => 'round' | 'rounded' | 'square',
    default: 'round',
    validator: (v: string): boolean => ['round', 'rounded', 'square'].includes(v),
  },
  /** Header layout used for date labels. */
  dateHeader: {
    type: String as () => 'stacked' | 'inline' | 'inverted',
    default: 'stacked',
    validator: (v: string): boolean => ['stacked', 'inline', 'inverted'].includes(v),
  },
  /** Horizontal alignment for weekday labels. */
  weekdayAlign: {
    type: String as () => 'left' | 'center' | 'right',
    default: 'center',
    validator: (v: string): boolean => ['left', 'center', 'right'].includes(v),
  },
  /** Horizontal alignment for date labels. */
  dateAlign: {
    type: String as () => 'left' | 'center' | 'right',
    default: 'center',
    validator: (v: string): boolean => ['left', 'center', 'right'].includes(v),
  },
  /** Height in pixels or CSS units for each task day cell. */
  dayHeight: {
    type: [Number, String],
    default: 0,
    validator: validateNumber,
  },
  /** Minimum height in pixels or CSS units for each task day cell. */
  dayMinHeight: {
    type: [Number, String],
    default: 40,
    validator: validateNumber,
  },
  /** Function that returns inline styles for weekday header cells. */
  weekdayStyle: {
    type: Function,
    default: null,
  },
  /** Function that returns CSS classes for weekday header cells. */
  weekdayClass: {
    type: Function,
    default: null,
  },
  /** Function that returns inline styles for task day cells. */
  dayStyle: {
    type: Function,
    default: null,
  },
  /** Function that returns CSS classes for task day cells. */
  dayClass: {
    type: Function,
    default: null,
  },
  /** Function that returns CSS classes for footer day cells. */
  footerDayClass: {
    type: Function,
    default: null,
  },
  /** Task view mode. */
  view: {
    type: String as () => 'day' | 'week' | 'month',
    validator: (v: string): boolean => ['day', 'week', 'month'].includes(v),
  },
  /** Number of task view ranges rendered from the model value. */
  viewCount: {
    type: Number,
    default: 1,
    validator: (v: number): boolean => validateNumber(v) && v > 0,
  },
  /** Width in pixels for the task label column. */
  taskWidth: {
    type: Number,
    default: 200,
    validator: (v: number): boolean => validateNumber(v) && v > 0,
  },
}

interface TaskReturn {
  parsedStartDate: ComputedRef<Timestamp | null>
  parsedEndDate: ComputedRef<Timestamp | null>
  days: Ref<Timestamp[]>
}

export default function useTask(
  props: {
    view: 'day' | 'week' | 'month'
    modelValue: string
    viewCount: number
    weekdays: number[]
    disabledBefore?: string
    disabledAfter?: string
    disabledWeekdays?: number[]
    disabledDays?: DisabledDays
  },
  emit: EmitFn,
  {
    times,
  }: {
    times: { today: Timestamp }
  },
): TaskReturn {
  const parsedStartDate = computed(() => {
    if (!props.modelValue) {
      throw new Error(`QCalendarTask: no modelValue provided`)
    }
    if (props.view === 'day') {
      return parseTimestamp(props.modelValue)
    } else if (props.view === 'week') {
      return getStartOfWeek(
        parseTimestamp(props.modelValue) as Timestamp,
        props.weekdays,
        times.today,
      )
    } else if (props.view === 'month') {
      return getStartOfMonth(parseTimestamp(props.modelValue) as Timestamp)
    } else {
      throw new Error(`QCalendarTask: unknown 'view' type (${props.view})`)
    }
  })

  const parsedEndDate = computed(() => {
    if (!props.modelValue) {
      throw new Error(`QCalendarTask: no modelValue provided`)
    }
    if (props.view === 'day') {
      if (props.viewCount === 1) {
        return parsedStartDate.value
      }
      let end = copyTimestamp(parsedStartDate.value!)
      end = addToDate(end, { day: props.viewCount - 1 })
      return end
    } else if (props.view === 'week') {
      if (props.viewCount === 1) {
        return getEndOfWeek(
          parseTimestamp(props.modelValue) as Timestamp,
          props.weekdays,
          times.today,
        )
      } else {
        let end = copyTimestamp(parsedStartDate.value!)
        end = addToDate(end, { day: (props.viewCount - 1) * TIME_CONSTANTS.DAYS_IN.WEEK })
        return getEndOfWeek(end, props.weekdays, times.today)
      }
    } else if (props.view === 'month') {
      if (props.viewCount === 1) {
        return getEndOfMonth(parseTimestamp(props.modelValue) as Timestamp)
      } else {
        let end = copyTimestamp(parsedStartDate.value!)
        end = addToDate(end, { month: props.viewCount - 1 })
        return getEndOfMonth(end)
      }
    } else {
      throw new Error(`QCalendarTask: unknown 'view' type (${props.view})`)
    }
  })

  const days = computed(() => {
    return createDayList(
      parsedStartDate.value!,
      parsedEndDate.value!,
      times.today,
      props.weekdays,
      props.disabledBefore,
      props.disabledAfter,
      props.disabledWeekdays || [],
      props.disabledDays || [],
      Number.MAX_SAFE_INTEGER,
    )
  })

  return {
    days,
    parsedStartDate,
    parsedEndDate,
  }
}
