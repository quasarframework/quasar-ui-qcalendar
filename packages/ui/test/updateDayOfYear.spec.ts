import { describe, it, expect } from 'vitest'
import { parseTimestamp, updateDayOfYear, type Timestamp } from '../src/utils/Timestamp'

describe('[TIMESTAMP] updateDayOfYear', () => {
  it('updateDayOfYear Jan 1', async () => {
    const ts = parseTimestamp('2020-01-01') as Timestamp
    const tests = updateDayOfYear(ts)
    expect(tests.doy).toBe(1)
  })

  it('updateDayOfYear Dec 31 2020 (Leap Year)', async () => {
    const ts = parseTimestamp('2020-12-31') as Timestamp
    const tests = updateDayOfYear(ts)
    expect(tests.doy).toBe(366)
  })

  it('updateDayOfYear Dec 31 2019 (NOT Leap Year)', async () => {
    const ts = parseTimestamp('2019-12-31') as Timestamp
    const tests = updateDayOfYear(ts)
    expect(tests.doy).toBe(365)
  })

  it('updateDayOfYear invalid (0)', async () => {
    const ts = parseTimestamp('2020-01-01') as Timestamp
    ts.year = 0
    const tests = updateDayOfYear(ts)
    expect(tests.doy).toBe(0)
  })
})
