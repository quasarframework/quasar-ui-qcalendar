// eslint-disable-next-line node/no-missing-require
const timestamp = require('utils/Timestamp.js')

describe('[TIMESTAMP] parsed', () => {
  it('parses date', async () => {
    const tests = timestamp.parsed('2020-01-01')
    expect(tests.year).toBe(2020)
    expect(tests.month).toBe(1)
    expect(tests.day).toBe(1)
    expect(tests.hasTime).toBe(true)
  })

  it('parses date and time', async () => {
    const tests = timestamp.parsed('2020-01-01 03:01')
    expect(tests.year).toBe(2020)
    expect(tests.month).toBe(1)
    expect(tests.day).toBe(1)
    expect(tests.hasTime).toBe(true)
    expect(tests.hour).toBe(3)
    expect(tests.minute).toBe(1)
  })

  it('parses date and time (short)', async () => {
    const tests = timestamp.parsed('2020-1-1 3:01')
    expect(tests.year).toBe(2020)
    expect(tests.month).toBe(1)
    expect(tests.day).toBe(1)
    expect(tests.hasTime).toBe(true)
    expect(tests.hour).toBe(3)
    expect(tests.minute).toBe(1)
  })

  it('parses invalid', async () => {
    const tests = timestamp.parsed()
    expect(tests).toBe(null)
  })
})
