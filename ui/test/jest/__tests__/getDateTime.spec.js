// eslint-disable-next-line node/no-missing-require
const timestamp = require('utils/timestamp.js')

describe('[TIMESTAMP] getDateTime', () => {
  it('getDateTime 2020-01-01 03:21', async () => {
    const ts = timestamp.parsed('2020-01-01 03:21')
    const tests = timestamp.getDateTime(ts)
    expect(tests).toBe('2020-01-01 03:21')
  })

  it('getDateTime 2020-01-01 (no time)', async () => {
    const ts = timestamp.parsed('2020-01-01')
    const tests = timestamp.getDateTime(ts)
    expect(tests).toBe('2020-01-01')
  })
})
