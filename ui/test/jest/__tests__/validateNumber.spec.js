// eslint-disable-next-line node/no-missing-require
const timestamp = require('utils/Timestamp.js')

describe('[TIMESTAMP] validateNumber', () => {
  it('validateNumber true', async () => {
    const tests = timestamp.validateNumber(100)
    expect(tests).toBe(true)
  })

  // takes 2020
  it('validateNumber true (\'2020-01-01\')', async () => {
    const tests = timestamp.validateNumber('2020-01-01')
    expect(tests).toBe(true)
  })

  it('validateNumber true (\'elephant\')', async () => {
    const tests = timestamp.validateNumber('elephant')
    expect(tests).toBe(false)
  })
})
