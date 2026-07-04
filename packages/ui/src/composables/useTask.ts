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
  getCalendarWeekdays,
  parseCalendarTimestamp,
  validateNumber,
  validateTimestamp,
  type CalendarSystem,
  type DisabledDays,
  type Timestamp,
} from '@timestamp-js/core'
import { isValidWeekdays } from './useCommon'
import { toCalendarTimestamp } from '../utils/calendarSystem'

export interface CalendarDefaultProps {
  calendarSystem?: CalendarSystem
}

export interface Task {
  [key: string]: any
}

export const useTaskProps = {
  /**
   * Date value used by `v-model`, formatted as `YYYY-MM-DD`.
   *
   * @category model
   */
  modelValue: {
    type: String,
    default: '',
    validator: (v: string): boolean => v === '' || validateTimestamp(v),
  },
  /**
   * Task rows rendered by the task view.
   *
   * @category model
   */
  modelTasks: {
    type: Array as () => Array<any>,
    default: (): any[] => [],
  },
  /**
   * Title rows rendered above task rows.
   *
   * @category model
   */
  modelTitle: {
    type: Array as () => Array<any>,
    default: (): any[] => [],
  },
  /**
   * Footer rows rendered below task rows.
   *
   * @category model
   */
  modelFooter: {
    type: Array as () => Array<any>,
    default: (): any[] => [],
  },
  /**
   * Task field used as the unique key.
   *
   * @category model
   */
  taskKey: {
    type: [String, Number] as PropType<string | number>,
    default: 'id',
  },
  /**
   * Weekday indexes shown by the task view, where `0` is Sunday and `6` is Saturday. Defaults to
   * the active calendar system's recommended weekday order.
   *
   * Pass this prop explicitly to override the adapter default, such as rendering a five-day
   * work week.
   *
   * @category display
   * @example :weekdays="[1, 2, 3, 4, 5]"
   */
  weekdays: {
    type: Array as PropType<number[]>,
    default: (props: CalendarDefaultProps): number[] => getCalendarWeekdays(props.calendarSystem),
    validator: isValidWeekdays,
  },
  /**
   * Shape used for rendered date buttons.
   *
   * @category style
   */
  dateType: {
    type: String as () => 'round' | 'rounded' | 'square',
    default: 'round',
    validator: (v: string): boolean => ['round', 'rounded', 'square'].includes(v),
  },
  /**
   * Header layout used for date labels.
   *
   * @category display
   */
  dateHeader: {
    type: String as () => 'stacked' | 'inline' | 'inverted',
    default: 'stacked',
    validator: (v: string): boolean => ['stacked', 'inline', 'inverted'].includes(v),
  },
  /**
   * Horizontal alignment for weekday labels.
   *
   * @category style
   */
  weekdayAlign: {
    type: String as () => 'left' | 'center' | 'right',
    default: 'center',
    validator: (v: string): boolean => ['left', 'center', 'right'].includes(v),
  },
  /**
   * Horizontal alignment for date labels.
   *
   * @category style
   */
  dateAlign: {
    type: String as () => 'left' | 'center' | 'right',
    default: 'center',
    validator: (v: string): boolean => ['left', 'center', 'right'].includes(v),
  },
  /**
   * Height in pixels or CSS units for each model day cell.
   *
   * @category layout
   */
  dayHeight: {
    type: [Number, String],
    default: 0,
    validator: validateNumber,
  },
  /**
   * Minimum height in pixels or CSS units for each model day cell.
   *
   * @category layout
   */
  dayMinHeight: {
    type: [Number, String],
    default: 40,
    validator: validateNumber,
  },
  /**
   * Function that returns inline styles for weekday header cells.
   *
   * @category style
   */
  weekdayStyle: {
    type: Function,
    default: null,
  },
  /**
   * Function that returns CSS classes for weekday header cells.
   *
   * @category style
   */
  weekdayClass: {
    type: Function,
    default: null,
  },
  /**
   * Function that returns inline styles for model day cells.
   *
   * @category style
   */
  dayStyle: {
    type: Function,
    default: null,
  },
  /**
   * Function that returns CSS classes for model day cells.
   *
   * @category style
   */
  dayClass: {
    type: Function,
    default: null,
  },
  /**
   * Function that returns CSS classes for footer day cells.
   *
   * @category style
   */
  footerDayClass: {
    type: Function,
    default: null,
  },
  /**
   * Task view mode.
   *
   * @category display
   */
  view: {
    type: String as () => 'day' | 'week' | 'month',
    validator: (v: string): boolean => ['day', 'week', 'month'].includes(v),
  },
  /**
   * Number of task view ranges rendered from the model value.
   *
   * @category display
   */
  viewCount: {
    type: Number,
    default: 1,
    validator: (v: number): boolean => validateNumber(v) && v > 0,
  },
  /**
   * Width in pixels for the task label column.
   *
   * @category layout
   */
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
    view?: 'day' | 'week' | 'month'
    modelValue: string
    viewCount: number
    weekdays: number[]
    disabledBefore?: string
    disabledAfter?: string
    disabledWeekdays?: number[]
    disabledDays?: DisabledDays
    calendarSystem?: CalendarSystem
  },
  emit: EmitFn,
  {
    times,
  }: {
    times: { today: Timestamp }
  },
): TaskReturn {
  const calendar = computed(() => props.calendarSystem)
  const parsedModel = computed(() => parseCalendarTimestamp(props.modelValue, calendar.value))
  const calendarToday = computed(() => toCalendarTimestamp(times.today, calendar.value))

  const parsedStartDate = computed(() => {
    if (!props.modelValue) {
      throw new Error(`QCalendarTask: no modelValue provided`)
    }
    if (props.view === 'day') {
      return parsedModel.value
    } else if (props.view === 'week') {
      return getStartOfWeek(
        parsedModel.value as Timestamp,
        props.weekdays,
        calendarToday.value,
        calendar.value,
      )
    } else if (props.view === 'month') {
      return getStartOfMonth(parsedModel.value as Timestamp, calendar.value)
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
      end = addToDate(end, { day: props.viewCount - 1 }, calendar.value)
      return end
    } else if (props.view === 'week') {
      if (props.viewCount === 1) {
        return getEndOfWeek(
          parsedModel.value as Timestamp,
          props.weekdays,
          calendarToday.value,
          calendar.value,
        )
      } else {
        let end = copyTimestamp(parsedStartDate.value!)
        end = addToDate(
          end,
          { day: (props.viewCount - 1) * TIME_CONSTANTS.DAYS_IN.WEEK },
          calendar.value,
        )
        return getEndOfWeek(end, props.weekdays, calendarToday.value, calendar.value)
      }
    } else if (props.view === 'month') {
      if (props.viewCount === 1) {
        return getEndOfMonth(parsedModel.value as Timestamp, calendar.value)
      } else {
        let end = copyTimestamp(parsedStartDate.value!)
        end = addToDate(end, { month: props.viewCount - 1 }, calendar.value)
        return getEndOfMonth(end, calendar.value)
      }
    } else {
      throw new Error(`QCalendarTask: unknown 'view' type (${props.view})`)
    }
  })

  const days = computed(() => {
    return createDayList(
      parsedStartDate.value!,
      parsedEndDate.value!,
      calendarToday.value,
      props.weekdays,
      props.disabledBefore,
      props.disabledAfter,
      props.disabledWeekdays || [],
      props.disabledDays || [],
      Number.MAX_SAFE_INTEGER,
      0,
      calendar.value,
    )
  })

  return {
    days,
    parsedStartDate,
    parsedEndDate,
  }
}
