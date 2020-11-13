// eslint-disable-next-line node/no-missing-require
const timestamp = require('utils/Timestamp.js')

describe('[TIMESTAMP] updateDayOfYear', () => {
  it('updateDayOfYear Jan 1', async () => {
    const ts = timestamp.parseTimestamp('2020-01-01')
    const tests = timestamp.updateDayOfYear(ts)
    expect(tests.doy).toBe(1)
  })

  it('updateDayOfYear Dec 31 2020 (Leap Year)', async () => {
    const ts = timestamp.parseTimestamp('2020-12-31')
    const tests = timestamp.updateDayOfYear(ts)
    expect(tests.doy).toBe(366)
  })

  it('updateDayOfYear Dec 31 2019 (NOT Leap Year)', async () => {
    const ts = timestamp.parseTimestamp('2019-12-31')
    const tests = timestamp.updateDayOfYear(ts)
    expect(tests.doy).toBe(365)
  })

  it('updateDayOfYear invalid', async () => {
    const ts = timestamp.parseTimestamp('2020-01-01')
    ts.year = 0
    const tests = timestamp.updateDayOfYear(ts)
    expect(tests.doy).toBe(undefined)
  })
})
