import { describe, it, expect } from 'vitest'
import { parseTimestamp, parseDate, createDayList, type Timestamp } from '../src/utils/Timestamp'

describe('[TIMESTAMP] createDayList', () => {
  it('createDayList', async () => {
    const start = parseTimestamp('2020-01-01') as Timestamp
    const end = parseTimestamp('2020-01-31') as Timestamp
    const now = parseDate(new Date()) as Timestamp
    const tests = createDayList(start, end, now, [0, 1, 2, 3, 4, 5, 6])
    expect(tests).toHaveLength(31)
  })

  it('createDayList inverted', async () => {
    const start = parseTimestamp('2020-01-01') as Timestamp
    const end = parseTimestamp('2020-01-31') as Timestamp
    const now = parseDate(new Date()) as Timestamp
    const tests = createDayList(end, start, now)
    expect(tests).toHaveLength(0)
  })

  it('createDayList with restricted weekday skips', async () => {
    const start = parseTimestamp('2020-01-01') as Timestamp
    const end = parseTimestamp('2020-01-31') as Timestamp
    const now = parseDate(new Date()) as Timestamp
    const tests = createDayList(start, end, now, [1, 2, 3, 4, 5])
    expect(tests).toHaveLength(23)
  })
})
