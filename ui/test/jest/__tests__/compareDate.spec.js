// eslint-disable-next-line node/no-missing-require
const timestamp = require('utils/Timestamp.js')

describe('[TIMESTAMP] compareDate', () => {
  it('Compare 2 dates are the same', async () => {
    const ts1 = timestamp.parsed('2020-01-01')
    const ts2 = timestamp.parsed('2020-01-01')
    const tests = timestamp.compareDate(ts1, ts2)
    expect(tests).toBe(true)
  })

  it('Compare 2 dates are NOT the same', async () => {
    const ts1 = timestamp.parsed('2020-01-01')
    const ts2 = timestamp.parsed('2020-12-31')
    const tests = timestamp.compareDate(ts1, ts2)
    expect(tests).toBe(false)
  })

  it('Compare 2 dates are the same with Date', async () => {
    const ts1 = timestamp.parsed('2020-01-01')
    const ts2 = timestamp.parseDate(new Date(2020, 0, 1))
    const tests = timestamp.compareDate(ts1, ts2)
    expect(tests).toBe(true)
  })

  it('Compare 2 dates are NOT the same with Date', async () => {
    const ts1 = timestamp.parsed('2020-01-01')
    const ts2 = timestamp.parseDate(new Date(2020, 11, 31))
    const tests = timestamp.compareDate(ts1, ts2)
    expect(tests).toBe(false)
  })
})
