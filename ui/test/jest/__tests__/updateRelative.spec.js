// eslint-disable-next-line node/no-missing-require
const timestamp = require('utils/Timestamp.js')

describe('[TIMESTAMP] updateRelative', () => {
  it('updateRelative 1 day', async () => {
    const ts = timestamp.parseTimestamp('2020-01-01')
    const tests = timestamp.updateRelative(ts, timestamp.parseTimestamp('2020-01-01'))
    expect(tests.future).toBe(false)
    expect(tests.current).toBe(true)
    expect(tests.past).toBe(false)
  })

  it('updateRelative 1 day with time', async () => {
    const ts = timestamp.parseTimestamp('2020-01-01 03:00')
    const tests = timestamp.updateRelative(ts, timestamp.parseTimestamp('2020-01-01 03:00'), true)
    expect(tests.future).toBe(false)
    expect(tests.current).toBe(true)
    expect(tests.past).toBe(false)
  })
})
