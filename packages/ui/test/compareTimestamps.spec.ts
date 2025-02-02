import { describe, it, expect } from 'vitest'
import {
  parseTimestamp,
  parseDate,
  compareTimestamps,
  type Timestamp,
} from '../src/utils/Timestamp'

describe('[TIMESTAMP] compareTimestamps', () => {
  it('Compare 2 timestamps are the same', async () => {
    const ts1 = parseTimestamp('2020-01-01') as Timestamp
    const ts2 = parseTimestamp('2020-01-01') as Timestamp
    const tests = compareTimestamps(ts1, ts2)
    expect(tests).toBe(true)
  })

  it('Compare 2 timestamps are NOT the same', async () => {
    const ts1 = parseTimestamp('2020-01-01') as Timestamp
    const ts2 = parseTimestamp('2020-12-31') as Timestamp
    const tests = compareTimestamps(ts1, ts2)
    expect(tests).toBe(false)
  })

  it('Compare 2 timestamps are the same with Date', async () => {
    const ts1 = parseTimestamp('2020-01-01') as Timestamp
    const ts2 = parseDate(new Date(2020, 0, 1)) as Timestamp
    const tests = compareTimestamps(ts1, ts2)
    expect(tests).toBe(true)
  })

  it('Compare 2 timestamps are NOT the same with Date', async () => {
    const ts1 = parseTimestamp('2020-01-01') as Timestamp
    const ts2 = parseDate(new Date(2020, 11, 31)) as Timestamp
    const tests = compareTimestamps(ts1, ts2)
    expect(tests).toBe(false)
  })
})
