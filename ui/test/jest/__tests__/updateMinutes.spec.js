// eslint-disable-next-line node/no-missing-require
const timestamp = require('utils/timestamp.js')

describe('[TIMESTAMP] updateMinutes', () => {

  it('updateMinutes 2020-01-01 03:00 + 300', async () => {
    const ts = timestamp.parseTimestamp('2020-01-01 03:00')
    const tests = timestamp.updateMinutes(ts, 300)
    expect(tests.hasTime).toBe(true)
    expect(tests.hour).toBe(5)
    expect(tests.minute).toBe(0)
  })

  it('updateMinutes 2020-01-01 03:00 + 300, with now', async () => {
    const ts = timestamp.parseTimestamp('2020-01-01 03:00')
    const tests = timestamp.updateMinutes(ts, 300, timestamp.parseDate(new Date))
    expect(tests.hasTime).toBe(true)
    expect(tests.hour).toBe(5)
    expect(tests.minute).toBe(0)
  })

})
