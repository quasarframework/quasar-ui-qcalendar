// eslint-disable-next-line node/no-missing-require
const timestamp = require('utils/timestamp.js')

describe('[TIMESTAMP] nextDay', () => {
  it('nextDay is Jan 1, 2020', async () => {
    const ts = timestamp.parsed('2019-12-31')
    const tests = timestamp.nextDay(ts)
    expect(tests.year).toBe(2020)
    expect(tests.month).toBe(1)
    expect(tests.day).toBe(1)
  })

  it('nextDay is Feb 1, 2020', async () => {
    const ts = timestamp.parsed('2020-01-31')
    const tests = timestamp.nextDay(ts)
    expect(tests.year).toBe(2020)
    expect(tests.month).toBe(2)
    expect(tests.day).toBe(1)
  })
})
