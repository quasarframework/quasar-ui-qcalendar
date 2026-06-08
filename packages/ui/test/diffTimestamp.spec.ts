import { describe, it, expect } from 'vitest'
import * as timestamp from '@timestamp-js/core'

describe('[TIMESTAMP] diffTimestamp', () => {
  it('diffTimestamp 1 day', () => {
    const ts = timestamp.parsed('2020-01-01')
    const ts2 = timestamp.parsed('2020-01-02')
    const tests = timestamp.diffTimestamp(ts, ts2)
    expect(tests).toBe(86400000) // 1 day in milliseconds
  })

  it('diffTimestamp 5 days', () => {
    const ts = timestamp.parsed('2020-01-01')
    const ts2 = timestamp.parsed('2020-01-06')
    const tests = timestamp.diffTimestamp(ts, ts2)
    expect(tests).toBe(432000000) // 5 days in milliseconds
  })

  it('diffTimestamp 10 days', () => {
    const ts = timestamp.parsed('2020-01-01')
    const ts2 = timestamp.parsed('2020-01-11')
    const tests = timestamp.diffTimestamp(ts, ts2)
    expect(tests).toBe(864000000) // 10 days in milliseconds
  })

  it('diffTimestamp 30 days', () => {
    const ts = timestamp.parsed('2020-01-01')
    const ts2 = timestamp.parsed('2020-01-31')
    const tests = timestamp.diffTimestamp(ts, ts2)
    expect(tests).toBe(2592000000) // 30 days in milliseconds
  })

  it('diffTimestamp 31 days', () => {
    const ts = timestamp.parsed('2020-01-01')
    const ts2 = timestamp.parsed('2020-02-01')
    const tests = timestamp.diffTimestamp(ts, ts2)
    expect(tests).toBe(2678400000) // 31 days in milliseconds
  })

  it('diffTimestamp 2019', () => {
    const ts = timestamp.parsed('2019-01-01')
    const ts2 = timestamp.parsed('2019-12-31')
    const tests = timestamp.diffTimestamp(ts, ts2)
    expect(tests).toBe(31449600000) // Days in 2019 (non-leap year)
  })

  it('diffTimestamp 2020 (Leap Year)', () => {
    const ts = timestamp.parsed('2020-01-01')
    const ts2 = timestamp.parsed('2020-12-31')
    const tests = timestamp.diffTimestamp(ts, ts2)
    expect(tests).toBe(31536000000) // Days in 2020 (leap year)
  })

  it('diffTimestamp 2020, reverse dates', () => {
    const ts = timestamp.parsed('2020-01-01')
    const ts2 = timestamp.parsed('2020-12-31')
    const tests = timestamp.diffTimestamp(ts2, ts)
    expect(tests).toBe(-31536000000) // Negative value for reverse order
  })

  it('diffTimestamp 2020, reverse dates, with strict', () => {
    const ts = timestamp.parsed('2020-01-01')
    const ts2 = timestamp.parsed('2020-12-31')
    const tests = timestamp.diffTimestamp(ts2, ts, true)
    expect(tests).toBe(0) // Strict mode: no negative values
  })
})
