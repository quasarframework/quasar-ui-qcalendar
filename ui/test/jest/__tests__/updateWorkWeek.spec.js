// eslint-disable-next-line node/no-missing-require
const timestamp = require('utils/Timestamp.js')

describe('[TIMESTAMP] updateWorkWeek', () => {
  it('updateWorkWeek Jan 1', async () => {
    const ts = timestamp.parseTimestamp('2020-01-01')
    const tests = timestamp.updateWorkWeek(ts)
    expect(tests.workweek).toBe(1)
  })

  it('updateWorkWeek Dec 31', async () => {
    const ts = timestamp.parseTimestamp('2020-12-31')
    const tests = timestamp.updateWorkWeek(ts, true)
    expect(tests.workweek).toBe(53)
  })

  it('updateWorkWeek invalid', async () => {
    const ts = timestamp.parseTimestamp('2020-12-31')
    ts.year = 0
    const tests = timestamp.updateWorkWeek(ts)
    expect(tests.workweek).toBe(0)
  })
})
