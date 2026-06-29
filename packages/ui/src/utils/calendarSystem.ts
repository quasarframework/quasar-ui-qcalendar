import {
  createCalendarTimestampFromEpochDay,
  getCalendarDayIdentifier,
  getCalendarEndOfMonth,
  getCalendarStartOfMonth,
  getEpochDay,
  gregorianCalendar,
  type CalendarSystem,
  type Timestamp,
} from '@timestamp-js/core'

export interface CalendarScopeData {
  /** Timestamp represented in the configured calendar system. */
  calendarTimestamp: Timestamp
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

  if (isGregorianCalendar(calendar) === true) {
    return timestamp
  }

  return createCalendarTimestampFromEpochDay(getEpochDay(timestamp), calendar)
}

export function toGregorianTimestamp(
  timestamp: Timestamp,
  calendarSystem?: CalendarSystem,
): Timestamp {
  const calendar = getResolvedCalendarSystem(calendarSystem)

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

  return {
    calendarTimestamp: toCalendarTimestamp(timestamp, calendar),
    calendarSystem: calendar,
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
