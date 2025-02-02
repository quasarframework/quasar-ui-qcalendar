import { describe, it, expect } from 'vitest'
import { parsed, daysBetween, type Timestamp } from '../src/utils/Timestamp'

describe('[TIMESTAMP] daysBetween', () => {
  it('daysBetween 2020-01-01 and 2020-12-31 (Leap Year)', async () => {
    const start = parsed('2020-01-01') as Timestamp
    const end = parsed('2020-12-31') as Timestamp
    const tests = daysBetween(start, end)
    expect(tests).toBe(365)
  })

  it('daysBetween 2019-01-01 and 2019-12-31 (NOT Leap Year)', async () => {
    const start = parsed('2019-01-01') as Timestamp
    const end = parsed('2019-12-31') as Timestamp
    const tests = daysBetween(start, end)
    expect(tests).toBe(364)
  })

  it('daysBetween 2020-01-01 and 2020-03-31 (Leap Year)', async () => {
    const start = parsed('2020-01-01') as Timestamp
    const end = parsed('2020-03-31') as Timestamp
    const tests = daysBetween(start, end)
    expect(tests).toBe(90)
  })

  it('daysBetween 2019-01-01 and 2019-03-31 (NOT Leap Year)', async () => {
    const start = parsed('2019-01-01') as Timestamp
    const end = parsed('2019-03-31') as Timestamp
    const tests = daysBetween(start, end)
    expect(tests).toBe(89)
  })
})
