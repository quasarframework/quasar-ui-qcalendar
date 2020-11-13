// eslint-disable-next-line node/no-missing-require
const timestamp = require('utils/Timestamp.js')

describe('[TIMESTAMP] getEndOfMonth', () => {
  it('getEndOfMonth 2020-01-01', async () => {
    const ts = timestamp.parsed('2020-01-01')
    const tests = timestamp.getEndOfMonth(ts)
    expect(tests.day).toBe(31)
  })

  it('getEndOfMonth 2020-02-01 (Leap Year)', async () => {
    const ts = timestamp.parsed('2020-02-01')
    const tests = timestamp.getEndOfMonth(ts)
    expect(tests.day).toBe(29)
  })

  it('getEndOfMonth 2019-02-01 (NOT Leap Year)', async () => {
    const ts = timestamp.parsed('2019-02-01')
    const tests = timestamp.getEndOfMonth(ts)
    expect(tests.day).toBe(28)
  })
})
