// eslint-disable-next-line node/no-missing-require
const timestamp = require('utils/Timestamp.js')

describe('[TIMESTAMP] getWorkWeek', () => {
  it('getWorkWeek 2021-01-01', async () => {
    const ts = timestamp.parsed('2021-01-01')
    const tests = timestamp.getWorkWeek(ts)
    expect(tests).toStrictEqual(53)
  })
  
  it('getWorkWeek 2021-01-04 (the 4th is always in week 1)', async () => {
    const ts = timestamp.parsed('2021-01-04')
    const tests = timestamp.getWorkWeek(ts)
    expect(tests).toStrictEqual(53)
  })

  it('getWorkWeek when year is 0', async () => {
    const ts = timestamp.parsed('2021-01-04')
    ts.year = 0
    const tests = timestamp.getWorkWeek(ts)
    const today = timestamp.parseTimestamp(timestamp.today())
    expect(tests).toStrictEqual(today.workweek)
  })

  it('getWorkWeek 2021-12-31', async () => {
    const ts = timestamp.parsed('2021-12-32')
    const tests = timestamp.getWorkWeek(ts)
    expect(tests).toStrictEqual(52)
  })
})
