import { describe, it, expect } from 'vitest'
import {
  parseTimestamp,
  parseDate,
  createIntervalList,
  type Timestamp,
} from '../src/utils/Timestamp'

describe('[TIMESTAMP] createIntervalList', () => {
  it('createIntervalList 60 12', async () => {
    const start = parseTimestamp('2020-01-01') as Timestamp
    const tests = createIntervalList(start, 0, 60, 12, parseDate(new Date()) as Timestamp)
    expect(tests).toHaveLength(12)
  })

  it('createIntervalList 15 48', async () => {
    const start = parseTimestamp('2020-01-01 03:00') as Timestamp
    const tests = createIntervalList(start, 8, 15, 48, parseDate(new Date()) as Timestamp)
    expect(tests).toHaveLength(48)
  })
})
