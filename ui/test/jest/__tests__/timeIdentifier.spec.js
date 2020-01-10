// eslint-disable-next-line node/no-missing-require
const timestamp = require('utils/timestamp.js')

describe('[TIMESTAMP] getTimeIdentifier', () => {
  it('getTimeIdentifier 2020-01-01 13:05', async () => {
    const ts = timestamp.parsed('2020-01-01 13:05')
    const tests = timestamp.getTimeIdentifier(ts)
    expect(tests).toBe(1305)
  })

  it('getTimeIdentifier 2020-01-31 17:28', async () => {
    const ts = timestamp.parsed('2020-01-31 17:28')
    const tests = timestamp.getTimeIdentifier(ts)
    expect(tests).toBe(1728)
  })

  it('getTimeIdentifier 2022-08-08 24:13', async () => {
    const ts = timestamp.parsed('2022-08-08 24:13')
    const tests = timestamp.getTimeIdentifier(ts)
    expect(tests).toBe(2413)
  })

  it('getTimeIdentifier 2022-08-08 00:13', async () => {
    const ts = timestamp.parsed('2022-08-08 00:13')
    const tests = timestamp.getTimeIdentifier(ts)
    expect(tests).toBe(13)
  })

  it('getTimeIdentifier no time given', async () => {
    const ts = timestamp.parsed('2022-08-08')
    const tests = timestamp.getTimeIdentifier(ts)
    expect(tests).toBe(0)
  })
})
