import { computed, defineComponent, ref, h, SetupContext, VNode, DefineComponent } from 'vue'

import QCalendarAgenda from './QCalendarAgenda'
import QCalendarDay from './QCalendarDay'
import QCalendarMonth from './QCalendarMonth'
import QCalendarResource from './QCalendarResource'
import QCalendarScheduler from './QCalendarScheduler'
import QCalendarTask from './QCalendarTask'

import { useCommonProps } from '../composables/useCommon'
import { useIntervalProps, useSchedulerProps, useResourceProps } from '../composables/useInterval'
import { useMaxDaysProps } from '../composables/useMaxDays'
import { useTimesProps } from '../composables/useTimes'
import { useCellWidthProps } from '../composables/useCellWidth'
import { useNavigationProps } from '../composables/useKeyboard'
import { useMonthProps } from '../composables/useMonth'
import { useTaskProps } from '../composables/useTask'
// import useCalendar from '../composables/useCalendar'

export interface CalendarProps {
  mode: string
  modelValue: string
  weekdays: number[]
  dateType: string
  weekdayAlign: string
  dateAlign: string
  bordered: boolean
  dark: boolean
  noAria: boolean
  noActiveDate: boolean
  noHeader: boolean
  noScroll: boolean
  shortWeekdayLabel: boolean
  noDefaultHeaderText: boolean
  noDefaultHeaderBtn: boolean
  minWeekdayLabel: number | string
  weekdayBreakpoints: number[]
  locale: string
  animated: boolean
  transitionNext: string
  transitionPrev: string
}

export default defineComponent({
  name: 'QCalendar',

  props: {
    mode: {
      type: String,
      validator: (v: string) =>
        ['day', 'month', 'agenda', 'resource', 'scheduler', 'task'].includes(v),
      default: 'day',
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
    ...useTaskProps,
  },

  setup(props: CalendarProps, { attrs, slots, expose }: SetupContext) {
    const calendar = ref<any>()

    const component = computed(() => {
      switch (props.mode) {
        case 'agenda':
          return QCalendarAgenda
        case 'resource':
          return QCalendarResource
        case 'scheduler':
          return QCalendarScheduler
        case 'month':
          return QCalendarMonth
        case 'day':
          return QCalendarDay
        case 'task':
          return QCalendarTask
        default:
          return QCalendarDay
      }
    })

    function moveToToday(): void {
      if (calendar.value) {
        calendar.value.moveToToday()
      }
    }

    function move(amount = -1): void {
      if (calendar.value) {
        calendar.value.move(amount)
      }
    }

    function next(amount = 1): void {
      if (calendar.value) {
        calendar.value.next(amount)
      }
    }

    function prev(amount = 1): void {
      if (calendar.value) {
        calendar.value.prev(amount)
      }
    }

    function updateCurrent(): void {
      if (calendar.value) {
        calendar.value.updateCurrent()
      }
    }

    function timeStartPos(time: string, clamp = true): number | void {
      if (calendar.value) {
        return calendar.value.timeStartPos(time, clamp)
      }
    }

    function timeStartPosX(time: string, clamp = true): number | void {
      if (calendar.value) {
        return calendar.value.timeStartPosX(time, clamp)
      }
    }

    function timeDurationWidth(minutes: number | string): number | void {
      if (calendar.value) {
        return calendar.value.timeDurationWidth(minutes)
      }
    }

    function timeDurationHeight(minutes: number | string): number | void {
      if (calendar.value) {
        return calendar.value.timeDurationHeight(minutes)
      }
    }

    function heightToMinutes(height: number | string): number | void {
      if (calendar.value) {
        return calendar.value.heightToMinutes(height)
      }
    }

    function widthToMinutes(width: number | string): number | void {
      if (calendar.value) {
        return calendar.value.widthToMinutes(width)
      }
    }

    function scrollToTime(time: string, duration = 0): void {
      if (calendar.value) {
        calendar.value.scrollToTime(time, duration)
      }
    }

    function scrollToTimeX(time: string, duration = 0): void {
      if (calendar.value) {
        calendar.value.scrollToTimeX(time, duration)
      }
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
      scrollToTimeX,
    })

    return (): VNode =>
      h(component.value as unknown as DefineComponent, { ref: calendar, ...props, ...attrs }, slots)
  },
})
