import { describe, it, expect } from 'vitest'
import { parsed, parseDate, compareTime, type Timestamp } from '../src/utils/Timestamp'

describe('[TIMESTAMP] compareTime', () => {
  it('Compare 2 times are the same', async () => {
    const ts1 = parsed('2020-01-01 01:00') as Timestamp
    const ts2 = parsed('2020-01-01 01:00') as Timestamp
    const tests = compareTime(ts1, ts2)
    expect(tests).toBe(true)
  })

  it('Compare 2 times are NOT the same', async () => {
    const ts1 = parsed('2020-01-01 01:00') as Timestamp
    const ts2 = parsed('2020-12-31 02:00') as Timestamp
    const tests = compareTime(ts1, ts2)
    expect(tests).toBe(false)
  })

  it('Compare 2 times are the same with Date', async () => {
    const ts1 = parsed('2020-01-01 01:00') as Timestamp
    const ts2 = parseDate(new Date(2020, 0, 1, 1, 0, 0)) as Timestamp
    const tests = compareTime(ts1, ts2)
    expect(tests).toBe(true)
  })

  it('Compare 2 times are NOT the same with Date', async () => {
    const ts1 = parsed('2020-01-01 01:00') as Timestamp
    const ts2 = parseDate(new Date(2020, 11, 31, 2, 0, 0)) as Timestamp
    const tests = compareTime(ts1, ts2)
    expect(tests).toBe(false)
  })
})
