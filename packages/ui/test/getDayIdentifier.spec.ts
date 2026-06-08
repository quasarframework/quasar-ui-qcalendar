import { describe, it, expect } from 'vitest'
import * as timestamp from '@timestamp-js/core'

describe('[TIMESTAMP] getDayIdentifier', () => {
  it('getDayIdentifier 2020-01-01', () => {
    const ts = timestamp.parsed('2020-01-01')
    const tests = timestamp.getDayIdentifier(ts)
    expect(tests).toBe(202001010000)
  })

  it('getDayIdentifier 2020-01-31', () => {
    const ts = timestamp.parsed('2020-01-31')
    const tests = timestamp.getDayIdentifier(ts)
    expect(tests).toBe(202001310000)
  })

  it('getDayIdentifier 2022-08-08', () => {
    const ts = timestamp.parsed('2022-08-08')
    const tests = timestamp.getDayIdentifier(ts)
    expect(tests).toBe(202208080000)
  })
})
