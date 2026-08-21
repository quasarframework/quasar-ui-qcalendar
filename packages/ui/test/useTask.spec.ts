import { describe, expect, it } from 'vitest'
import useTask from '../src/composables/useTask'
import { parseCalendarTimestamp, parsed, type Timestamp } from '@timestamp-js/core'

import { calendarAdapterCases } from './fixtures/calendarAdapters'

describe('[QCALENDAR TASK] useTask', () => {
  it('computes the correct end date for a multi-month task view', () => {
    const { parsedEndDate, days } = useTask(
      {
        view: 'month',
        modelValue: '2025-01-15',
        viewCount: 2,
        weekdays: [0, 1, 2, 3, 4, 5, 6],
      },
      () => {},
      { times: { today: parsed('2025-01-15')! } },
    )

    expect(parsedEndDate.value?.date).toBe('2025-02-28')
    expect(days.value.at(0)?.date).toBe('2025-01-01')
    expect(days.value.at(-1)?.date).toBe('2025-02-28')
  })

  it.each(calendarAdapterCases)(
    'uses $name native day, week, and month ranges',
    ({ calendar, nativeDate, weekStart, weekEnd, monthStart, monthEnd, weekdays }) => {
      const today = parseCalendarTimestamp(nativeDate, calendar) as Timestamp
      const createTask = (view: 'day' | 'week' | 'month') =>
        useTask(
          {
            view,
            modelValue: nativeDate,
            viewCount: 1,
            weekdays: [...weekdays],
            calendarSystem: calendar,
          },
          () => {},
          { times: { today } },
        )

      const day = createTask('day')
      const week = createTask('week')
      const month = createTask('month')

      expect([day.parsedStartDate.value?.date, day.parsedEndDate.value?.date]).toEqual([
        nativeDate,
        nativeDate,
      ])
      expect([week.parsedStartDate.value?.date, week.parsedEndDate.value?.date]).toEqual([
        weekStart,
        weekEnd,
      ])
      expect([month.parsedStartDate.value?.date, month.parsedEndDate.value?.date]).toEqual([
        monthStart,
        monthEnd,
      ])
      expect(month.days.value.at(0)?.calendarId).toBe(calendar.id)
      expect(month.days.value.at(-1)?.calendarId).toBe(calendar.id)
    },
  )
})
