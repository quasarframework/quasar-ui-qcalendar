// eslint-disable-next-line node/no-missing-require
const timestamp = require('utils/Timestamp.js')

describe('[TIMESTAMP] updateWeekday', () => {
  it('updateWeekday', async () => {
    const ts = timestamp.parseTimestamp('2020-01-01')
    const tests = timestamp.updateWeekday(ts)
    expect(tests.weekday).toBe(3)
  })
})
