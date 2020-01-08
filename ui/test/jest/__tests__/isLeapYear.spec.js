// eslint-disable-next-line node/no-missing-require
const timestamp = require('utils/timestamp.js')

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
