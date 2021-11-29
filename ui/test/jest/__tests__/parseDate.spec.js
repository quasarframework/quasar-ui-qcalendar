// eslint-disable-next-line node/no-missing-require
const timestamp = require('utils/Timestamp.js')

describe('[TIMESTAMP] parseDate', () => {
  it('parseDate no time', async () => {
    const tests = timestamp.parseDate(new Date(2020, 0, 1))
    expect(tests.hasDay).toBe(true)
    expect(tests.hasTime).toBe(true)
    expect(tests.year).toBe(2020)
    expect(tests.month).toBe(1)
    expect(tests.day).toBe(1)
  })

  it('parseTimestamp with time', async () => {
    const tests = timestamp.parseDate(new Date(2020, 0, 1, 3, 0))
    expect(tests.hasDay).toBe(true)
    expect(tests.hasTime).toBe(true)
    expect(tests.year).toBe(2020)
    expect(tests.month).toBe(1)
    expect(tests.day).toBe(1)
    expect(tests.hour).toBe(3)
    expect(tests.minute).toBe(0)
  })
})
