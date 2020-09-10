// eslint-disable-next-line node/no-missing-require
const timestamp = require('utils/timestamp.js')

describe('[TIMESTAMP] getStartOfMonth', () => {
  it('getStartOfMonth 2020-01-01', async () => {
    const ts = timestamp.parsed('2020-01-01')
    const tests = timestamp.getStartOfMonth(ts)
    expect(tests.day).toBe(1)
  })

  it('getStartOfMonth 2020-01-31', async () => {
    const ts = timestamp.parsed('2020-01-31')
    const tests = timestamp.getStartOfMonth(ts)
    expect(tests.day).toBe(1)
  })

  it('getStartOfMonth 2022-08-08', async () => {
    const ts = timestamp.parsed('2022-08-08')
    const tests = timestamp.getStartOfMonth(ts)
    expect(tests.day).toBe(1)
  })
})
