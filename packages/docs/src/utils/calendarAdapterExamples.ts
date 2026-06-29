import {
  createCalendarTimestampFromEpochDay,
  getCalendarEndOfMonth,
  getCalendarStartOfMonth,
  getEpochDay,
  parseTimestamp,
  type CalendarSystem,
  type Timestamp,
} from '@timestamp-js/core'
import { islamicCivilCalendar } from '@timestamp-js/calendar-islamic'
import { indianNationalCalendar } from '@timestamp-js/calendar-saka'

export type CalendarExampleId = 'islamic-civil' | 'saka'

export interface CalendarExample {
  id: CalendarExampleId
  label: string
  shortLabel: string
  calendar: CalendarSystem
  locale: string
  direction: 'ltr' | 'rtl'
  weekdays: number[]
  months: string[]
  monthShorts: string[]
  items: Record<string, string[]>
  taskItems: Record<string, string[]>
}

export const calendarExamples: CalendarExample[] = [
  {
    id: 'islamic-civil',
    label: 'Islamic Civil (Hijri)',
    shortLabel: 'Hijri',
    calendar: islamicCivilCalendar,
    locale: 'ar',
    direction: 'rtl',
    weekdays: [6, 0, 1, 2, 3, 4, 5],
    months: [
      'محرم',
      'صفر',
      'ربيع الأول',
      'ربيع الآخر',
      'جمادى الأولى',
      'جمادى الآخرة',
      'رجب',
      'شعبان',
      'رمضان',
      'شوال',
      'ذو القعدة',
      'ذو الحجة',
    ],
    monthShorts: [
      'محرم',
      'صفر',
      'ربيع ١',
      'ربيع ٢',
      'جمادى ١',
      'جمادى ٢',
      'رجب',
      'شعبان',
      'رمضان',
      'شوال',
      'قعدة',
      'حجة',
    ],
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
    locale: 'hi-IN',
    direction: 'ltr',
    weekdays: [0, 1, 2, 3, 4, 5, 6],
    months: [
      'चैत्र',
      'वैशाख',
      'ज्येष्ठ',
      'आषाढ़',
      'श्रावण',
      'भाद्र',
      'आश्विन',
      'कार्तिक',
      'अग्रहायण',
      'पौष',
      'माघ',
      'फाल्गुन',
    ],
    monthShorts: ['चै', 'वै', 'ज्ये', 'आषा', 'श्रा', 'भा', 'आश्वि', 'का', 'अग्र', 'पौ', 'मा', 'फा'],
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
]

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

export function toNativeTimestamp(timestamp: Timestamp, example: CalendarExample): Timestamp {
  return createCalendarTimestampFromEpochDay(getEpochDay(timestamp), example.calendar)
}

export function toGregorianTimestamp(timestamp: Timestamp, example: CalendarExample): Timestamp {
  return createCalendarTimestampFromEpochDay(getEpochDay(timestamp, example.calendar))
}

export function getNativeMonthName(timestamp: Timestamp, example: CalendarExample): string {
  return example.months[timestamp.month - 1] ?? `Month ${timestamp.month}`
}

export function getNativeMonthShort(timestamp: Timestamp, example: CalendarExample): string {
  return (
    example.monthShorts[timestamp.month - 1] ?? getNativeMonthName(timestamp, example).slice(0, 3)
  )
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
