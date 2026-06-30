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
  dir: 'ltr' | 'rtl' | 'auto'
  animated: boolean
  transitionNext: string
  transitionPrev: string
}

/**
 * Wrapper component that renders the active calendar view for the selected mode.
 * Public slots and events are forwarded from the view components listed here.
 *
 * @api-source QCalendarAgenda
 * @api-source QCalendarDay
 * @api-source QCalendarMonth
 * @api-source QCalendarResource
 * @api-source QCalendarScheduler
 * @api-source QCalendarTask
 * @api-slots QCalendarAgenda, QCalendarDay, QCalendarMonth, QCalendarResource, QCalendarScheduler, QCalendarTask
 * @api-events QCalendarAgenda, QCalendarDay, QCalendarMonth, QCalendarResource, QCalendarScheduler, QCalendarTask
 */
export default defineComponent({
  name: 'QCalendar',

  props: {
    /**
     * Tells QCalendar which concrete calendar view component to render.
     *
     * @category behavior
     * @values 'day', 'month', 'agenda', 'resource', 'scheduler', 'task'
     * @example 'day'
     * @example 'month'
     */
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

    /**
     * Moves the active calendar view to today.
     *
     * @applicable All
     */
    function moveToToday(): void {
      if (calendar.value) {
        calendar.value.moveToToday()
      }
    }

    /**
     * Moves the active calendar view by a relative amount.
     *
     * @param amount Number of view units to move. Negative values move backward.
     * @param-example amount -1
     * @applicable All
     */
    function move(amount: number = -1): void {
      if (calendar.value) {
        calendar.value.move(amount)
      }
    }

    /**
     * Moves the active calendar view forward.
     *
     * @param amount Number of view units to move forward.
     * @param-example amount 1
     * @applicable All
     */
    function next(amount: number = 1): void {
      if (calendar.value) {
        calendar.value.next(amount)
      }
    }

    /**
     * Moves the active calendar view backward.
     *
     * @param amount Number of view units to move backward.
     * @param-example amount 1
     * @applicable All
     */
    function prev(amount: number = 1): void {
      if (calendar.value) {
        calendar.value.prev(amount)
      }
    }

    /**
     * Refreshes the active calendar view's current date/time state.
     *
     * @applicable All
     */
    function updateCurrent(): void {
      if (calendar.value) {
        calendar.value.updateCurrent()
      }
    }

    /**
     * Returns the vertical start position for a time in interval-based views.
     *
     * @param time Time in HH:mm format.
     * @param clamp Clamp the result to the visible interval range.
     * @param-example time '09:00'
     * @param-example clamp true
     * @applicable day, agenda, month-interval, scheduler
     * @returns Vertical pixel offset when the active view supports time positioning.
     */
    function timeStartPos(time: string, clamp: boolean = true): number | void {
      if (calendar.value) {
        return calendar.value.timeStartPos(time, clamp)
      }
    }

    /**
     * Returns the horizontal start position for a time in resource views.
     *
     * @param time Time in HH:mm format.
     * @param clamp Clamp the result to the visible interval range.
     * @param-example time '09:00'
     * @param-example clamp true
     * @applicable resource
     * @returns Horizontal pixel offset when the active view supports time positioning.
     */
    function timeStartPosX(time: string, clamp: boolean = true): number | void {
      if (calendar.value) {
        return calendar.value.timeStartPosX(time, clamp)
      }
    }

    /**
     * Returns the horizontal width for a duration in resource views.
     *
     * @param minutes Duration in minutes.
     * @param-example minutes 60
     * @applicable resource
     * @returns Rendered duration width in pixels when the active view supports resource intervals.
     */
    function timeDurationWidth(minutes: number | string): number | void {
      if (calendar.value) {
        return calendar.value.timeDurationWidth(minutes)
      }
    }

    /**
     * Returns the vertical height for a duration in interval-based views.
     *
     * @param minutes Duration in minutes.
     * @param-example minutes 60
     * @applicable day, agenda, month-interval, scheduler
     * @returns Rendered duration height in pixels when the active view supports intervals.
     */
    function timeDurationHeight(minutes: number | string): number | void {
      if (calendar.value) {
        return calendar.value.timeDurationHeight(minutes)
      }
    }

    /**
     * Converts a rendered height into minutes in interval-based views.
     *
     * @param height Height in pixels or CSS unit input.
     * @param-example height 120
     * @applicable day
     * @returns Duration in minutes when the active view supports vertical interval conversion.
     */
    function heightToMinutes(height: number | string): number | void {
      if (calendar.value) {
        return calendar.value.heightToMinutes(height)
      }
    }

    /**
     * Converts a rendered width into minutes in resource views.
     *
     * @param width Width in pixels or CSS unit input.
     * @param-example width 120
     * @applicable resource
     * @returns Duration in minutes when the active view supports horizontal interval conversion.
     */
    function widthToMinutes(width: number | string): number | void {
      if (calendar.value) {
        return calendar.value.widthToMinutes(width)
      }
    }

    /**
     * Scrolls an interval-based view vertically to a time.
     *
     * @param time Time in HH:mm format.
     * @param duration Animation duration in milliseconds.
     * @param-example time '09:00'
     * @param-example duration 200
     * @applicable day, agenda, month-interval, scheduler
     */
    function scrollToTime(time: string, duration: number = 0): void {
      if (calendar.value) {
        calendar.value.scrollToTime(time, duration)
      }
    }

    /**
     * Scrolls a resource view horizontally to a time.
     *
     * @param time Time in HH:mm format.
     * @param duration Animation duration in milliseconds.
     * @param-example time '09:00'
     * @param-example duration 200
     * @applicable resource
     */
    function scrollToTimeX(time: string, duration: number = 0): void {
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
