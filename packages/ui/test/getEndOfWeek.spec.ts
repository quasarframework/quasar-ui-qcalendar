import { describe, it, expect } from 'vitest'
import * as timestamp from '@timestamp-js/core'

describe('[TIMESTAMP] getEndOfWeek', () => {
  it('getEndOfWeek 2020-01-01', () => {
    const ts = timestamp.parseTimestamp('2020-01-01')
    const tests = timestamp.getEndOfWeek(ts, [0, 1, 2, 3, 4, 5, 6])
    expect(tests.day).toBe(4)
  })

  it('getEndOfWeek 2020-01-31', () => {
    const ts = timestamp.parseTimestamp('2020-01-31')
    const tests = timestamp.getEndOfWeek(ts, [0, 1, 2, 3, 4, 5, 6])
    expect(tests.day).toBe(1)
  })

  it('getEndOfWeek 2022-08-08', () => {
    const ts = timestamp.parseTimestamp('2022-08-08')
    const tests = timestamp.getEndOfWeek(ts, [0, 1, 2, 3, 4, 5, 6])
    expect(tests.day).toBe(13)
  })

  it('getEndOfWeek 2022-08-08 with now', () => {
    const ts = timestamp.parseTimestamp('2022-08-08')
    const now = timestamp.parseDate(new Date())
    const tests = timestamp.getEndOfWeek(ts, [0, 1, 2, 3, 4, 5, 6], now)
    expect(tests.day).toBe(13)
  })

  it('getEndOfWeek 2022-08-08, restricted weekdays and now', () => {
    const ts = timestamp.parseTimestamp('2022-08-08')
    const now = timestamp.parseDate(new Date())
    const tests = timestamp.getEndOfWeek(ts, [1, 2, 3, 4, 5], now)
    expect(tests.day).toBe(12)
  })

  it('getEndOfWeek 2022-08-31, restricted weekdays, on last day of month, with now', () => {
    const ts = timestamp.parseTimestamp('2022-08-31')
    const now = timestamp.parseDate(new Date())
    const tests = timestamp.getEndOfWeek(ts, [4, 5], now)
    expect(tests.day).toBe(26)
  })
})
