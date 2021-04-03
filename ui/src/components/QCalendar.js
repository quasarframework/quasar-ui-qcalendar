import {
  computed,
  defineComponent,
  h
} from 'vue'

import QCalendarAgenda from './QCalendarAgenda.js'
import QCalendarDay from './QCalendarDay.js'
import QCalendarMonth from './QCalendarMonth.js'
import QCalendarResource from './QCalendarResource.js'
import QCalendarScheduler from './QCalendarScheduler.js'
import QCalendarTask from './QCalendarTask.js'

import { useCommonProps } from '../composables/useCommon.js'
import { useIntervalProps, useSchedulerProps, useResourceProps } from '../composables/useInterval.js'
import { useMaxDaysProps } from '../composables/useMaxDays.js'
import { useTimesProps } from '../composables/useTimes.js'
import { useCellWidthProps } from '../composables/useCellWidth.js'
import { useNavigationProps } from '../composables/useKeyboard.js'
import { useMonthProps } from '../composables/useMonth.js'
import { useTaskProps } from '../composables/useTask.js'

export default defineComponent({
  name: 'QCalendar',
  props: {
    mode: {
      type: String,
      validator: v=> ['day', 'month', 'agenda', 'resource', 'scheduler', 'task'].includes(v),
      default: 'day'
    },
    ...useCommonProps,
    ...useMonthProps,
    ...useTimesProps,
    ...useCellWidthProps,
    ...useNavigationProps,
    ...useIntervalProps,
    ...useSchedulerProps,
    ...useResourceProps,
    ...useMaxDaysProps,
    ...useTaskProps
  },
  setup (props, { attrs, slots }) {
    const component = computed(() => {
      console.log('mode:', props.mode)
      console.log('attrs:', attrs)
      switch (props.mode) {
        case 'agenda': return QCalendarAgenda
        case 'resource':return QCalendarResource
        case 'scheduler': return QCalendarScheduler
        case 'month': return QCalendarMonth
        case 'day': return QCalendarDay
        case 'task': return QCalendarTask
        case 'day':
        default:
          return QCalendarDay
      }
    })
    return () => h(component.value, { ...props, ...attrs }, slots)
  }
})
