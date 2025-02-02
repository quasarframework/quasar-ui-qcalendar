import { describe, it, expect } from 'vitest'
import { parsed, nextDay, type Timestamp } from '../src/utils/Timestamp'

describe('[TIMESTAMP] nextDay', () => {
  it('nextDay rolls over to Jan 1, 2020 when given Dec 31, 2019', () => {
    const ts = parsed('2019-12-31') as Timestamp
    const result = nextDay(ts)
    expect(result.year).toBe(2020)
    expect(result.month).toBe(1)
    expect(result.day).toBe(1)
  })

  it('nextDay rolls over to Feb 1, 2020 when given Jan 31, 2020', () => {
    const ts = parsed('2020-01-31') as Timestamp
    const result = nextDay(ts)
    expect(result.year).toBe(2020)
    expect(result.month).toBe(2)
    expect(result.day).toBe(1)
  })
})
