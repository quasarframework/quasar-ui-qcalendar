import { describe, it, expect } from 'vitest'
import * as timestamp from '@timestamp-js/core'

describe('[TIMESTAMP] getDateTime', () => {
  it('getDateTime 2020-01-01 03:21', () => {
    const ts = timestamp.parsed('2020-01-01 03:21')
    const tests = timestamp.getDateTime(ts)
    expect(tests).toBe('2020-01-01 03:21')
  })

  it('getDateTime 2020-01-01 (no time)', () => {
    const ts = timestamp.parsed('2020-01-01')
    const tests = timestamp.getDateTime(ts)
    expect(tests).toBe('2020-01-01 00:00')
  })
})
