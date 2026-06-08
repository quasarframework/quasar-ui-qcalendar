import { describe, it, expect } from 'vitest'
import * as timestamp from '@timestamp-js/core'

describe('[TIMESTAMP] getStartOfMonth', () => {
  it('getStartOfMonth 2020-01-01', () => {
    const ts = timestamp.parsed('2020-01-01')
    const tests = timestamp.getStartOfMonth(ts)
    expect(tests.day).toBe(1)
  })

  it('getStartOfMonth 2020-01-31', () => {
    const ts = timestamp.parsed('2020-01-31')
    const tests = timestamp.getStartOfMonth(ts)
    expect(tests.day).toBe(1)
  })

  it('getStartOfMonth 2022-08-08', () => {
    const ts = timestamp.parsed('2022-08-08')
    const tests = timestamp.getStartOfMonth(ts)
    expect(tests.day).toBe(1)
  })
})
