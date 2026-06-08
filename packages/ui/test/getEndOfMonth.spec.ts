import { describe, it, expect } from 'vitest'
import * as timestamp from '@timestamp-js/core'

describe('[TIMESTAMP] getEndOfMonth', () => {
  it('getEndOfMonth 2020-01-01', () => {
    const ts = timestamp.parsed('2020-01-01')
    const tests = timestamp.getEndOfMonth(ts)
    expect(tests.day).toBe(31)
  })

  it('getEndOfMonth 2020-02-01 (Leap Year)', () => {
    const ts = timestamp.parsed('2020-02-01')
    const tests = timestamp.getEndOfMonth(ts)
    expect(tests.day).toBe(29)
  })

  it('getEndOfMonth 2019-02-01 (NOT Leap Year)', () => {
    const ts = timestamp.parsed('2019-02-01')
    const tests = timestamp.getEndOfMonth(ts)
    expect(tests.day).toBe(28)
  })
})
