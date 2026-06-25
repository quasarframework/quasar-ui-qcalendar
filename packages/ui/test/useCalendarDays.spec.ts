import { ref } from 'vue'
import { describe, expect, it } from 'vitest'
import { parsed, type Timestamp } from '@timestamp-js/core'

import useCalendarDays, { type CalendarDaysProps } from '../src/composables/useCalendarDays'

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
})
