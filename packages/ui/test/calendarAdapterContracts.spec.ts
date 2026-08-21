import { ref } from 'vue'
import { describe, expect, it, vi } from 'vitest'
import { parseCalendarTimestamp, type Timestamp } from '@timestamp-js/core'

import useCommon, { type CommonProps } from '../src/composables/useCommon'
import useMonth, { type MonthProps } from '../src/composables/useMonth'
import type { CellWidthProps } from '../src/composables/useCellWidth'
import { calendarAdapterCases, type CalendarAdapterCase } from './fixtures/calendarAdapters'

function createCommonProps({
  calendar,
  nativeDate,
  locale,
  direction,
  weekdays,
}: CalendarAdapterCase): CommonProps {
  return {
    modelValue: nativeDate,
    calendarSystem: calendar,
    weekdays: [...weekdays],
    dir: direction,
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
    locale,
    animated: false,
    transitionPrev: 'slide-right',
    transitionNext: 'slide-left',
    selectedDates: [nativeDate],
    selectedStartEndDates: [],
    hoverable: false,
    focusable: false,
    focusType: ['date'],
  }
}

function createMonthProps(
  adapterCase: CalendarAdapterCase,
): CommonProps & MonthProps & CellWidthProps {
  return {
    ...createCommonProps(adapterCase),
    dayHeight: 0,
    dayMinHeight: 0,
    minWeeks: 1,
    shortMonthLabel: false,
    showWorkWeeks: false,
    showMonthLabel: true,
    showDayOfYearLabel: false,
    enableOutsideDays: true,
    noOutsideDays: false,
    hover: false,
    breakpoint: 'md',
    monthLabelSize: 'sm',
  }
}

describe('[QCALENDAR] calendar adapter contracts', () => {
  it.each(calendarAdapterCases)(
    'uses $name native selection and range identities',
    (adapterCase) => {
      const { calendar, nativeDate, previousDate, nextDate } = adapterCase
      const current = parseCalendarTimestamp(nativeDate, calendar) as Timestamp
      const common = useCommon(createCommonProps(adapterCase), {
        startDate: ref(nativeDate),
        endDate: ref(nextDate),
        times: { today: current },
      })

      expect(common.arrayHasDate([nativeDate], current)).toBe(true)
      expect(common.getRelativeClasses(current, false, [nativeDate])['q-selected']).toBe(true)
      expect(common.checkDays([previousDate, nextDate], current)).toEqual({
        firstDay: false,
        betweenDays: true,
        lastDay: false,
      })
    },
  )

  it.each(calendarAdapterCases)(
    'uses $name month boundaries, labels, and weekday order',
    (adapterCase) => {
      const { calendar, nativeDate, monthStart, monthEnd, localizedMonthLabel, weekdays } =
        adapterCase
      const current = parseCalendarTimestamp(nativeDate, calendar) as Timestamp
      const month = useMonth(createMonthProps(adapterCase), vi.fn(), {
        times: { today: current },
        parsedStart: ref(current),
        parsedEnd: ref(current),
        size: { width: 700 },
        headerColumnRef: ref(null),
      })

      expect(month.days.value.map((day) => day.date)).toContain(monthStart)
      expect(month.days.value.map((day) => day.date)).toContain(monthEnd)
      expect(month.monthFormatter.value(current)).toBe(localizedMonthLabel)
      expect(month.todayWeek.value.map((day) => day.weekday)).toEqual([...weekdays])
    },
  )
})
