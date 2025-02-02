import {
  DAYS_IN_MONTH_MAX,
  DAY_MIN,
  addToDate,
  copyTimestamp,
  relativeDays,
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
  weekdaySkips: Ref<number[]>
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
  {
    parsedView,
    parsedValue,
    weekdaySkips,
    direction,
    maxDays,
    times,
    emittedValue,
    emit,
  }: UseMoveContext,
): UseMoveReturn {
  /**
   * Moves the calendar the desired amount. This is based on the 'view'.
   * A month calendar moves by prev/next month
   * A week calendar moves by prev/next week
   * Other considerations are the 'weekdaySkips'; if a day of the week should be displayed (i.e., weekends turned off).
   * @param {number} amount The amount to move (default 1)
   * @fires 'moved' with current Timestamp
   */
  function move(amount = 1): void {
    if (amount === 0) {
      emittedValue.value = today()
      return
    }

    let moved = copyTimestamp(parsedValue.value)
    const forward = amount > 0
    const mover = forward ? nextDay : prevDay
    const limit = forward ? DAYS_IN_MONTH_MAX : DAY_MIN
    let count = forward ? amount : -amount
    direction.value = forward ? 'next' : 'prev'
    const dayCount = weekdaySkips.value.filter((x) => x !== 0).length

    while (--count >= 0) {
      switch (parsedView.value) {
        case 'month':
          // set to 1st or last day of the month
          moved.day = limit
          moved = mover(moved)
          moved = updateWeekday(moved)
          while (weekdaySkips.value[Number(moved.weekday)] === 0) {
            moved = addToDate(moved, { day: forward ? 1 : -1 })
          }
          break

        case 'week':
        case 'week-agenda':
        case 'week-scheduler':
          moved = relativeDays(moved, mover, dayCount, props.weekdays)
          break

        case 'day':
        case 'scheduler':
        case 'agenda':
          moved = relativeDays(moved, mover, maxDays.value, props.weekdays)
          break

        case 'month-interval':
        case 'month-agenda':
        case 'month-scheduler':
          // set to 1st or last day of the month
          moved.day = limit
          moved = mover(moved)
          break

        case 'resource':
          moved = relativeDays(moved, mover, maxDays.value, props.weekdays)
          break
      }
    }

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
