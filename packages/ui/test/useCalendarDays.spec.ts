import { ref } from 'vue'
import { describe, expect, it } from 'vitest'
import {
  getEpochDay,
  parsed,
  type CalendarDateParts,
  type CalendarSystem,
  type Timestamp,
} from '@timestamp-js/core'

import useCalendarDays, { type CalendarDaysProps } from '../src/composables/useCalendarDays'

const nativeBoundaryCalendar: CalendarSystem = {
  id: 'native-boundary-test',
  label: 'Native boundary test',
  monthsInYear: () => 12,
  isLeapYear: () => false,
  daysInMonth: () => 30,
  toEpochDay(date: CalendarDateParts): number {
    const monthStart = date.month === 9 ? '2024-03-11' : '2024-04-10'
    return getEpochDay(parsed(monthStart) as Timestamp) + date.day - 1
  },
  fromEpochDay(epochDay: number): CalendarDateParts {
    const nextMonthStart = getEpochDay(parsed('2024-04-10') as Timestamp)

    if (epochDay >= nextMonthStart) {
      return {
        year: 1445,
        month: 10,
        day: epochDay - nextMonthStart + 1,
      }
    }

    return {
      year: 1445,
      month: 9,
      day: epochDay - getEpochDay(parsed('2024-03-11') as Timestamp) + 1,
    }
  },
  addDays(date: CalendarDateParts, amount: number): CalendarDateParts {
    return this.fromEpochDay(this.toEpochDay(date) + amount)
  },
  nextDay(date: CalendarDateParts): CalendarDateParts {
    return this.addDays(date, 1)
  },
  prevDay(date: CalendarDateParts): CalendarDateParts {
    return this.addDays(date, -1)
  },
  getDayOfYear(date: CalendarDateParts): number {
    return (date.month - 1) * 30 + date.day
  },
  getWeekday(date: CalendarDateParts): number {
    return (this.toEpochDay(date) + 4) % 7
  },
}

function createCalendarDaysProps(overrides: Partial<CalendarDaysProps> = {}): CalendarDaysProps {
  return {
    modelValue: '2026-06-01',
    weekdays: [0, 1, 2, 3, 4, 5, 6],
    dateType: 'round',
    weekdayAlign: 'center',
    dateAlign: 'center',
    bordered: false,
    dark: false,
    noAria: false,
    noActiveDate: false,
    noHeader: false,
    noScroll: false,
    shortWeekdayLabel: false,
    noDefaultHeaderText: false,
    noDefaultHeaderBtn: false,
    minWeekdayLabel: 1,
    weekdayBreakpoints: [75, 35],
    locale: 'en-US',
    animated: false,
    transitionPrev: 'slide-right',
    transitionNext: 'slide-left',
    selectedDates: [],
    selectedStartEndDates: [],
    hoverable: false,
    focusable: false,
    focusType: ['day'],
    columnCount: 0,
    columnIndexStart: 0,
    maxDays: 1,
    ...overrides,
  }
}

describe('[QCALENDAR] useCalendarDays', () => {
  it('computes visible days and cell width without interval props', () => {
    const { days, parsedCellWidth } = useCalendarDays(createCalendarDaysProps(), {
      times: { today: parsed('2026-06-01') as Timestamp },
      parsedStart: ref(parsed('2026-06-01') as Timestamp),
      parsedEnd: ref(parsed('2026-06-03') as Timestamp),
      maxDays: ref(3),
      size: { width: 300 },
      headerColumnRef: ref({ offsetWidth: 210 } as HTMLElement),
    })

    expect(days.value.map((day) => day.date)).toEqual(['2026-06-01', '2026-06-02', '2026-06-03'])
    expect(parsedCellWidth.value).toBe(70)
  })

  it('parses a cell width expressed in CSS pixels', () => {
    const { parsedCellWidth } = useCalendarDays(createCalendarDaysProps({ cellWidth: '200px' }), {
      times: { today: parsed('2026-06-01') as Timestamp },
      parsedStart: ref(parsed('2026-06-01') as Timestamp),
      parsedEnd: ref(parsed('2026-06-01') as Timestamp),
      maxDays: ref(1),
      size: { width: 300 },
      headerColumnRef: ref(null),
    })

    expect(parsedCellWidth.value).toBe(200)
  })

  it('keeps legacy slot time helpers deterministic for non-interval views', () => {
    const { getScopeForSlot, styleDefault } = useCalendarDays(createCalendarDaysProps(), {
      times: { today: parsed('2026-06-01') as Timestamp },
      parsedStart: ref(parsed('2026-06-01') as Timestamp),
      parsedEnd: ref(parsed('2026-06-01') as Timestamp),
      maxDays: ref(1),
      size: { width: 300 },
      headerColumnRef: ref(null),
    })

    const scope = getScopeForSlot(parsed('2026-06-01') as Timestamp, 2)

    expect(scope.columnIndex).toBe(2)
    expect(scope.timeDurationHeight(120)).toBe(80)
    expect(scope.timeStartPos('12:00')).toBe(480)
    expect(scope.timeStartPos('noon')).toBe(false)
    expect(styleDefault({ scope })).toEqual({})
  })

  it('marks adapter dates outside the active native month as outside and disabled', () => {
    const { getScopeForSlot } = useCalendarDays(
      createCalendarDaysProps({
        calendarSystem: nativeBoundaryCalendar,
      }),
      {
        times: { today: parsed('2024-04-08') as Timestamp },
        parsedStart: ref(parsed('2024-04-06') as Timestamp),
        parsedEnd: ref(parsed('2024-04-12') as Timestamp),
        activeDate: ref(parsed('2024-04-08') as Timestamp),
        maxDays: ref(7),
        size: { width: 700 },
        headerColumnRef: ref(null),
      },
    )

    expect(getScopeForSlot(parsed('2024-04-09') as Timestamp).outside).toBe(false)
    expect(getScopeForSlot(parsed('2024-04-09') as Timestamp).disabled).toBe(false)
    expect(getScopeForSlot(parsed('2024-04-10') as Timestamp).outside).toBe(true)
    expect(getScopeForSlot(parsed('2024-04-10') as Timestamp).disabled).toBe(true)
  })

  it('keeps adapter-native disabled props active when a calendar adapter is used', () => {
    const { getScopeForSlot } = useCalendarDays(
      createCalendarDaysProps({
        calendarSystem: nativeBoundaryCalendar,
        disabledDays: ['1445-09-28'],
        disabledBefore: '1445-09-28',
        disabledAfter: '1445-10-01',
        disabledWeekdays: [1],
      }),
      {
        times: { today: parsed('2024-04-08') as Timestamp },
        parsedStart: ref(parsed('2024-04-06') as Timestamp),
        parsedEnd: ref(parsed('2024-04-12') as Timestamp),
        activeDate: ref(parsed('2024-04-08') as Timestamp),
        maxDays: ref(7),
        size: { width: 700 },
        headerColumnRef: ref(null),
      },
    )

    expect(getScopeForSlot(parsed('2024-04-06') as Timestamp).disabled).toBe(true)
    expect(getScopeForSlot(parsed('2024-04-07') as Timestamp).disabled).toBe(true)
    expect(getScopeForSlot(parsed('2024-04-08') as Timestamp).disabled).toBe(true)
    expect(getScopeForSlot(parsed('2024-04-09') as Timestamp).disabled).toBe(false)
    expect(getScopeForSlot(parsed('2024-04-11') as Timestamp).disabled).toBe(true)
  })
})
