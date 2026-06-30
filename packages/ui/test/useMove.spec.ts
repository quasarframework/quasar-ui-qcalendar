import { ref } from 'vue'
import { describe, expect, it, vi } from 'vitest'
import {
  parseCalendarTimestamp,
  parsed,
  today,
  type CalendarDateParts,
  type CalendarSystem,
  type Timestamp,
} from '@timestamp-js/core'

import useMove from '../src/composables/useMove'

const fixedThirtyDayCalendar: CalendarSystem = Object.freeze({
  id: 'fixed-thirty',
  label: 'Fixed Thirty',
  defaultWeekdays: Object.freeze([0, 1, 2, 3, 4, 5, 6]),

  monthsInYear() {
    return 12
  },

  isLeapYear() {
    return false
  },

  daysInMonth() {
    return 30
  },

  toEpochDay(date: CalendarDateParts) {
    return date.year * 360 + (date.month - 1) * 30 + date.day - 1
  },

  fromEpochDay(epochDay: number) {
    const year = Math.floor(epochDay / 360)
    const dayOfYear = epochDay - year * 360

    return {
      year,
      month: Math.floor(dayOfYear / 30) + 1,
      day: (dayOfYear % 30) + 1,
    }
  },

  addDays(date: CalendarDateParts, amount: number) {
    return this.fromEpochDay(this.toEpochDay(date) + amount)
  },

  nextDay(date: CalendarDateParts) {
    return this.addDays(date, 1)
  },

  prevDay(date: CalendarDateParts) {
    return this.addDays(date, -1)
  },

  getDayOfYear(date: CalendarDateParts) {
    return (date.month - 1) * 30 + date.day
  },

  getWeekday(date: CalendarDateParts) {
    const weekday = this.toEpochDay(date) % 7

    return weekday < 0 ? weekday + 7 : weekday
  },
})

describe('[QCALENDAR] useMove', () => {
  it('emits moved when moving to today', () => {
    const todayDate = today()
    const emit = vi.fn()
    const emittedValue = ref('2026-06-01')

    const { move } = useMove(
      { weekdays: [0, 1, 2, 3, 4, 5, 6] },
      {
        parsedView: ref('month'),
        parsedValue: ref(parsed('2026-06-01') as Timestamp),
        direction: ref('next'),
        maxDays: ref(1),
        times: { now: parsed(todayDate) as Timestamp },
        emittedValue,
        emit,
      },
    )

    move(0)

    expect(emittedValue.value).toBe(todayDate)
    expect(emit).toHaveBeenCalledWith('moved', expect.objectContaining({ date: todayDate }))
  })

  it('keeps month navigation native for calendar adapters', () => {
    const emit = vi.fn()
    const emittedValue = ref('1448-01-14')
    const parsedValue = parseCalendarTimestamp(
      emittedValue.value,
      fixedThirtyDayCalendar,
    ) as Timestamp

    const { move } = useMove(
      { calendarSystem: fixedThirtyDayCalendar, weekdays: [0, 1, 2, 3, 4, 5, 6] },
      {
        parsedView: ref('month'),
        parsedValue: ref(parsedValue),
        direction: ref('next'),
        maxDays: ref(1),
        times: { now: parsed(today()) as Timestamp },
        emittedValue,
        emit,
      },
    )

    move(1)

    expect(emittedValue.value).toBe('1448-02-01')
    expect(emit).toHaveBeenCalledWith(
      'moved',
      expect.objectContaining({
        calendarId: fixedThirtyDayCalendar.id,
        date: '1448-02-01',
      }),
    )
  })
})
