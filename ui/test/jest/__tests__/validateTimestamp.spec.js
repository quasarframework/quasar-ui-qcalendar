// eslint-disable-next-line node/no-missing-require
const timestamp = require('utils/Timestamp.js')

describe('[TIMESTAMP] validateTimestamp', () => {
  it('validateTimestamp correct', async () => {
    const tests = timestamp.validateTimestamp('2020-01-01')
    expect(tests).toBe(true)
  })

  it('validateTimestamp with time correct', async () => {
    const tests = timestamp.validateTimestamp('2020-01-01 03:00')
    expect(tests).toBe(true)
  })

  it('validateTimestamp with forward slash', async () => {
    const tests = timestamp.validateTimestamp('2020/01/01')
    expect(tests).toBe(true)
  })

  it('validateTimestamp with dots', async () => {
    const tests = timestamp.validateTimestamp('2020.01.01')
    expect(tests).toBe(true)
  })
})
