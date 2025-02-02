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
  type Timestamp,
} from '../utils/Timestamp'

export interface Task {
  [key: string]: any
}

export const useTaskProps = {
  modelValue: {
    type: String,
    default: today(),
    validator: (v: string): boolean => v === '' || validateTimestamp(v),
  },
  modelTasks: {
    type: Array as () => Array<any>,
    default: (): any[] => [],
  },
  modelTitle: {
    type: Array as () => Array<any>,
    default: (): any[] => [],
  },
  modelFooter: {
    type: Array as () => Array<any>,
    default: (): any[] => [],
  },
  taskKey: {
    type: [String, Number] as PropType<string | number>,
    default: 'id',
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
  dateHeader: {
    type: String as () => 'stacked' | 'inline' | 'inverted',
    default: 'stacked',
    validator: (v: string): boolean => ['stacked', 'inline', 'inverted'].includes(v),
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
  dayHeight: {
    type: [Number, String],
    default: 0,
    validator: validateNumber,
  },
  dayMinHeight: {
    type: [Number, String],
    default: 40,
    validator: validateNumber,
  },
  weekdayStyle: {
    type: Function,
    default: null,
  },
  weekdayClass: {
    type: Function,
    default: null,
  },
  dayStyle: {
    type: Function,
    default: null,
  },
  dayClass: {
    type: Function,
    default: null,
  },
  footerDayClass: {
    type: Function,
    default: null,
  },
  view: {
    type: String as () => 'day' | 'week' | 'month',
    validator: (v: string): boolean => ['day', 'week', 'month'].includes(v),
  },
  viewCount: {
    type: Number,
    default: 1,
    validator: (v: number): boolean => validateNumber(v) && v > 0,
  },
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
    disabledDays?: string[]
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
        end = addToDate(end, { month: props.viewCount })
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
