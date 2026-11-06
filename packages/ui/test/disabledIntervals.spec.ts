import { parseCalendarTimestamp, parsed, type Timestamp } from '@timestamp-js/core'
import { describe, expect, it } from 'vitest'
import { isDisabledInterval, normalizeDisabledIntervals } from '../src/utils/disabledIntervals'
import { calendarAdapterCases } from './fixtures/calendarAdapters'

describe('[QCALENDAR] disabled intervals', () => {
  it('matches the cell containing a date/time entry without disabling adjacent cells or dates', () => {
    const ranges = normalizeDisabledIntervals(['2026-11-06 14:15'])
    for (const [value, expected] of [
      ['2026-11-06 13:00', false],
      ['2026-11-06 14:00', true],
      ['2026-11-06 15:00', false],
      ['2026-11-07 14:00', false],
    ] as const) {
      expect(isDisabledInterval(parsed(value) as Timestamp, 60, ranges)).toBe(expected)
    }
  })

  it('disables any overlapping cell and keeps range ends exclusive', () => {
    const ranges = normalizeDisabledIntervals([
      { date: '2026-11-06', start: '09:15', end: '10:15' },
    ])
    for (const [time, expected] of [
      ['09:00', false],
      ['09:15', true],
      ['09:30', true],
      ['10:00', true],
      ['10:15', false],
    ] as const) {
      expect(isDisabledInterval(parsed(`2026-11-06 ${time}`) as Timestamp, 15, ranges)).toBe(
        expected,
      )
    }
    expect(isDisabledInterval(parsed('2026-11-06 09:00') as Timestamp, 60, ranges)).toBe(true)
  })

  it('supports the end of the date and cells that overlap midnight', () => {
    const ranges = normalizeDisabledIntervals([
      { date: '2026-11-06', start: '23:30', end: '24:00' },
    ])
    expect(isDisabledInterval(parsed('2026-11-06 23:00') as Timestamp, 60, ranges)).toBe(true)
    expect(isDisabledInterval(parsed('2026-11-07 00:00') as Timestamp, 60, ranges)).toBe(false)
    expect(
      isDisabledInterval(
        parsed('2026-11-06 23:30') as Timestamp,
        90,
        normalizeDisabledIntervals(['2026-11-07 00:15']),
      ),
    ).toBe(true)
  })

  it('repeats a daily time window across an inclusive date range', () => {
    const ranges = normalizeDisabledIntervals([
      { from: '2026-11-06', to: '2026-11-08', start: '09:15', end: '10:15' },
    ])
    for (const [value, expected] of [
      ['2026-11-05 09:30', false],
      ['2026-11-06 09:00', false],
      ['2026-11-06 09:15', true],
      ['2026-11-07 09:45', true],
      ['2026-11-07 18:00', false],
      ['2026-11-08 10:00', true],
      ['2026-11-08 10:15', false],
      ['2026-11-09 09:30', false],
    ] as const) {
      expect(isDisabledInterval(parsed(value) as Timestamp, 15, ranges)).toBe(expected)
    }
  })

  it('checks daily windows when a cell crosses midnight', () => {
    const ranges = normalizeDisabledIntervals([
      { from: '2026-11-06', to: '2026-11-08', start: '00:00', end: '00:30' },
    ])
    expect(isDisabledInterval(parsed('2026-11-05 23:30') as Timestamp, 60, ranges)).toBe(true)
    expect(isDisabledInterval(parsed('2026-11-08 23:30') as Timestamp, 60, ranges)).toBe(false)
  })

  it('ignores malformed entries and reversed or empty ranges', () => {
    expect(
      normalizeDisabledIntervals([
        '2026-11-06',
        '2026-11-06 24:00',
        '2026-11-06 09:60',
        '2026-99-99 09:00',
        { date: 'invalid', start: '09:00', end: '10:00' },
        { date: '2026-11-06', start: '10:00', end: '09:00' },
        { date: '2026-11-06', start: '09:00', end: '09:00' },
        { from: '2026-11-08', to: '2026-11-06', start: '09:00', end: '10:00' },
        { from: 'invalid', to: '2026-11-06', start: '09:00', end: '10:00' },
      ]),
    ).toEqual([])
  })

  it.each(calendarAdapterCases)(
    'uses $name native dates',
    ({ calendar, nativeDate, nextDate, monthEnd, nextMonthStart }) => {
      const ranges = normalizeDisabledIntervals(
        [{ date: nativeDate, start: '09:00', end: '10:00' }],
        calendar,
      )
      const timestamp = parseCalendarTimestamp(`${nativeDate} 09:30`, calendar) as Timestamp
      expect(isDisabledInterval(timestamp, 30, ranges, calendar)).toBe(true)
      expect(
        isDisabledInterval(
          parseCalendarTimestamp(`${nativeDate} 10:00`, calendar) as Timestamp,
          30,
          ranges,
          calendar,
        ),
      ).toBe(false)
      const dailyRanges = normalizeDisabledIntervals(
        [{ from: nativeDate, to: monthEnd, start: '09:00', end: '10:00' }],
        calendar,
      )
      for (const date of [nativeDate, nextDate, monthEnd]) {
        expect(
          isDisabledInterval(
            parseCalendarTimestamp(`${date} 09:30`, calendar) as Timestamp,
            30,
            dailyRanges,
            calendar,
          ),
        ).toBe(true)
      }
      expect(
        isDisabledInterval(
          parseCalendarTimestamp(`${nextMonthStart} 09:30`, calendar) as Timestamp,
          30,
          dailyRanges,
          calendar,
        ),
      ).toBe(false)
    },
  )
})
