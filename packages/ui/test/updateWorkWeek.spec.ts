import { describe, it, expect } from 'vitest'
import * as timestamp from '@timestamp-js/core'

describe('[TIMESTAMP] updateWorkWeek', () => {
  it('updateWorkWeek Jan 1', async () => {
    const ts = timestamp.parseTimestamp('2020-01-01')
    const tests = timestamp.updateWorkWeek(ts)
    expect(tests.workweek).toBe(1)
  })

  it('updateWorkWeek Dec 31', async () => {
    const ts = timestamp.parseTimestamp('2020-12-31')
    const tests = timestamp.updateWorkWeek(ts)
    expect(tests.workweek).toBe(53)
  })

  it('updateWorkWeek when year is 0', async () => {
    const ts = timestamp.copyTimestamp({
      ...timestamp.parseTimestamp('2020-12-31'),
      year: 0,
    })
    const tests = timestamp.updateWorkWeek(ts)
    const today = timestamp.parseTimestamp(timestamp.today())
    expect(tests.workweek).toBe(today.workweek)
  })
})
