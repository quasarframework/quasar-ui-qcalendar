// eslint-disable-next-line node/no-missing-require
const timestamp = require('utils/timestamp.js')

describe('[TIMESTAMP] parseTimestamp', () => {

  it('parseTimestamp simple', async () => {
    const tests = timestamp.parseTimestamp('2020-01-01')
    expect(tests.hasDay).toBe(true)
    expect(tests.hasTime).toBe(false)
    expect(tests.year).toBe(2020)
    expect(tests.month).toBe(1)
    expect(tests.day).toBe(1)
  })

  it('parseTimestamp with time', async () => {
    const tests = timestamp.parseTimestamp('2020-01-01 03:00')
    expect(tests.hasDay).toBe(true)
    expect(tests.hasTime).toBe(true)
    expect(tests.year).toBe(2020)
    expect(tests.month).toBe(1)
    expect(tests.day).toBe(1)
    expect(tests.hour).toBe(3)
    expect(tests.minute).toBe(0)
  })

  it('parseTimestamp with now', async () => {
    const tests = timestamp.parseTimestamp('2020-01-01 03:00', timestamp.parseDate(new Date))
    expect(tests.hasDay).toBe(true)
    expect(tests.hasTime).toBe(true)
    expect(tests.year).toBe(2020)
    expect(tests.month).toBe(1)
    expect(tests.day).toBe(1)
    expect(tests.hour).toBe(3)
    expect(tests.minute).toBe(0)
    expect(tests.past).toBe(true)
  })

})
