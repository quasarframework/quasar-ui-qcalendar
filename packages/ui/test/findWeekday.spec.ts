import { describe, it, expect } from 'vitest'
import * as timestamp from '@timestamp-js/core'

describe('[TIMESTAMP] findWeekday', () => {
  it('findWeekday (0) 2020-01-01', () => {
    const ts = timestamp.parseTimestamp('2020-01-01')
    const tests = timestamp.findWeekday(ts, 0)
    expect(tests.hasDay).toBe(true)
    expect(tests.year).toBe(2020)
    expect(tests.month).toBe(1)
    expect(tests.day).toBe(5)
    expect(tests.weekday).toBe(0)
  })

  it('findWeekday (0) 2020-01-01 prev', () => {
    const ts = timestamp.parseTimestamp('2020-01-01')
    const tests = timestamp.findWeekday(ts, 0, timestamp.prevDay)
    expect(tests.hasDay).toBe(true)
    expect(tests.year).toBe(2019)
    expect(tests.month).toBe(12)
    expect(tests.day).toBe(29)
    expect(tests.weekday).toBe(0)
  })

  it('findWeekday (3) 2020-01-01', () => {
    const ts = timestamp.parseTimestamp('2020-01-01')
    const tests = timestamp.findWeekday(ts, 3)
    expect(tests.hasDay).toBe(true)
    expect(tests.year).toBe(2020)
    expect(tests.month).toBe(1)
    expect(tests.day).toBe(1)
    expect(tests.weekday).toBe(3)
  })

  it('findWeekday (3) 2020-01-01 prev', () => {
    const ts = timestamp.parseTimestamp('2020-01-01')
    const tests = timestamp.findWeekday(ts, 3, timestamp.prevDay)
    expect(tests.hasDay).toBe(true)
    expect(tests.year).toBe(2020)
    expect(tests.month).toBe(1)
    expect(tests.day).toBe(1)
    expect(tests.weekday).toBe(3)
  })

  it('findWeekday (6) 2020-01-01', () => {
    const ts = timestamp.parseTimestamp('2020-01-01')
    const tests = timestamp.findWeekday(ts, 6)
    expect(tests.hasDay).toBe(true)
    expect(tests.year).toBe(2020)
    expect(tests.month).toBe(1)
    expect(tests.day).toBe(4)
    expect(tests.weekday).toBe(6)
  })

  it('findWeekday (6) 2020-01-01 with PrevDay', () => {
    const ts = timestamp.parseTimestamp('2020-01-01')
    const tests = timestamp.findWeekday(ts, 6, timestamp.prevDay)
    expect(tests.hasDay).toBe(true)
    expect(tests.year).toBe(2019)
    expect(tests.month).toBe(12)
    expect(tests.day).toBe(28)
    expect(tests.weekday).toBe(6)
  })
})
