import { Ref } from 'vue'
import { type CalendarSystem, type Timestamp } from '@timestamp-js/core'

import { getCalendarScopeData } from '../utils/calendarSystem'

export const useCheckChangeEmits = [
  /**
   * Emitted when the view's visible date range changes.
   *
   * @param scope Changed visible range.
   * @param-type scope Object
   * @param-tsType scope CheckChangeEvent
   */
  'change',
] as const

export interface CheckChangeProps {
  days: Ref<Timestamp[]>
  lastStart: Ref<string | null>
  lastEnd: Ref<string | null>
  calendarSystem: () => CalendarSystem
}

export interface CheckChangeEvent {
  /** First visible date in the range. */
  start: string
  /** Last visible date in the range. */
  end: string
  /** Visible timestamps in the range. */
  days: Timestamp[]
  /** First visible date represented in the configured calendar system. */
  calendarStart: string
  /** Last visible date represented in the configured calendar system. */
  calendarEnd: string
  /** Visible timestamps represented in the configured calendar system. */
  calendarDays: Timestamp[]
  /** Calendar system used to create `calendarDays`. */
  calendarSystem: CalendarSystem
}

interface CheckChangeReturn {
  checkChange: () => boolean
}

export default function useCheckChange(
  emit: (_event: 'change', _payload: CheckChangeEvent) => void,
  { days, lastStart, lastEnd, calendarSystem }: CheckChangeProps,
): CheckChangeReturn {
  function checkChange(): boolean {
    const dayList = days.value
    if (dayList.length === 0) return false

    const start = dayList[0]!.date
    const end = dayList[dayList.length - 1]!.date

    if (!lastStart.value || !lastEnd.value || start !== lastStart.value || end !== lastEnd.value) {
      lastStart.value = start
      lastEnd.value = end
      const calendar = calendarSystem()
      const calendarDays = dayList.map(
        (day) => getCalendarScopeData(day, calendar).calendarTimestamp,
      )

      emit('change', {
        start,
        end,
        days: dayList,
        calendarStart: calendarDays[0]!.date,
        calendarEnd: calendarDays[calendarDays.length - 1]!.date,
        calendarDays,
        calendarSystem: calendar,
      })
      return true
    }

    return false
  }

  return { checkChange }
}
