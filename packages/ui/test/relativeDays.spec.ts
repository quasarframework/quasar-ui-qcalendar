import { describe, it, expect } from 'vitest'
import {
  parseTimestamp,
  relativeDays,
  nextDay,
  prevDay,
  moveRelativeDays,
  type Timestamp,
} from '../src/utils/Timestamp'

describe('[TIMESTAMP] relativeDays', () => {
  it('relativeDays 2020-01-01, nextDay', async () => {
    const ts = parseTimestamp('2020-01-01') as Timestamp
    const tests = relativeDays(ts, nextDay)
    expect(tests.year).toBe(2020)
    expect(tests.month).toBe(1)
    expect(tests.day).toBe(2)
  })

  it('relativeDays 2020-01-01, prevDay', async () => {
    const ts = parseTimestamp('2020-01-01') as Timestamp
    const tests = moveRelativeDays(ts, prevDay)
    expect(tests.year).toBe(2019)
    expect(tests.month).toBe(12)
    expect(tests.day).toBe(31)
  })

  it('relativeDays 2020-01-01, nextDay, days=3', async () => {
    const ts = parseTimestamp('2020-01-01') as Timestamp
    const tests = relativeDays(ts, nextDay, 3)
    expect(tests.year).toBe(2020)
    expect(tests.month).toBe(1)
    expect(tests.day).toBe(4)
  })

  it('relativeDays 2020-01-01, prevDay, days=3', async () => {
    const ts = parseTimestamp('2020-01-01') as Timestamp
    const tests = relativeDays(ts, prevDay, 3)
    expect(tests.year).toBe(2019)
    expect(tests.month).toBe(12)
    expect(tests.day).toBe(29)
  })

  it('relativeDays 2020-01-01, nextDay, days=1, restricted weekdays', async () => {
    const ts = parseTimestamp('2020-01-01') as Timestamp
    const tests = relativeDays(ts, nextDay, 1, [4, 5])
    expect(tests.year).toBe(2020)
    expect(tests.month).toBe(1)
    expect(tests.day).toBe(2)
  })

  it('relativeDays 2020-01-01, prevDay, days=1, restricted weekdays', async () => {
    const ts = parseTimestamp('2020-01-01') as Timestamp
    const tests = relativeDays(ts, prevDay, 1, [4, 5])
    expect(tests.year).toBe(2019)
    expect(tests.month).toBe(12)
    expect(tests.day).toBe(27)
  })
})
