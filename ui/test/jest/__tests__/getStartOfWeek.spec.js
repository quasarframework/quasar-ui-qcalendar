// eslint-disable-next-line node/no-missing-require
const timestamp = require('utils/timestamp.js')

describe('[TIMESTAMP] getStartOfWeek', () => {

  it('getStartOfWeek 2020-01-01', async () => {
    const ts = timestamp.parseTimestamp('2020-01-01')
    const tests = timestamp.getStartOfWeek(ts, [0,1,2,3,4,5,6])
    expect(tests.day).toBe(29)
  })

  it('getStartOfWeek 2020-01-31', async () => {
    const ts = timestamp.parseTimestamp('2020-01-31')
    const tests = timestamp.getStartOfWeek(ts, [0,1,2,3,4,5,6])
    expect(tests.day).toBe(26)
  })

  it('getStartOfWeek 2022-08-08', async () => {
    const ts = timestamp.parseTimestamp('2022-08-08')
    const tests = timestamp.getStartOfWeek(ts, [0,1,2,3,4,5,6])
    expect(tests.day).toBe(7)
  })

  it('getStartOfWeek 2022-08-08 with now', async () => {
    const ts = timestamp.parseTimestamp('2022-08-08')
    const tests = timestamp.getStartOfWeek(ts, [0,1,2,3,4,5,6], timestamp.parseDate(new Date))
    expect(tests.day).toBe(7)
  })

  it('getStartOfWeek 2022-08-08, restricted weekdays and now', async () => {
    const ts = timestamp.parseTimestamp('2022-08-08')
    const tests = timestamp.getStartOfWeek(ts, [1,2,3,4,5], timestamp.parseDate(new Date))
    expect(tests.day).toBe(8)
  })

  it('getStartOfWeek 2022-08-01, restricted weekdays, on 1st with now', async () => {
    const ts = timestamp.parseTimestamp('2022-08-01')
    const tests = timestamp.getStartOfWeek(ts, [2,3,4,5], timestamp.parseDate(new Date))
    expect(tests.day).toBe(2)
  })
})
