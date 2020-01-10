// eslint-disable-next-line node/no-missing-require
const timestamp = require('utils/timestamp.js')

describe('[TIMESTAMP] diffTimestamp', () => {

  it('diffTimestamp 1 day', async () => {
    const ts = timestamp.parsed('2020-01-01')
    const ts2 = timestamp.parsed('2020-01-02')
    const tests = timestamp.diffTimestamp(ts, ts2)
    expect(tests).toBe(86400000)
  })

  it('diffTimestamp 5 days', async () => {
    const ts = timestamp.parsed('2020-01-01')
    const ts2 = timestamp.parsed('2020-01-06')
    const tests = timestamp.diffTimestamp(ts, ts2)
    expect(tests).toBe(432000000)
  })

  it('diffTimestamp 10 days', async () => {
    const ts = timestamp.parsed('2020-01-01')
    const ts2 = timestamp.parsed('2020-01-11')
    const tests = timestamp.diffTimestamp(ts, ts2)
    expect(tests).toBe(864000000)
  })

  it('diffTimestamp 30 days', async () => {
    const ts = timestamp.parsed('2020-01-01')
    const ts2 = timestamp.parsed('2020-01-31')
    const tests = timestamp.diffTimestamp(ts, ts2)
    expect(tests).toBe(2592000000)
  })

  it('diffTimestamp 31 days', async () => {
    const ts = timestamp.parsed('2020-01-01')
    const ts2 = timestamp.parsed('2020-02-01')
    const tests = timestamp.diffTimestamp(ts, ts2)
    expect(tests).toBe(2678400000)
  })

  it('diffTimestamp 2019', async () => {
    const ts = timestamp.parsed('2019-01-01')
    const ts2 = timestamp.parsed('2019-12-31')
    const tests = timestamp.diffTimestamp(ts, ts2)
    expect(tests).toBe(31449600000)
  })

  it('diffTimestamp 2020 (Leap Year)', async () => {
    const ts = timestamp.parsed('2020-01-01')
    const ts2 = timestamp.parsed('2020-12-31')
    const tests = timestamp.diffTimestamp(ts, ts2)
    expect(tests).toBe(31536000000)
  })

  it('diffTimestamp 2020, reverse dates', async () => {
    const ts = timestamp.parsed('2020-01-01')
    const ts2 = timestamp.parsed('2020-12-31')
    const tests = timestamp.diffTimestamp(ts2, ts)
    expect(tests).toBe(-31536000000)
  })

  it('diffTimestamp 2020, reverse dates, with strict', async () => {
    const ts = timestamp.parsed('2020-01-01')
    const ts2 = timestamp.parsed('2020-12-31')
    const tests = timestamp.diffTimestamp(ts2, ts, true)
    expect(tests).toBe(0)
  })
})
