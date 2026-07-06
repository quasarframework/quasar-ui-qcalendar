import { computed, ComputedRef } from 'vue'
import {
  copyTimestamp,
  daysInMonth,
  getCalendarEndOfMonth,
  getCalendarStartOfMonth,
  getStartOfMonth,
  getEndOfMonth,
  gregorianCalendar,
  getStartOfWeek,
  getEndOfWeek,
  moveRelativeDays,
  updateFormatted,
  nextDay,
  type CalendarSystem,
  type Timestamp,
} from '@timestamp-js/core'

import { isGregorianCalendar, toCalendarTimestamp } from '../utils/calendarSystem'

/**
 * Type definitions for the properties
 */
interface UseRenderValuesProps {
  calendarSystem?: CalendarSystem
  maxDays?: number
  weekdays: number[]
}

/**
 * Type definitions for parsed values passed to the function
 */
interface UseRenderValuesContext {
  parsedView: { value: string }
  parsedValue: { value: any } // Timestamp type expected from the Timestamp utility
  times: { today: any } // The current timestamp
}

interface UseRenderValuesReturn {
  renderValues: ComputedRef<{
    start: any
    end: any
    maxDays: number
  }>
}

export default function useRenderValues(
  props: UseRenderValuesProps,
  { parsedView, parsedValue, times }: UseRenderValuesContext,
): UseRenderValuesReturn {
  const calendarToday = computed(() => toCalendarTimestamp(times.today, props.calendarSystem))

  function getMonthRange(around: Timestamp): { start: Timestamp; end: Timestamp; maxDays: number } {
    const calendar = props.calendarSystem ?? gregorianCalendar

    if (isGregorianCalendar(calendar) === true) {
      const start = getStartOfMonth(around)
      const end = getEndOfMonth(around)

      return {
        start,
        end,
        maxDays: daysInMonth(start.year, start.month),
      }
    }

    const calendarAround = toCalendarTimestamp(around, calendar)
    const calendarStart = getCalendarStartOfMonth(calendarAround, calendar)
    const calendarEnd = getCalendarEndOfMonth(calendarAround, calendar)

    return {
      start: calendarStart,
      end: calendarEnd,
      maxDays: calendar.daysInMonth(calendarStart.year, calendarStart.month),
    }
  }

  /**
   * Computes the start, end, and maxDays based on the given view
   */
  const renderValues = computed(() => {
    const around = parsedValue.value
    let maxDays = props.maxDays ?? 1
    let start = around
    let end = around

    switch (parsedView.value) {
      case 'month': {
        const monthRange = getMonthRange(around)
        start = monthRange.start
        end = monthRange.end
        maxDays = monthRange.maxDays
        break
      }

      case 'week':
      case 'week-agenda':
      case 'week-scheduler':
        start = getStartOfWeek(around, props.weekdays, calendarToday.value, props.calendarSystem)
        end = getEndOfWeek(start, props.weekdays, calendarToday.value, props.calendarSystem)
        maxDays = props.weekdays.length
        break

      case 'day':
      case 'scheduler':
      case 'agenda':
        end = moveRelativeDays(
          copyTimestamp(end),
          nextDay,
          maxDays > 1 ? maxDays - 1 : maxDays,
          props.weekdays,
          props.calendarSystem,
        )
        end = updateFormatted(end, props.calendarSystem)
        break

      case 'month-interval':
      case 'month-scheduler':
      case 'month-agenda': {
        const monthRange = getMonthRange(around)
        start = monthRange.start
        end = monthRange.end
        end = updateFormatted(end, props.calendarSystem)
        maxDays = monthRange.maxDays
        break
      }

      case 'resource':
        maxDays = 1
        end = moveRelativeDays(
          copyTimestamp(end),
          nextDay,
          maxDays,
          props.weekdays,
          props.calendarSystem,
        )
        end = updateFormatted(end, props.calendarSystem)
        break
    }

    return { start, end, maxDays }
  })

  return {
    renderValues,
  }
}
