// eslint-disable-next-line node/no-missing-require
const timestamp = require('utils/timestamp.js')

describe('[TIMESTAMP] diffTimestamp', () => {
  it('diffTimestamp 1 day', async () => {
    const ts = timestamp.parsed('2020-01-01')
    const ts2 = timestamp.parsed('2020-01-02')
    const tests = timestamp.diffTimestamp(ts, ts2)
    expect(tests).toBe(1)
  })

  it('diffTimestamp 5 days', async () => {
    const ts = timestamp.parsed('2020-01-01')
    const ts2 = timestamp.parsed('2020-01-06')
    const tests = timestamp.diffTimestamp(ts, ts2)
    expect(tests).toBe(5)
  })

  it('diffTimestamp 10 days', async () => {
    const ts = timestamp.parsed('2020-01-01')
    const ts2 = timestamp.parsed('2020-01-11')
    const tests = timestamp.diffTimestamp(ts, ts2)
    expect(tests).toBe(10)
  })

  it('diffTimestamp 30 days', async () => {
    const ts = timestamp.parsed('2020-01-01')
    const ts2 = timestamp.parsed('2020-01-31')
    const tests = timestamp.diffTimestamp(ts, ts2)
    expect(tests).toBe(30)
  })

  it('diffTimestamp 31 days', async () => {
    const ts = timestamp.parsed('2020-01-01')
    const ts2 = timestamp.parsed('2020-02-01')
    const tests = timestamp.diffTimestamp(ts, ts2)
    expect(tests).toBe(31)
  })

  it('diffTimestamp 2019', async () => {
    const ts = timestamp.parsed('2019-01-01')
    const ts2 = timestamp.parsed('2019-12-31')
    const tests = timestamp.diffTimestamp(ts, ts2)
    expect(tests).toBe(364)
  })

  it('diffTimestamp 2020 (Leap Year)', async () => {
    const ts = timestamp.parsed('2020-01-01')
    const ts2 = timestamp.parsed('2020-12-31')
    const tests = timestamp.diffTimestamp(ts, ts2)
    expect(tests).toBe(365)
  })
})
