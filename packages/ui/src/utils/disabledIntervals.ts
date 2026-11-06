import type { CalendarSystem, Timestamp } from '@timestamp-js/core'
import { getCalendarDateIdentifier } from './calendarSystem'

interface DisabledIntervalTimes {
  /** Inclusive start time, in HH:mm form. */
  start: string
  /** Exclusive end time, in HH:mm form; 24:00 represents the end of the date. */
  end: string
}

/** A time window on one date or on each date in an inclusive date range. */
export type DisabledIntervalRange = DisabledIntervalTimes &
  (
    | {
        /** Date in the configured calendar system, in YYYY-MM-DD form. */
        date: string
        from?: never
        to?: never
      }
    | {
        date?: never
        /** Inclusive first date in the configured calendar system. */
        from: string
        /** Inclusive last date in the configured calendar system. */
        to: string
      }
  )

/** A date/time string selects its containing cell; a range selects overlapping cells. */
export type DisabledInterval = string | DisabledIntervalRange

interface IntervalRange {
  firstDay: number
  lastDay: number
  start: number
  end: number
}

function dateIdentifier(value: string | undefined, calendar?: CalendarSystem): number | null {
  return typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value)
    ? getCalendarDateIdentifier(value, calendar)
    : null
}

function minutes(value: string, allowEndOfDay = false): number | null {
  if (allowEndOfDay === true && value === '24:00') return 1440
  if (typeof value !== 'string' || !/^([01]\d|2[0-3]):[0-5]\d$/.test(value)) return null
  return Number(value.slice(0, 2)) * 60 + Number(value.slice(3))
}

export function normalizeDisabledIntervals(
  entries: readonly DisabledInterval[],
  calendar?: CalendarSystem,
): IntervalRange[] {
  const ranges: IntervalRange[] = []
  for (const entry of entries) {
    const match =
      typeof entry === 'string' ? /^(\d{4}-\d{2}-\d{2}) (\d{2}:\d{2})$/.exec(entry) : null
    if (
      typeof entry !== 'string' &&
      entry?.date !== undefined &&
      (entry.from !== undefined || entry.to !== undefined)
    )
      continue
    const firstDate = typeof entry === 'string' ? match?.[1] : (entry?.date ?? entry?.from)
    const lastDate = typeof entry === 'string' ? firstDate : (entry?.date ?? entry?.to)
    const firstDay = dateIdentifier(firstDate, calendar)
    const lastDay = firstDate === lastDate ? firstDay : dateIdentifier(lastDate, calendar)
    const start = minutes(typeof entry === 'string' ? (match?.[2] ?? '') : entry?.start)
    const end = typeof entry === 'string' ? start : minutes(entry?.end, true)
    if (
      firstDay === null ||
      lastDay === null ||
      lastDay < firstDay ||
      start === null ||
      end === null ||
      (typeof entry !== 'string' && end <= start)
    )
      continue
    ranges.push({ firstDay, lastDay, start, end })
  }
  return ranges
}

export function isDisabledInterval(
  timestamp: Timestamp,
  duration: number,
  ranges: readonly IntervalRange[],
  calendar?: CalendarSystem,
): boolean {
  if (ranges.length === 0) return false
  const day = getCalendarDateIdentifier(timestamp.date, calendar)
  if (day === null) return false
  const start = day * 1440 + timestamp.hour * 60 + timestamp.minute
  const end = start + duration
  return ranges.some((range) => {
    let date = Math.max(range.firstDay, Math.floor(start / 1440))
    const minute = start - date * 1440
    // Check the next date if the window on this date has already ended.
    if (range.start === range.end ? range.start < minute : range.end <= minute) date += 1
    return date <= range.lastDay && date * 1440 + range.start < end
  })
}
