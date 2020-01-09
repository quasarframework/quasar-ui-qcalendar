// eslint-disable-next-line node/no-missing-require
const timestamp = require('utils/timestamp.js')

describe('[TIMESTAMP] prevDay', () => {
  it('prevDay is Dec 31, 2019', async () => {
    const ts = timestamp.parsed('2020-01-01')
    const tests = timestamp.prevDay(ts)
    expect(tests.year).toBe(2019)
    expect(tests.month).toBe(12)
    expect(tests.day).toBe(31)
  })

  it('prevDay is Jan 1, 2020', async () => {
    const ts = timestamp.parsed('2020-02-01')
    const tests = timestamp.prevDay(ts)
    expect(tests.year).toBe(2020)
    expect(tests.month).toBe(1)
    expect(tests.day).toBe(31)
  })
})
