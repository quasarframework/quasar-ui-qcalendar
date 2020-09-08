// eslint-disable-next-line node/no-missing-require
const timestamp = require('utils/timestamp.js')

describe('[TIMESTAMP] padNumber', () => {
  it('padNumber 1, len 2', async () => {
    const tests = timestamp.padNumber(1, 2)
    expect(tests).toBe('01')
  })

  it('padNumber 10, len 2', async () => {
    const tests = timestamp.padNumber(10, 2)
    expect(tests).toBe('10')
  })

  it('padNumber 1, len 4', async () => {
    const tests = timestamp.padNumber(1, 4)
    expect(tests).toBe('0001')
  })

  it('padNumber 10, len 4', async () => {
    const tests = timestamp.padNumber(10, 4)
    expect(tests).toBe('0010')
  })
})
