import {
  addToDate,
  copyTimestamp,
  getEndOfMonth,
  moveRelativeDays,
  updateDayOfYear,
  updateFormatted,
  updateRelative,
  updateWeekday,
  nextDay,
  prevDay,
  today,
  Timestamp,
} from '../utils/Timestamp'
import { Ref, EmitFn } from 'vue'

export const useMoveEmits = ['moved']

/**
 * Type definition for props
 */
interface UseMoveProps {
  weekdays: number[]
}

/**
 * Type definition for the parameters injected into the composable
 */
interface UseMoveContext {
  parsedView: Ref<string>
  parsedValue: Ref<Timestamp>
  direction: Ref<string>
  maxDays: Ref<number>
  times: { now: Timestamp }
  emittedValue: Ref<string>
  emit: EmitFn
}

interface UseMoveReturn {
  move: (_amount?: number) => void
}

export default function useMove(
  props: UseMoveProps,
  { parsedView, parsedValue, direction, maxDays, times, emittedValue, emit }: UseMoveContext,
): UseMoveReturn {
  /**
   * Moves the calendar the desired amount. This is based on the 'view'.
   * A month calendar moves by prev/next month
   * A week calendar moves by prev/next week
   * Other considerations are the allowed weekdays; if a day of the week should be displayed (e.g., weekends turned off).
   * @param {number} amount The amount to move (default 1)
   * @fires 'moved' with current Timestamp
   */
  function move(amount = 1): void {
    if (amount === 0) {
      emittedValue.value = today()
      return
    }

    let moved = copyTimestamp(parsedValue.value)
    const lastDayOfMonth = getEndOfMonth(moved)
    const forward = amount > 0
    const mover = forward ? nextDay : prevDay
    const limit = forward ? lastDayOfMonth.day : 1 // 1st day of month
    let count = forward ? amount : -amount
    direction.value = forward ? 'next' : 'prev'
    // Instead of computing dayCount via weekdaySkips,
    // we simply count the allowed weekdays.
    const dayCount = props.weekdays.length

    while (--count >= 0) {
      switch (parsedView.value) {
        case 'month':
          // For month view, set to the first (or last) day of the month,
          // move one day, update the weekday, and adjust until an allowed day is reached.
          moved.day = limit
          moved = mover(moved)
          moved = updateWeekday(moved)
          while (!props.weekdays.includes(Number(moved.weekday))) {
            moved = addToDate(moved, { day: forward ? 1 : -1 })
          }
          break

        case 'week':
        case 'week-agenda':
        case 'week-scheduler':
          // For week-based views, use moveRelativeDays with allowed weekdays.
          moved = moveRelativeDays(moved, mover, dayCount, props.weekdays)
          break

        case 'day':
        case 'scheduler':
        case 'agenda':
          // For day views, move a number of days determined by maxDays, taking allowed weekdays into account.
          moved = moveRelativeDays(moved, mover, maxDays.value, props.weekdays)
          break

        case 'month-interval':
        case 'month-agenda':
        case 'month-scheduler':
          // For these month views, just set to the first or last day then move one day.
          moved.day = limit
          moved = mover(moved)
          break

        case 'resource':
          // For resource view, similar to the day view.
          moved = moveRelativeDays(moved, mover, maxDays.value, props.weekdays)
          break
      }
    }

    // After moving, update weekday, formatted values, day-of-year, and relative data.
    moved = updateWeekday(moved)
    moved = updateFormatted(moved)
    moved = updateDayOfYear(moved)
    moved = updateRelative(moved, times.now)

    emittedValue.value = moved.date
    emit('moved', moved)
  }

  return {
    move,
  }
}
