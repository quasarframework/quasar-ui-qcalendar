import { computed, ComputedRef } from 'vue'
import {
  copyTimestamp,
  daysInMonth,
  getStartOfMonth,
  getEndOfMonth,
  getStartOfWeek,
  getEndOfWeek,
  moveRelativeDays,
  updateFormatted,
  nextDay,
} from '../utils/Timestamp'

/**
 * Type definitions for the properties
 */
interface UseRenderValuesProps {
  maxDays: number
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
  /**
   * Computes the start, end, and maxDays based on the given view
   */
  const renderValues = computed(() => {
    const around = parsedValue.value
    let maxDays = props.maxDays
    let start = around
    let end = around

    switch (parsedView.value) {
      case 'month':
        start = getStartOfMonth(around)
        end = getEndOfMonth(around)
        maxDays = daysInMonth(start.year, start.month)
        break

      case 'week':
      case 'week-agenda':
      case 'week-scheduler':
        start = getStartOfWeek(around, props.weekdays, times.today)
        end = getEndOfWeek(start, props.weekdays, times.today)
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
        )
        end = updateFormatted(end)
        break

      case 'month-interval':
      case 'month-scheduler':
      case 'month-agenda':
        start = getStartOfMonth(around)
        end = getEndOfMonth(around)
        end = updateFormatted(end)
        maxDays = daysInMonth(start.year, start.month)
        break

      case 'resource':
        maxDays = 1
        end = moveRelativeDays(copyTimestamp(end), nextDay, maxDays, props.weekdays)
        end = updateFormatted(end)
        break
    }

    return { start, end, maxDays }
  })

  return {
    renderValues,
  }
}
