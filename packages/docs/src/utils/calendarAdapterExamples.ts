import {
  createCalendarTimestampFromEpochDay,
  getCalendarDirection,
  getCalendarDayIdentifier,
  getCalendarEndOfMonth,
  getCalendarLocale,
  getCalendarMonthFormatter,
  getCalendarStartOfMonth,
  getCalendarWeekdays,
  getEpochDay,
  parseCalendarTimestamp,
  parseTimestamp,
  today,
  type CalendarSystem,
  type Timestamp,
} from '@timestamp-js/core'
import { islamicCivilCalendar } from '@timestamp-js/calendar-islamic'
import { indianNationalCalendar } from '@timestamp-js/calendar-saka'
import { hebrewCalendar } from '@timestamp-js/calendar-hebrew'

export type CalendarExampleId = 'islamic-civil' | 'saka' | 'hebrew'

export interface CalendarExample {
  id: CalendarExampleId
  label: string
  shortLabel: string
  calendar: CalendarSystem
  locale: string
  direction: 'ltr' | 'rtl'
  weekdays: number[]
  items: Record<string, string[]>
  taskItems: Record<string, string[]>
}

export const calendarExamples: CalendarExample[] = [
  {
    id: 'islamic-civil',
    label: 'Islamic Civil (Hijri)',
    shortLabel: 'Hijri',
    calendar: islamicCivilCalendar,
    locale: getCalendarLocale(islamicCivilCalendar),
    direction: getCalendarDirection(islamicCivilCalendar),
    weekdays: getCalendarWeekdays(islamicCivilCalendar),
    items: {
      '1445-09-29': ['Hijri planning date'],
      '1445-09-30': ['Month close'],
      '1445-10-01': ['Follow-up'],
      '1445-10-03': ['Native date key'],
    },
    taskItems: {
      '1445-09-29': ['Planning date'],
      '1445-09-30': ['Follow-up'],
      '1445-10-01': ['Native date key'],
      '1445-10-03': ['Check-in'],
    },
  },
  {
    id: 'saka',
    label: 'Indian National (Saka)',
    shortLabel: 'Saka',
    calendar: indianNationalCalendar,
    locale: getCalendarLocale(indianNationalCalendar),
    direction: getCalendarDirection(indianNationalCalendar),
    weekdays: getCalendarWeekdays(indianNationalCalendar),
    items: {
      '1946-01-01': ['New Saka year'],
      '1946-01-15': ['Native planning date'],
      '1946-01-31': ['Month close'],
      '1946-02-01': ['Follow-up'],
    },
    taskItems: {
      '1946-01-19': ['Planning date'],
      '1946-01-20': ['Follow-up'],
      '1946-01-21': ['Native date key'],
      '1946-01-23': ['Check-in'],
    },
  },
  {
    id: 'hebrew',
    label: 'Hebrew',
    shortLabel: 'Hebrew',
    calendar: hebrewCalendar,
    locale: getCalendarLocale(hebrewCalendar),
    direction: getCalendarDirection(hebrewCalendar),
    weekdays: getCalendarWeekdays(hebrewCalendar),
    items: {
      '5785-01-01': ['Rosh Hashanah'],
      '5785-01-15': ['Native planning date'],
      '5785-01-30': ['Month close'],
      '5785-02-01': ['Follow-up'],
    },
    taskItems: {
      '5785-01-14': ['Planning date'],
      '5785-01-15': ['Follow-up'],
      '5785-01-17': ['Native date key'],
      '5785-01-20': ['Check-in'],
    },
  },
]

export const calendarExampleDates: Record<CalendarExampleId, string> = Object.fromEntries(
  calendarExamples.map((example) => [example.id, today(example.calendar)]),
) as Record<CalendarExampleId, string>

export function getCalendarExample(id: CalendarExampleId): CalendarExample {
  return calendarExamples.find((entry) => entry.id === id) ?? calendarExamples[0]!
}

export function parseGregorianDate(value: string): Timestamp {
  const timestamp = parseTimestamp(value)

  if (timestamp === null) {
    throw new Error(`Invalid Gregorian date: ${value}`)
  }

  return timestamp
}

export function parseNativeDate(value: string, example: CalendarExample): Timestamp {
  const timestamp = parseCalendarTimestamp(value, example.calendar)

  if (timestamp === null) {
    throw new Error(`Invalid ${example.shortLabel} date: ${value}`)
  }

  return timestamp
}

export function toNativeTimestamp(timestamp: Timestamp, example: CalendarExample): Timestamp {
  if (timestamp.calendarId === example.calendar.id) {
    return timestamp
  }

  return createCalendarTimestampFromEpochDay(getEpochDay(timestamp), example.calendar)
}

export function toGregorianTimestamp(timestamp: Timestamp, example: CalendarExample): Timestamp {
  if (timestamp.calendarId !== example.calendar.id) {
    return timestamp
  }

  return createCalendarTimestampFromEpochDay(getCalendarDayIdentifier(timestamp, example.calendar))
}

export function getEquivalentNativeDate(
  value: string,
  fromExample: CalendarExample,
  toExample: CalendarExample,
): string {
  if (fromExample.id === toExample.id) {
    return value
  }

  const timestamp = parseNativeDate(value, fromExample)
  const epochDay = getCalendarDayIdentifier(timestamp, fromExample.calendar)

  return createCalendarTimestampFromEpochDay(epochDay, toExample.calendar).date
}

export function getNativeMonthName(timestamp: Timestamp, example: CalendarExample): string {
  const formatter = getCalendarMonthFormatter(example.calendar)

  return formatter(timestamp.month, 'long', example.locale, timestamp.year)
}

export function getNativeMonthShort(timestamp: Timestamp, example: CalendarExample): string {
  const formatter = getCalendarMonthFormatter(example.calendar)

  return formatter(timestamp.month, 'short', example.locale, timestamp.year)
}

export function getNativeMonthTitleLabel(timestamp: Timestamp, example: CalendarExample): string {
  const native = toNativeTimestamp(timestamp, example)
  const start = getCalendarStartOfMonth(native, example.calendar)

  return `${getNativeMonthName(start, example)} ${start.year}`
}

export function getNativeDateLabel(timestamp: Timestamp, example: CalendarExample): string {
  return `${timestamp.date} ${getNativeMonthName(timestamp, example)}`
}

export function getNativeHeaderLabel(timestamp: Timestamp, example: CalendarExample): string {
  return `${timestamp.day} ${getNativeMonthShort(timestamp, example)}`
}

export function getNativeBoundaryLabel(timestamp: Timestamp, example: CalendarExample): string {
  if (timestamp.day === 1) {
    return 'Month start'
  }

  if (timestamp.day === example.calendar.daysInMonth(timestamp.year, timestamp.month)) {
    return 'Month end'
  }

  return ''
}

export function getNativeMonthRangeLabel(timestamp: Timestamp, example: CalendarExample): string {
  const native = toNativeTimestamp(timestamp, example)
  const start = getCalendarStartOfMonth(native, example.calendar)
  const end = getCalendarEndOfMonth(native, example.calendar)

  return `${start.date} to ${end.date}`
}

export function isOutsideNativeMonth(
  timestamp: Timestamp,
  reference: Timestamp,
  example: CalendarExample,
): boolean {
  const native = toNativeTimestamp(timestamp, example)
  const nativeReference = toNativeTimestamp(reference, example)

  return native.year !== nativeReference.year || native.month !== nativeReference.month
}

export function getNativeItems(timestamp: Timestamp, example: CalendarExample): string[] {
  return example.items[timestamp.date] ?? []
}

export function getNativeTaskItems(timestamp: Timestamp, example: CalendarExample): string[] {
  return example.taskItems[timestamp.date] ?? []
}
