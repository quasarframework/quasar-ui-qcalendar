// eslint-disable-next-line node/no-missing-require
const timestamp = require('utils/timestamp.js')

describe('[TIMESTAMP] createIntervalList', () => {

  it('createIntervalList 60 12', async () => {
    const start = timestamp.parseTimestamp('2020-01-01')
    const now = timestamp.parseDate(new Date)
    const tests = timestamp.createIntervalList(start, 0, 60, 12, timestamp.parseDate(new Date))
    expect(tests.length).toBe(12)
  })

  it('createIntervalList 15 12', async () => {
    const start = timestamp.parseTimestamp('2020-01-01 03:00')
    const now = timestamp.parseDate(new Date)
    const tests = timestamp.createIntervalList(start, 8, 15, 48, timestamp.parseDate(new Date))
    expect(tests.length).toBe(48)
  })

})
