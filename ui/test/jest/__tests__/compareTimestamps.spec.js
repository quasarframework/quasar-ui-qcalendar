// eslint-disable-next-line node/no-missing-require
const timestamp = require('utils/timestamp.js')

describe('[TIMESTAMP] compareTimestamps', () => {
  it('Compare 2 timestamps are the same', async () => {
    const ts1 = timestamp.parseTimestamp('2020-01-01')
    const ts2 = timestamp.parseTimestamp('2020-01-01')
    const tests = timestamp.compareTimestamps(ts1, ts2)
    expect(tests).toBe(true)
  })

  it('Compare 2 timestamps are NOT the same', async () => {
    const ts1 = timestamp.parseTimestamp('2020-01-01')
    const ts2 = timestamp.parseTimestamp('2020-12-31')
    const tests = timestamp.compareTimestamps(ts1, ts2)
    expect(tests).toBe(false)
  })

  it('Compare 2 timestamps are the same with Date', async () => {
    const ts1 = timestamp.parseTimestamp('2020-01-01')
    const ts2 = timestamp.parseDate(new Date(2020, 0, 1))
    const tests = timestamp.compareTimestamps(ts1, ts2)
    expect(tests).toBe(true)
  })

  it('Compare 2 timestamps are NOT the same with Date', async () => {
    const ts1 = timestamp.parseTimestamp('2020-01-01')
    const ts2 = timestamp.parseDate(new Date(2020, 11, 31))
    const tests = timestamp.compareTimestamps(ts1, ts2)
    expect(tests).toBe(false)
  })
})
