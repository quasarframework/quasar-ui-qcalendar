import { describe, it, expect } from 'vitest'
import * as timestamp from '@timestamp-js/core'

describe('[TIMESTAMP] validateTimestamp', () => {
  it('validateTimestamp correct', async () => {
    const tests = timestamp.validateTimestamp('2020-01-01')
    expect(tests).toBe(true)
  })

  it('validateTimestamp with time correct', async () => {
    const tests = timestamp.validateTimestamp('2020-01-01 03:00')
    expect(tests).toBe(true)
  })

  it('validateTimestamp incorrect', async () => {
    const tests = timestamp.validateTimestamp('2020/01/01')
    expect(tests).toBe(false)
  })
})
