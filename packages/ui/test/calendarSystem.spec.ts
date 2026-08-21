import { describe, expect, it } from 'vitest'
import {
  getCalendarDayIdentifier,
  getEpochDay,
  gregorianCalendar,
  parseCalendarTimestamp,
  parsed,
  type Timestamp,
} from '@timestamp-js/core'

import {
  getCalendarScopeData,
  getResolvedCalendarSystem,
  toCalendarTimestamp,
  toGregorianTimestamp,
} from '../src/utils/calendarSystem'
import { calendarAdapterCases } from './fixtures/calendarAdapters'

describe('[QCALENDAR] calendar system interoperability', () => {
  it.each(calendarAdapterCases)(
    'converts the known $name native boundary to its Gregorian identity',
    ({ calendar, nativeDate, gregorianDate, epochDay }) => {
      const nativeTimestamp = parseCalendarTimestamp(nativeDate, calendar) as Timestamp
      const gregorianTimestamp = toGregorianTimestamp(nativeTimestamp, calendar)
      const scope = getCalendarScopeData(nativeTimestamp, calendar)

      expect(gregorianTimestamp.date).toBe(gregorianDate)
      expect(getEpochDay(gregorianTimestamp)).toBe(epochDay)
      expect(scope.calendarTimestamp.date).toBe(nativeDate)
      expect(scope.calendarIdentity).toEqual(
        expect.objectContaining({
          calendarId: calendar.id,
          nativeDate,
          gregorianDate,
          epochDay,
        }),
      )
      expect(scope.calendarSystem).toBe(calendar)
    },
  )

  it.each(calendarAdapterCases)(
    'preserves the absolute day when switching from $name to every shipped adapter',
    ({ calendar: sourceCalendar, nativeDate, gregorianDate, epochDay }) => {
      const source = parseCalendarTimestamp(nativeDate, sourceCalendar) as Timestamp
      const gregorian = toGregorianTimestamp(source, sourceCalendar)

      for (const { calendar: targetCalendar } of calendarAdapterCases) {
        const target = toCalendarTimestamp(gregorian, targetCalendar)
        const targetScope = getCalendarScopeData(target, targetCalendar)

        expect(getCalendarDayIdentifier(target, targetCalendar)).toBe(epochDay)
        expect(targetScope.calendarIdentity).toEqual(
          expect.objectContaining({
            calendarId: targetCalendar.id,
            gregorianDate,
            epochDay,
          }),
        )
      }
    },
  )

  it('keeps Gregorian behavior as the default', () => {
    const timestamp = parsed('2024-03-11') as Timestamp
    const scope = getCalendarScopeData(timestamp)

    expect(getResolvedCalendarSystem()).toBe(gregorianCalendar)
    expect(toCalendarTimestamp(timestamp)).toBe(timestamp)
    expect(toGregorianTimestamp(timestamp)).toBe(timestamp)
    expect(scope.calendarTimestamp).toBe(timestamp)
    expect(scope.calendarIdentity).toEqual(
      expect.objectContaining({
        calendarId: gregorianCalendar.id,
        nativeDate: '2024-03-11',
        gregorianDate: '2024-03-11',
        epochDay: 19793,
      }),
    )
  })
})
