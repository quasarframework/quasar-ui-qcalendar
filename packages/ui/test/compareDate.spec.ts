import { describe, it, expect } from 'vitest'
import * as timestamp from '@timestamp-js/core'

describe('[TIMESTAMP] compareDate', () => {
  it('Compare 2 dates are the same', () => {
    const ts1 = timestamp.parsed('2020-01-01')
    const ts2 = timestamp.parsed('2020-01-01')
    const tests = timestamp.compareDate(ts1, ts2)
    expect(tests).toBe(true)
  })

  it('Compare 2 dates are NOT the same', () => {
    const ts1 = timestamp.parsed('2020-01-01')
    const ts2 = timestamp.parsed('2020-12-31')
    const tests = timestamp.compareDate(ts1, ts2)
    expect(tests).toBe(false)
  })

  it('Compare 2 dates are the same with Date', () => {
    const ts1 = timestamp.parsed('2020-01-01')
    const ts2 = timestamp.parseDate(new Date(2020, 0, 1)) // January is month 0
    const tests = timestamp.compareDate(ts1, ts2)
    expect(tests).toBe(true)
  })

  it('Compare 2 dates are NOT the same with Date', () => {
    const ts1 = timestamp.parsed('2020-01-01')
    const ts2 = timestamp.parseDate(new Date(2020, 11, 31)) // December is month 11
    const tests = timestamp.compareDate(ts1, ts2)
    expect(tests).toBe(false)
  })
})
