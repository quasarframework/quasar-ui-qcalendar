// eslint-disable-next-line node/no-missing-require
const timestamp = require('utils/Timestamp.js')

describe('[TIMESTAMP] weeksBetween', () => {
  it('weeksBetween 2020-01-01 and 2020-12-31', async () => {
    const start = timestamp.parsed('2020-01-01')
    const end = timestamp.parsed('2020-12-31')
    const tests = timestamp.weeksBetween(start, end)
    expect(tests).toBe(53)
  })

  it('weeksBetween 2019-01-01 and 2019-12-31 (NOT Leap Year)', async () => {
    const start = timestamp.parsed('2019-01-01')
    const end = timestamp.parsed('2019-12-31')
    const tests = timestamp.weeksBetween(start, end)
    expect(tests).toBe(53)
  })

  it('weeksBetween 2000-01-01 and 2000-12-31 (Leap Year)', async () => {
    const start = timestamp.parsed('2000-01-01')
    const end = timestamp.parsed('2000-12-31')
    const tests = timestamp.weeksBetween(start, end)
    expect(tests).toBe(53)
  })

  it('weeksBetween 2020-01-01 and 2020-03-31 (Leap Year)', async () => {
    const start = timestamp.parsed('2020-01-01')
    const end = timestamp.parsed('2020-03-31')
    const tests = timestamp.weeksBetween(start, end)
    expect(tests).toBe(14)
  })

  it('weeksBetween 2019-01-01 and 2019-03-31 (Leap Year)', async () => {
    const start = timestamp.parsed('2019-01-01')
    const end = timestamp.parsed('2019-03-31')
    const tests = timestamp.weeksBetween(start, end)
    expect(tests).toBe(14)
  })
})
