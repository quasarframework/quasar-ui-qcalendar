// eslint-disable-next-line node/no-missing-require
const timestamp = require('utils/timestamp.js')

describe('[TIMESTAMP] isBetweenDates', () => {
  it('isBetweenDates 2002-01-01 and 2020-12-31', async () => {
    const start = timestamp.parsed('2020-01-01')
    const end = timestamp.parsed('2020-12-31')
    const date = timestamp.parsed('2020-01-01')
    const tests = timestamp.isBetweenDates(date, start, end)
    expect(tests).toBe(true)
  })

  it('isBetweenDates (false)', async () => {
    const start = timestamp.parsed('2020-01-01')
    const end = timestamp.parsed('2020-12-31')
    const date = timestamp.parsed('2019-01-01')
    const tests = timestamp.isBetweenDates(date, start, end)
    expect(tests).toBe(false)
  })

  it('isBetweenDates with time', async () => {
    const start = timestamp.parsed('2020-01-01 13:00')
    const end = timestamp.parsed('2020-01-01 13:05')
    const date = timestamp.parsed('2020-01-01 13:01')
    const tests = timestamp.isBetweenDates(date, start, end, true)
    expect(tests).toBe(true)
  })

  it('isBetweenDates with time (false)', async () => {
    const start = timestamp.parsed('2020-01-01 13:00')
    const end = timestamp.parsed('2020-01-01 13:05')
    const date = timestamp.parsed('2020-01-01 13:06')
    const tests = timestamp.isBetweenDates(date, start, end, true)
    expect(tests).toBe(false)
  })
})
