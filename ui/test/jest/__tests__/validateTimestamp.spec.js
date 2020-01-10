// eslint-disable-next-line node/no-missing-require
const timestamp = require('utils/timestamp.js')

describe('[TIMESTAMP] validateTimestamp', () => {

  it('validateTimestamp correct', async () => {
    const tests = timestamp.validateTimestamp('2020-01-01')
    expect(tests).toBe(true)
  })

  it('validateTimestamp with time correct', async () => {
    const tests = timestamp.validateTimestamp('2020-01-01 03:00')
    expect(tests).toBe(true)
  })

  it('validateTimestamp incorrect', async () => {
    const tests = timestamp.validateTimestamp('2020/01/01')
    expect(tests).toBe(false)
  })
})
