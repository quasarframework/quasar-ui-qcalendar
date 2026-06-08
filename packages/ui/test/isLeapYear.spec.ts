import { describe, it, expect } from 'vitest'
import * as timestamp from '@timestamp-js/core'

describe('[TIMESTAMP] isLeapYear', () => {
  it('2020 is a Leap Year', async () => {
    const tests = timestamp.isLeapYear(2020)
    expect(tests).toBe(true)
  })

  it('2019 is NOT a Leap Year', async () => {
    const tests = timestamp.isLeapYear(2019)
    expect(tests).toBe(false)
  })

  it('2000 is a Leap Year', async () => {
    const tests = timestamp.isLeapYear(2000)
    expect(tests).toBe(true)
  })

  it('2100 is NOT a Leap Year', async () => {
    const tests = timestamp.isLeapYear(2100)
    expect(tests).toBe(false)
  })
})
