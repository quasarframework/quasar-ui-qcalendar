import {
  createCalendarTimestampFromEpochDay,
  getCalendarDateIdentity,
  getCalendarDayIdentifier,
  getCalendarEndOfMonth,
  getCalendarStartOfMonth,
  getEpochDay,
  gregorianCalendar,
  parseCalendarTimestamp,
  type CalendarDateIdentity,
  type CalendarSystem,
  type Timestamp,
} from '@timestamp-js/core'

export interface CalendarScopeData {
  /** Timestamp represented in the configured calendar system. */
  calendarTimestamp: Timestamp
  /** Stable native and Gregorian identity for the configured calendar system. */
  calendarIdentity: CalendarDateIdentity
  /** Calendar system used to create `calendarTimestamp`. */
  calendarSystem: CalendarSystem
}

export function getResolvedCalendarSystem(calendarSystem?: CalendarSystem): CalendarSystem {
  return calendarSystem ?? gregorianCalendar
}

export function isGregorianCalendar(calendarSystem?: CalendarSystem): boolean {
  return getResolvedCalendarSystem(calendarSystem).id === gregorianCalendar.id
}

export function toCalendarTimestamp(
  timestamp: Timestamp,
  calendarSystem?: CalendarSystem,
): Timestamp {
  const calendar = getResolvedCalendarSystem(calendarSystem)

  if (timestamp.calendarId === calendar.id || isGregorianCalendar(calendar) === true) {
    return timestamp
  }

  return createCalendarTimestampFromEpochDay(getEpochDay(timestamp), calendar)
}

export function toGregorianTimestamp(
  timestamp: Timestamp,
  calendarSystem?: CalendarSystem,
): Timestamp {
  const calendar = getResolvedCalendarSystem(calendarSystem)

  if (isGregorianCalendar(calendar) === true && timestamp.calendarId !== undefined) {
    return createCalendarTimestampFromEpochDay(getCalendarDayIdentifier(timestamp, calendar))
  }

  if (isGregorianCalendar(calendar) === true) {
    return timestamp
  }

  return createCalendarTimestampFromEpochDay(getCalendarDayIdentifier(timestamp, calendar))
}

export function getCalendarScopeData(
  timestamp: Timestamp,
  calendarSystem?: CalendarSystem,
): CalendarScopeData {
  const calendar = getResolvedCalendarSystem(calendarSystem)
  const calendarTimestamp = toCalendarTimestamp(timestamp, calendar)

  return {
    calendarTimestamp,
    calendarIdentity: getCalendarDateIdentity(calendarTimestamp, calendar),
    calendarSystem: calendar,
  }
}

export function getCalendarDateIdentifier(
  value: string | undefined,
  calendarSystem?: CalendarSystem,
): number | null {
  const timestamp = parseCalendarTimestampSafe(value, calendarSystem)

  return timestamp === null ? null : getCalendarDayIdentifier(timestamp, calendarSystem)
}

export function parseCalendarTimestampSafe(
  value: string | undefined,
  calendarSystem?: CalendarSystem,
  fallback?: Timestamp,
): Timestamp | null {
  if (!value) {
    return fallback ?? null
  }

  try {
    return parseCalendarTimestamp(value, calendarSystem, fallback)
  } catch {
    return fallback ?? null
  }
}

export function isOutsideCalendarMonth(
  timestamp: Timestamp,
  reference: Timestamp,
  calendarSystem?: CalendarSystem,
): boolean {
  const calendar = getResolvedCalendarSystem(calendarSystem)

  if (isGregorianCalendar(calendar) === true) {
    return false
  }

  const calendarTimestamp = toCalendarTimestamp(timestamp, calendar)
  const calendarReference = toCalendarTimestamp(reference, calendar)
  const calendarStart = getCalendarStartOfMonth(calendarReference, calendar)
  const calendarEnd = getCalendarEndOfMonth(calendarReference, calendar)
  const dayIdentifier = getCalendarDayIdentifier(calendarTimestamp, calendar)

  return (
    dayIdentifier < getCalendarDayIdentifier(calendarStart, calendar) ||
    dayIdentifier > getCalendarDayIdentifier(calendarEnd, calendar)
  )
}
