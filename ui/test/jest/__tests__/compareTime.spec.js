// eslint-disable-next-line node/no-missing-require
const timestamp = require('utils/timestamp.js')

describe('[TIMESTAMP] compareTime', () => {
  it('Compare 2 times are the same', async () => {
    const ts1 = timestamp.parsed('2020-01-01 01:00')
    const ts2 = timestamp.parsed('2020-01-01 01:00')
    const tests = timestamp.compareTime(ts1, ts2)
    expect(tests).toBe(true)
  })

  it('Compare 2 times are NOT the same', async () => {
    const ts1 = timestamp.parsed('2020-01-01 01:00')
    const ts2 = timestamp.parsed('2020-12-31 02:00')
    const tests = timestamp.compareTime(ts1, ts2)
    expect(tests).toBe(false)
  })

  it('Compare 2 times are the same with Date', async () => {
    const ts1 = timestamp.parsed('2020-01-01 01:00')
    const ts2 = timestamp.parseDate(new Date(2020, 0, 1, 1, 0, 0))
    const tests = timestamp.compareTime(ts1, ts2)
    expect(tests).toBe(true)
  })

  it('Compare 2 times are NOT the same with Date', async () => {
    const ts1 = timestamp.parsed('2020-01-01 01:00')
    const ts2 = timestamp.parseDate(new Date(2020, 11, 31, 2, 0, 0))
    const tests = timestamp.compareTime(ts1, ts2)
    expect(tests).toBe(false)
  })
})
