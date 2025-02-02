import { describe, it, expect } from 'vitest'
import { parsed, prevDay, type Timestamp } from '../src/utils/Timestamp'

describe('[TIMESTAMP] prevDay', () => {
  it('prevDay rolls over to Dec 31, 2019 when given Jan 1, 2020', () => {
    const ts = parsed('2020-01-01') as Timestamp
    const result = prevDay(ts)
    expect(result.year).toBe(2019)
    expect(result.month).toBe(12)
    expect(result.day).toBe(31)
  })

  it('prevDay rolls over to Jan 31, 2020 when given Feb 1, 2020', () => {
    const ts = parsed('2020-02-01') as Timestamp
    const result = prevDay(ts)
    expect(result.year).toBe(2020)
    expect(result.month).toBe(1)
    expect(result.day).toBe(31)
  })
})
