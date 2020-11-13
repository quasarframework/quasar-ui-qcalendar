// eslint-disable-next-line node/no-missing-require
const timestamp = require('utils/Timestamp.js')

describe('[TIMESTAMP] daysBetween', () => {
  it('daysBetween 2020-01-01 and 2020-12-31 (Leap Year)', async () => {
    const start = timestamp.parsed('2020-01-01')
    const end = timestamp.parsed('2020-12-31')
    const tests = timestamp.daysBetween(start, end)
    expect(tests).toBe(365)
  })

  it('daysBetween 2019-01-01 and 2019-12-31 (NOT Leap Year)', async () => {
    const start = timestamp.parsed('2019-01-01')
    const end = timestamp.parsed('2019-12-31')
    const tests = timestamp.daysBetween(start, end)
    expect(tests).toBe(364)
  })

  it('daysBetween 2020-01-01 and 2020-03-31 (Leap Year)', async () => {
    const start = timestamp.parsed('2020-01-01')
    const end = timestamp.parsed('2020-03-31')
    const tests = timestamp.daysBetween(start, end)
    expect(tests).toBe(90)
  })

  it('daysBetween 2019-01-01 and 2019-03-31 (NOT Leap Year)', async () => {
    const start = timestamp.parsed('2019-01-01')
    const end = timestamp.parsed('2019-03-31')
    const tests = timestamp.daysBetween(start, end)
    expect(tests).toBe(89)
  })
})
