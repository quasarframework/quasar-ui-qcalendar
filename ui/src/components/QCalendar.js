import {
  computed,
  defineComponent,
  ref,
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
import useCalendar from '../composables/useCalendar.js'

export default defineComponent({
  name: 'QCalendar',
  props: {
    mode: {
      type: String,
      validator: v=> [ 'day', 'month', 'agenda', 'resource', 'scheduler', 'task' ].includes(v),
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
  setup (props, { attrs, slots, expose }) {
    const calendar = ref(null)

    const component = computed(() => {
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

    function moveToToday () {
      calendar.value.moveToToday()
    }

    function move(amount = -1) {
      calendar.value.move(amount)
    }

    function next (amount = 1) {
      calendar.value.next(amount)
    }

    function prev (amount = 1) {
      calendar.value.prev(amount)
    }

    function updateCurrent () {
      calendar.value.updateCurrent()
    }

    function timeStartPos (time, clamp = true) {
      return calendar.value.timeStartPos(time, clamp)
    }

    function timeStartPosX (time, clamp = true) {
      return calendar.value.timeStartPosX(time, clamp)
    }

    function timeDurationWidth (minutes) {
      return calendar.value.timeDurationWidth(minutes)
    }

    function timeDurationHeight (minutes) {
      return calendar.value.timeDurationHeight(minutes)
    }

    function heightToMinutes (height) {
      return calendar.value.heightToMinutes(height)
    }
  
    function widthToMinutes (width) {
      return calendar.value.widthToMinutes(minutes)
    }

    function scrollToTime (time) {
      return calendar.value.scrollToTime(time)
    }

    function scrollToTimeX (time) {
      return calendar.value.scrollToTimeX(time)
    }

    // expose public methods
    expose({
      prev,
      next,
      move,
      moveToToday,
      updateCurrent,
      timeStartPos,
      timeStartPosX,
      timeDurationWidth,
      timeDurationHeight,
      heightToMinutes,
      widthToMinutes,
      scrollToTime,
      scrollToTimeX
    })

    return () => h(component.value, { ref: calendar, ...props, ...attrs }, slots)
  }
})
