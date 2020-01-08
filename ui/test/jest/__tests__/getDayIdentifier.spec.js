// eslint-disable-next-line node/no-missing-require
const timestamp = require('utils/timestamp.js')

describe('[TIMESTAMP] getDayIdentifier', () => {
  it('getDayIdentifier 2020-01-01', async () => {
    const ts = timestamp.parsed('2020-01-01')
    const tests = timestamp.getDayIdentifier(ts)
    expect(tests).toBe(20200101)
  })

  it('getDayIdentifier 2020-01-31', async () => {
    const ts = timestamp.parsed('2020-01-31')
    const tests = timestamp.getDayIdentifier(ts)
    expect(tests).toBe(20200131)
  })

  it('getDayIdentifier 2022-08-08', async () => {
    const ts = timestamp.parsed('2022-08-08')
    const tests = timestamp.getDayIdentifier(ts)
    expect(tests).toBe(20220808)
  })
})
