import { describe, it, expect } from 'vitest'
import * as timestamp from '@timestamp-js/core'

describe('[TIMESTAMP] updateWeekday', () => {
  it('updateWeekday', async () => {
    const ts = timestamp.parseTimestamp('2020-01-01')
    const tests = timestamp.updateWeekday(ts)
    expect(tests.weekday).toBe(3)
  })
})
