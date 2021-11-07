// eslint-disable-next-line node/no-missing-require
const timestamp = require('utils/Timestamp.js')

describe('[TIMESTAMP] minTimestamp', () => {
  it('Find the minimum timestamp (without time)', async () => {
    const timestamps = [
      timestamp.parsed('2021-11-07'),
      timestamp.parsed('2021-01-01')
    ]
    const tests = timestamp.minTimestamp(timestamps)
    expect(tests.date).toEqual('2021-01-01')
  })

  it('Find the minimum timestamp (with time)', async () => {
    const timestamps = [
      timestamp.parsed('2021-11-07 01:13'),
      timestamp.parsed('2021-11-07 02:15')
    ]
    const tests = timestamp.minTimestamp(timestamps, true)
    expect(timestamp.compareDateTime(tests, timestamps[ 0 ])).toBe(true)
  })

  it('Find the minimum timestamp with 2 equal timestamps', async () => {
    const timestamps = [
      timestamp.parsed('2021-11-07'),
      timestamp.parsed('2021-11-07')
    ]
    const tests = timestamp.minTimestamp(timestamps)
    expect(tests.date).toEqual('2021-11-07')
  })

})