// eslint-disable-next-line node/no-missing-require
const timestamp = require('utils/Timestamp.js')

describe('[TIMESTAMP] getDayIdentifier', () => {
  it('getDayIdentifier 2020-01-01', async () => {
    const ts = timestamp.parsed('2020-01-01')
    const tests = timestamp.getDayIdentifier(ts)
    expect(tests).toBe(202001010000)
  })

  it('getDayIdentifier 2020-01-31', async () => {
    const ts = timestamp.parsed('2020-01-31')
    const tests = timestamp.getDayIdentifier(ts)
    expect(tests).toBe(202001310000)
  })

  it('getDayIdentifier 2022-08-08', async () => {
    const ts = timestamp.parsed('2022-08-08')
    const tests = timestamp.getDayIdentifier(ts)
    expect(tests).toBe(202208080000)
  })
})
